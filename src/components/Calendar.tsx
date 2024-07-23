import React, { useState, useEffect } from "react";
import "./styles/Calendar.css";
import { Info, DateTime, Interval } from "luxon";
import classnames from "classnames";
import AddMeetingForm from "./AddMeetingForm";
import Modal from "./Modal";
import supabase from "../supabaseClient";

interface Meeting {
  time: string;
  description: string;
}

interface CalendarProps {
  userId: string;
  meetings: Record<string, Meeting[]>;
  state: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    startMonth: number;
    startYear: number;
  };
}

const Calendar: React.FC<CalendarProps> = ({ userId, meetings: initialMeetings, state }) => {
  const today = DateTime.local();
  const [activeDay, setActiveDay] = useState<DateTime | null>(null);
  const [firstDayOfActiveMonth, setFirstDayOfActiveMonth] = useState<DateTime>(
    DateTime.fromObject({ year: state.startYear, month: state.startMonth }).startOf("month")
  );
  const [meetings, setMeetings] = useState<Record<string, Meeting[]>>(initialMeetings);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const [selectedMonth, setSelectedMonth] = useState<number>(state.startMonth);
  const [selectedYear, setSelectedYear] = useState<number>(state.startYear);

  const sortMeetings = (meetings: Record<string, Meeting[]>) => {
    for (const date in meetings) {
      meetings[date].sort((a, b) => a.time.localeCompare(b.time));
    }
  };

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from("Plans")
        .select("*")
        .eq("user_id", userId)
        .eq("itinerary_id", state.id);
      if (error) {
        throw error;
      }
      const fetchedMeetings = data.reduce((acc: Record<string, Meeting[]>, meeting) => {
        const date = meeting.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push({ time: meeting.time, description: meeting.description });
        return acc;
      }, {});
      sortMeetings(fetchedMeetings);
      setMeetings(fetchedMeetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [userId, state.id]);

  useEffect(() => {
    setFirstDayOfActiveMonth(DateTime.fromObject({ year: selectedYear, month: selectedMonth }).startOf("month"));
  }, [selectedMonth, selectedYear]);

  const handleAddMeeting = async (date: string, time: string, description: string) => {
    const newMeeting = { time, description };
    setMeetings((prevMeetings) => {
      const updatedMeetings = { ...prevMeetings };
      if (!updatedMeetings[date]) {
        updatedMeetings[date] = [];
      }
      updatedMeetings[date].push(newMeeting);
      updatedMeetings[date].sort((a, b) => a.time.localeCompare(b.time));
      return updatedMeetings;
    });

    try {
      const { data: existingData, error: existingError } = await supabase
        .from("Plans")
        .select("*")
        .eq("user_id", userId)
        .eq("date", date)
        .eq("time", time)
        .eq("itinerary_id", state.id);

      if (existingError) {
        throw existingError;
      }

      if (existingData && existingData.length > 0) {
        const { error: updateError } = await supabase
          .from("Plans")
          .update({ description })
          .eq("user_id", userId)
          .eq("date", date)
          .eq("time", time)
          .eq("itinerary_id", state.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        const { error: insertError } = await supabase
          .from("Plans")
          .insert({ user_id: userId, date, time, description, itinerary_id: state.id });

        if (insertError) {
          throw insertError;
        }
      }

      fetchMeetings();
    } catch (error) {
      console.error("Error adding or updating meeting:", error);
    }
  };

  const handleDeleteMeeting = async (date: string, time: string) => {
    setMeetings((prevMeetings) => {
      const updatedMeetings = { ...prevMeetings };
      updatedMeetings[date] = updatedMeetings[date].filter((meeting) => meeting.time !== time);
      if (updatedMeetings[date].length === 0) {
        delete updatedMeetings[date];
      }
      return updatedMeetings;
    });

    try {
      const { error } = await supabase
        .from("Plans")
        .delete()
        .eq("user_id", userId)
        .eq("date", date)
        .eq("time", time)
        .eq("itinerary_id", state.id);

      if (error) {
        throw error;
      }

      fetchMeetings();
    } catch (error) {
      console.error("Error deleting meeting:", error);
    }
  };

  const activeDayMeetings = meetings[activeDay?.toISODate() ?? ""] ?? [];
  const weekDays = Info.weekdays("short");
  const daysOfMonth = Interval.fromDateTimes(
    firstDayOfActiveMonth.startOf("week"),
    firstDayOfActiveMonth.endOf("month").endOf("week")
  )
    .splitBy({ day: 1 })
    .map((day) => day.start as DateTime);

  const goToPreviousMonth = () => {
    const newDate = firstDayOfActiveMonth.minus({ month: 1 });
    setSelectedMonth(newDate.month);
    setSelectedYear(newDate.year);
  };

  const goToNextMonth = () => {
    const newDate = firstDayOfActiveMonth.plus({ month: 1 });
    setSelectedMonth(newDate.month);
    setSelectedYear(newDate.year);
  };

  const goToToday = () => {
    const newDate = today.startOf("month");
    setSelectedMonth(newDate.month);
    setSelectedYear(newDate.year);
  };

  const handleUpdateClick = () => {
    setIsUpdating(true);
    setShowModal(true);
  };

  const handleFinishUpdating = () => {
    setIsUpdating(false);
    setShowModal(false);
  };

  return (
    <div className="calendar_background">
      <div className="calendar-container">
        <div className="calendar">
          <div className="calendar-headline">
            <div className="calendar-headline-month">
              <select className="calendar-headline-month-name"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {Info.months().map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {Array.from({ length: 10 }, (_, i) => today.year - 5 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="calendar-headline-controls">
              <div
                className="calendar-headline-control"
                onClick={goToPreviousMonth}
              >
                «
              </div>
              <div
                className="calendar-headline-control calendar-headline-controls-today"
                onClick={goToToday}
              >
                Today
              </div>
              <div
                className="calendar-headline-control"
                onClick={goToNextMonth}
              >
                »
              </div>
            </div>
          </div>
          <div className="calendar-weeks-grid">
            {weekDays.map((weekDay, weekDayIndex) => (
              <div key={weekDayIndex} className="calendar-weeks-grid-cell">
                {weekDay}
              </div>
            ))}
          </div>
          <div className="calendar-grid">
            {daysOfMonth.map((dayOfMonth, dayOfMonthIndex) => {
              const isoDate = dayOfMonth.toISODate();
              return (
                <div
                  key={dayOfMonthIndex}
                  className={classnames({
                    "calendar-grid-cell": true,
                    "calendar-grid-cell-inactive":
                      dayOfMonth.month !== firstDayOfActiveMonth.month,
                    "calendar-grid-cell-active":
                      activeDay?.toISODate() === dayOfMonth.toISODate(),
                    "calendar-grid-cell-highlight": isoDate && meetings[isoDate]?.length > 0,
                  })}
                  onClick={() => setActiveDay(dayOfMonth)}
                >
                  {dayOfMonth.day}
                </div>
              );
            })}
          </div>
        </div>
        <div className="schedule">
          <div className="schedule-headline">
            <p>{state.name}</p>
            <p>{state.start_date} to {state.end_date}</p>
          </div>
          {activeDay && (
            <div>
              <h3>Activities for {activeDay.toISODate()}:</h3>
              <ul>
                {activeDayMeetings.sort((a, b) => a.time.localeCompare(b.time)).map((meeting, index) => (
                  <li key={index}>
                    {meeting.time} - {meeting.description}
                    {isUpdating && (
                      <button onClick={() => handleDeleteMeeting(activeDay.toISODate()!, meeting.time)}>Delete</button>
                    )}
                  </li>
                ))}
              </ul>
              <button 
                onClick={isUpdating ? handleFinishUpdating : handleUpdateClick}
                className="update-button"
              >
                {isUpdating ? "Finish Updating" : "Update"}
              </button>
            </div>
          )}
        </div>
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <AddMeetingForm userId={userId} onAddMeeting={handleAddMeeting} date={activeDay?.toISODate() || undefined} />
      </Modal>
    </div>
  );
};

export default Calendar;
