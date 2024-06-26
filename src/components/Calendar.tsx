import React, { useState, useEffect } from "react";
import "./Calendar.css";
import { Info, DateTime, Interval } from "luxon";
import classnames from "classnames";
import AddMeetingForm from "./AddMeetingForm";
import supabase from "../supabaseClient";

interface CalendarProps {
  userId: string;
  meetings: Record<string, string[]>;
}

const Calendar: React.FC<CalendarProps> = ({ userId, meetings: initialMeetings }) => {
  const today = DateTime.local();
  const [activeDay, setActiveDay] = useState<DateTime | null>(null);
  const [firstDayOfActiveMonth, setFirstDayOfActiveMonth] = useState<DateTime>(
    today.startOf("month")
  );
  const [meetings, setMeetings] = useState<Record<string, string[]>>(initialMeetings);

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from("Plans")
        .select("*")
        .eq("user_id", userId);
      if (error) {
        throw error;
      }
      console.log('Raw fetched data:', data);
      const fetchedMeetings = data.reduce((acc: Record<string, string[]>, meeting) => {
        acc[meeting.date] = meeting.meetings;
        return acc;
      }, {});
      console.log('Processed fetched meetings:', fetchedMeetings);
      setMeetings(fetchedMeetings);
    } catch (error) {
      console.error("Error fetching meetings:", (error as Error).message);
    }
  };

  useEffect(() => {
    fetchMeetings();

    return () => {
      
    };
  }, [userId]);

  const handleAddMeeting = async (date: string, description: string) => {
    console.log('Adding meeting:', { date, description });
  
    setMeetings((prevMeetings) => {
      const updatedMeetings = { ...prevMeetings };
      if (!updatedMeetings[date]) {
        updatedMeetings[date] = [];
      }
      updatedMeetings[date].push(description);
      return updatedMeetings;
    });
  
    try {
      
      const { data: existingData, error: existingError } = await supabase
        .from("Plans")
        .select("*")
        .eq("user_id", userId)
        .eq("date", date);
  
      console.log('Existing data:', existingData);
  
      if (existingError) {
        throw existingError;
      }
  
      if (existingData && existingData.length > 0) {
        
        const updatedMeetings = [...existingData[0].meetings, description];
        const { data, error: updateError } = await supabase
          .from("Plans")
          .update({ meetings: updatedMeetings })
          .eq("user_id", userId)
          .eq("date", date);
  
        console.log('Update result:', data);
  
        if (updateError) {
          throw updateError;
        }
      } else {
        
        const { data, error: insertError } = await supabase
          .from("Plans")
          .insert({ user_id: userId, date, meetings: [description] });
  
        console.log('Insert result:', data);
  
        if (insertError) {
          throw insertError;
        }
      }
  
      
      fetchMeetings();
    } catch (error) {
      console.error("Error adding or updating meeting:", (error as Error).message);
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
    setFirstDayOfActiveMonth(firstDayOfActiveMonth.minus({ month: 1 }));
  };

  const goToNextMonth = () => {
    setFirstDayOfActiveMonth(firstDayOfActiveMonth.plus({ month: 1 }));
  };

  const goToToday = () => {
    setFirstDayOfActiveMonth(today.startOf("month"));
  };

  return (
    <div className="calendar-container">
      <div className="calendar">
        <div className="calendar-headline">
          <div className="calendar-headline-month">
            {firstDayOfActiveMonth.monthShort}, {firstDayOfActiveMonth.year}
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
          {daysOfMonth.map((dayOfMonth, dayOfMonthIndex) => (
            <div
              key={dayOfMonthIndex}
              className={classnames({
                "calendar-grid-cell": true,
                "calendar-grid-cell-inactive":
                  dayOfMonth.month !== firstDayOfActiveMonth.month,
                "calendar-grid-cell-active":
                  activeDay?.toISODate() === dayOfMonth.toISODate(),
              })}
              onClick={() => setActiveDay(dayOfMonth)}
            >
              {dayOfMonth.day}
            </div>
          ))}
        </div>
      </div>
      <AddMeetingForm userId={userId} onAddMeeting={handleAddMeeting} />
      {activeDay && (
        <div>
          <h3>Meetings for {activeDay.toISODate()}:</h3>
          <ul>
            {activeDayMeetings.map((meeting, index) => (
              <li key={index}>{meeting}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Calendar;
