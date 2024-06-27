import { useState } from "react";
import "./MyItinerary.css";
import Navbar from "./Navbar";

type cardsProps = {
    title: string;
    content: string;
}

function MyItinerary() {

    const [cards, setCards] = useState<cardsProps[]>([
        { title: 'Trip to Japan', content: '08/06/2024 - 15/06/2024' },
        { title: 'Trip to Japan', content: '08/06/2024 - 15/06/2024' }
    ]);

    return (
        <div>
            <div className="itinerary_background">
                <Navbar />
                <div className="setItinerary">
                    <h1>My Itineraries</h1>
                    <div className="card_container">
                        {cards.map((card, index) => (
                            <Card key={index} title={card.title} content={card.content} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

const handleCardClick = (title: string) => {
    alert(`Clicked on ${title}`);
}

function Card({ title, content }: cardsProps) {
    return (
        <div className="card-container">
            <div className="card" onClick={() => handleCardClick(title)}>
                <h2>{title}</h2>
                <p>{content}</p>
            </div>
        </div>
    );
}

export default MyItinerary;