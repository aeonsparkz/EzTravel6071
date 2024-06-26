import { Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import Home from "./components/CalendarHandler";
import CalendarHandler from "./components/CalendarHandler";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Home" element={<CalendarHandler />} />
      </Routes>
    </>
  );
}

export default App;
