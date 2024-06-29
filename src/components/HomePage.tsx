import "./styles/HomePage.css";
import Navbar from "./Navbar";

function HomePage() {
    return (
        <div>
            <Navbar />
            <div className="Homepage">
                <div className="Homepage_content">
                    <h1>
                        Ready to plan your next trip?
                    </h1>
                    <a href="/CreateItinerary">Lets Go</a>
                </div>
            </div>
        </div>
    )
}

export default HomePage;