import "./styles/Navbar.css";
import SignOut from "./SignOut";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar_logoheader">
                <img src="/logo192.png" width={50} height={50} />
                <h1 style={{fontSize:"35px"}}>EzTravel</h1>
            </div>
            <div className="navbar_container">
                <ul>
                    <li><a href="/HomePage">Home</a></li>
                    <li><a href="/CreateItinerary">Create Itinerary</a></li>
                    <li><a href="/MyItinerary">My Itineraries</a></li>
                    <li><a href="/Reviews">Reviews</a></li>
                    <div className="signout_button">
                        <SignOut />
                    </div>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;
