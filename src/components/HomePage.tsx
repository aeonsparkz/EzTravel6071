import "./HomePage.css";
import Image from "./image/image.jpg"

function HomePage() {
    return (
        <div>
            <div className="Homepage">
                <div className="Homepage_content">
                    <h1>EzTravel</h1>
                    <p>
                        Ready to plan your next trip?
                    </p>
                    <a href="/CalendarHandler">Start Now</a>
                </div>
            </div>
        </div>
    )
}

export default HomePage;