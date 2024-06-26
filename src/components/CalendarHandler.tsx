import React, { useState, useEffect } from "react";
import supabase from "../supabaseClient";
import Calendar from "./Calendar";

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
          console.log('Fetched user:', user);
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
    "2024-04-05": ["Drink Coffee", "Learn React", "Sleep"],
    "2024-04-06": ["Drink Coffee", "Learn Angular", "Sleep"],
  };

  return (
    <div>
      <Calendar userId={userId} meetings={meetings} />
    </div>
  );
};

export default CalendarHandler;
