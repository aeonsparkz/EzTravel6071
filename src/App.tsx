import { Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import CalendarHandler from "./components/CalendarHandler";
import HomePage from "./components/HomePage";
import CreateItinerary from "./components/CreateItinerary";
import MyItinerary from  "./components/MyItinerary";
import ItineraryPage from "./components/ItineraryPage";
import Reviews from "./components/Reviews";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/CalendarHandler" element={<CalendarHandler />} />
        <Route path="/CreateItinerary" element={<CreateItinerary/>} />
        <Route path="/MyItinerary" element={<MyItinerary />} />
        <Route path="/ItineraryPage" element={<ItineraryPage />} />
        <Route path="/Reviews" element = {<Reviews />} />
      </Routes>
    </>
  );
}

export default App;
