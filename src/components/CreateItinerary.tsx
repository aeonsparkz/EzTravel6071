import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CreateItinerary.css";
import Navbar from "./Navbar";

function CreateItinerary() {

    interface State {
        name: string;
        startDate: string;
        endDate: string;
    }



    const [name, setName] = useState("");
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const handleButtonClick = (e: React.FormEvent<HTMLFormElement>) => {
        const state: State = {
            name,
            startDate,
            endDate,
        }

        if(name && startDate && endDate) {
        navigate('/CalendarHandler', { state })
        } else {
            alert("Please fill in the required fields");
        }
    }

    return (
        <div>
            <Navbar />
            <div className="tripinput">
                <div className="tripinput_container">
                    <h1>KEY IN THE TITLE AND START/END DATES OF YOUR TRIP</h1>
                    <label>Title</label>
                    <form onSubmit={handleButtonClick}>
                    <input type="text" id="trip-name"
                        placeholder="Enter Title Of Trip"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    /><label>Start Date:</label>
                    <input
                        type="date"
                        id="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                    <label>End Date:</label>
                    <input
                        type="date"
                        id="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                    <button
                    style={{
                        backgroundColor:'blue', 
                        color:'white', 
                        borderRadius:'5px', 
                        margin: '10px', 
                        width: '120px',
                        height:'25px'}} type="submit">
                    Start Planning!</button>
                    </form>
                </div>
            </div>
        </div >
    )
}

export default CreateItinerary;