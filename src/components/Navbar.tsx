import "./styles/Navbar.css";
import SignOut from "./SignOut";

function Navbar() {
    return (
        <nav className="navbar">
            <h1>EzTravel</h1>
            <div className="navbar_container">
                <ul>
                    <li><a href="/HomePage">Home</a></li>
                    <li><a href="/CreateItinerary">Create Itinerary</a></li>
                    <li><a href="/MyItinerary">My Itineraries</a></li>
                    <div className="signout_button">
                        <SignOut />
                    </div>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;
