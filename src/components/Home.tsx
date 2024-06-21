import React from "react";
import supabase from "../supabaseClient";
import WeeklySchedule from "./WeeklySchedule";

function Home() {
  return <div><WeeklySchedule /></div>;
}

export default Home;
