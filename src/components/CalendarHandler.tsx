// CalendarHandler.tsx

import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";
import Calendar from "./Calendar";
import SignOut from "./SignOut";
import ExpenditureTracker from "./ExpenditureTracker";

const CalendarHandler: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          throw error;
        }
        if (user) {
          setUserId(user.id);
        }
      } catch (error) {
        console.error("Error fetching user:", (error as Error).message);
      }
    };

    fetchUser();
  }, []);

  if (!userId) {
    return <div>Loading...</div>;
  }

  const meetings = {
    "2024-06-26": [
      { time: "09:00", description: "Drink Coffee" },
      { time: "10:00", description: "Learn React" },
      { time: "12:00", description: "Lunch" }
    ],
    "2024-06-27": [
      { time: "09:00", description: "Morning Jog" },
      { time: "11:00", description: "Team Meeting" },
      { time: "14:00", description: "Project Work" }
    ]
  };

  return (
    <div className="calendar-handler">
      <div className="sign-out-button">
        <SignOut />
      </div>
      <Calendar userId={userId} meetings={meetings} />
      <ExpenditureTracker />
    </div>
  );
};

export default CalendarHandler;
