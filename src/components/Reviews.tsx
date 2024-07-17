import Navbar from "./Navbar";
import Card from "./Card";
import "./styles/Reviews.css";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import supabase from "../supabaseClient";
import StarRatings from 'react-star-ratings';

function Reviews() {

    type reviewsProps = {
        review_id: string;
        title: string;
        body: string;
        ratings: number;
        numberOfRatings: number;
    }

    const [reviews, setReviews] = useState<reviewsProps[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReview, setSelectedReview] = useState<reviewsProps | null>(null);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (data?.user) {
                setUserId(data.user.id);
            } else {
                console.error('User not logged in', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const { data, error } = await supabase
                .from('Reviews')
                .select('*');

            if (error) {
                console.error('Error fetching data:', error);
                return;
            }

            if (data) {
                console.log('Fetched data:', data);
                setReviews(data);
            }
        };
        fetchData();
    }, [userId]);

    const handleCardClick = (review: reviewsProps) => {
        setSelectedReview(review);
        setIsModalOpen(true);
    }

    const handleAddModal = () => {
        setIsAddReviewModalOpen(true);
    }

    const handleSubmitReview = async (event: { preventDefault: any; }) => {
        event.preventDefault();
        if (body && title) {
            const { data, error } = await supabase
                .from('Reviews')
                .insert({ user_id: userId, title: title, body: body, ratings: 0, numberOfRatings: 0 })
                .select();

            if (error) {
                console.error('Error inserting activity:', error);
                return;
            }

            if (data && data.length > 0) {
                const newReview = data[0];
                console.log('New review inserted:', newReview);
                setReviews([
                    ...reviews,
                    { review_id: newReview.review_id, title: newReview.title, body: newReview.body, ratings: 0, numberOfRatings: 0 }
                ]);
                setBody("");
                setTitle("");
            }
        }
    }

    const handleRatingChange = async (newRating: number) => {
        if (selectedReview) {

            let newNumberOfRatings = selectedReview.numberOfRatings;
            let totalRating = selectedReview.ratings * selectedReview.numberOfRatings;
            const { data: existingRating, error: existingRatingError } = await supabase
                .from('UserRatings')
                .select('*')
                .eq('user_id', userId)
                .eq('review_id', selectedReview.review_id)
                .single();

            if (existingRatingError) {
                console.error("Error checking for existing rating", existingRatingError)
            }

            if (existingRating) {
                totalRating = totalRating - existingRating.ratings + newRating
                const { data, error: updateRatingsError } = await supabase
                    .from('UserRatings')
                    .update({ ratings: newRating })
                    .eq('rating_id', existingRating.rating_id)

                if (updateRatingsError) {
                    console.error("Error updating rating", updateRatingsError);
                }

                if (data) {
                    console.log("Fetched data", data)
                }

            } else {
                newNumberOfRatings = newNumberOfRatings + 1;
                totalRating = totalRating + newRating;
                const { data, error } = await supabase
                    .from('UserRatings')
                    .insert({ user_id: userId, review_id: selectedReview.review_id, ratings: newRating });

                if (error) {
                    console.error("Error inserting new user rating", error);
                    return;
                }
                if (data) {
                    console.log("Fetched data", data)
                }
            }

            const newRatings = totalRating / newNumberOfRatings;

            const { data, error } = await supabase
                .from('Reviews')
                .update({ ratings: newRatings, numberOfRatings: newNumberOfRatings })
                .eq('review_id', selectedReview.review_id);

            if (error) {
                console.error('Error updating rating:', error);
                return;
            }

            if (data) {
                console.log("Fetched data", data)
            }

            setReviews((prevReviews) =>
                prevReviews.map((review) =>
                    review.review_id === selectedReview.review_id
                        ? { ...review, ratings: newRatings, numberOfRatings: newNumberOfRatings }
                        : review
                )
            );

            setSelectedReview((prevSelectedReview) =>
                prevSelectedReview
                    ? { ...prevSelectedReview, ratings: newRatings, numberOfRatings: newNumberOfRatings }
                    : null
            );
        }
    }

    type StarratingProps = {
        stars: number;
        onRatingChange?: (newRating: number) => void;
    }

    const Starrating = ({ stars, onRatingChange }: StarratingProps) => {
        return (
            <div>
                <StarRatings
                    rating={stars}
                    starRatedColor="blue"
                    changeRating={onRatingChange}
                    numberOfStars={5}
                    starDimension='30px'
                />
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="reviews">
                <h1>Reviews And Recommendations</h1>
                <button className="button_addReviews" onClick={handleAddModal}>Add Review</button>
                {isAddReviewModalOpen && (
                    <Modal isOpen={true} onClose={() => setIsAddReviewModalOpen(false)}>
                        <form onSubmit={handleSubmitReview}>
                            <input className="reviews_title"
                                type="text"
                                value={title}
                                onChange={(input) => setTitle(input.target.value)}
                                placeholder="Enter Title"
                                required>
                            </input>
                            <textarea className="reviews_body"
                                value={body}
                                onChange={(input) => setBody(input.target.value)}
                                placeholder="Enter Body"
                                required>
                            </textarea>
                            <button type="submit">Submit Review</button>
                        </form>
                    </Modal>
                )}
                <div className="card_container">
                    {reviews.map((review) => (
                        <div key={review.review_id}>
                            <Card onClick={() => handleCardClick(review)}>
                                <h2>{review.title}</h2>
                                <Starrating stars={review.ratings} />
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
            {selectedReview && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <h2>{selectedReview.title}</h2>
                    <Starrating stars={selectedReview.ratings} onRatingChange={handleRatingChange} />
                    <div>{selectedReview.body}</div>
                </Modal>
            )}
        </div>
    );
}

export default Reviews;
