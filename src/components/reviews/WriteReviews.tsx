/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import './WriteReviews.css';
import { API_BASE } from "../../config/api";

type WriteReviewsProps = {
    movieID: string;
    onReviewCreated?: () => void;
};

const DEMO_USER_ID = '1';
const MAX_REVIEW_LENGTH = 3000;

export default function WriteReviews({ movieID, onReviewCreated }: WriteReviewsProps) {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(0);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!rating) return setError("Please choose a star rating.");
        if (!title.trim() || !message.trim()) return setError("Please enter a title and message for your review.");
        if (message.length > MAX_REVIEW_LENGTH) return setError(`Review text cannot exceed ${MAX_REVIEW_LENGTH} characters.`);

        setSubmitting(true);

        try {
            const response = await fetch(`${API_BASE}/user/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userID: DEMO_USER_ID,
                    username: "Reviewer Name",
                    movieID,
                    title,
                    reviewText: message,
                    rating,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to submit review.");
            };

            setTitle("");
            setMessage("");
            setRating(0);
            setHoverRating(0);
            onReviewCreated?.();
        } catch (error) {
            console.error("Review submit error:", error);
            setError("Could not submit review. Make sure server is running or try again later.");
        } finally {
            setSubmitting(false);
        }
        
    }

    const charactersLeft = MAX_REVIEW_LENGTH - message.length;

    return (
        <section className="write-review-section">
            <form className="write-review-form" onSubmit={handleSubmit}>
                <h2>Leave a Review</h2>
                <p>Submit a review about your feelings about the movie above.</p>

                <label>Choose a Star Rating</label>
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => {
                        const isActive = star <= (hoverRating || rating);
                        
                        return (
                        <button 
                            key={star} 
                            type="button" 
                            className={isActive ? "star active" : "star"}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            aria-label={`${star} star rating`}
                        >
                            &#9733;
                        </button>
                        );
                    })}
                </div>

                <label htmlFor="review-title">Title</label>
                <input
                    id="review-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a title for your review"
                />

                <label htmlFor="review-message">Review</label>
                <textarea
                    id="review-message"
                    value={message}
                    maxLength={MAX_REVIEW_LENGTH}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your review here..."
                />

                <div className={`character-counter ${charactersLeft <= 100 ? "warning" : ""}`}>
                    {charactersLeft} characters remaining
                </div>

                {error && <p className="error">{error}</p>}

                <button className="submit-review-button" type="submit" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Review"}
                </button>
            </form>
        </section>
    );
}