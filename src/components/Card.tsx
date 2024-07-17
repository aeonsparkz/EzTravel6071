import React from 'react';
import "./styles/Card.css";

type CardProps = {
    onClick: () => void;
    children: React.ReactNode;
};

const Card: React.FC<CardProps> = ({ onClick, children } : CardProps) => {
    return (
        <div className="card-container" onClick={onClick}>
            <div className="card">
                {children}
            </div>
        </div>
    );
};

export default Card;