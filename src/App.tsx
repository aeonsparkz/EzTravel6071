import { Router, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUp";
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';
import Home from "./components/Home";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
