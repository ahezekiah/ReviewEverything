/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./OtherReviews.css";

type Comment = {
    _id?: string;
    userID: string;
    username?: string;
    comment: string;
    createdAt?: string;
};

type Review = {
    _id: string;
    movieID: string;
    username?: string;
    title?: string;
    content?: string;
    rating?: number;
    likedBy?: string[];
    dislikedBy?: string[];
    comments?: Comment[];
};

type OtherReviewsProps = {
    movieID: string;
    refreshKey?: number;
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3100/api";
const CURRENT_USER_ID = "1";

export default function OtherReviews({ movieID, refreshKey = 0 }: OtherReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [commentText, setCommentText] = useState<Record<string, string>>({});

    async function fetchReviews() {
        try {
            const res = await fetch(`${API_BASE}/movies/reviews?movieID=${movieID}`);
            const data = await res.json();
            setReviews(data.reviews || []);
        } catch {
            setReviews([]);
        }
    }

    async function toggleLike(reviewID: string) {
        await fetch(`${API_BASE}/reviews/${reviewID}/like`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userID: CURRENT_USER_ID }),
        });

        fetchReviews();
    }

    async function submitComment(e: React.FormEvent, reviewID: string) {
        e.preventDefault();

        const comment = commentText[reviewID]?.trim();
        if (!comment) return;

        await fetch(`${API_BASE}/reviews/${reviewID}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userID: CURRENT_USER_ID,
                username: "Reviewer Name",
                comment,
            }),
        });

        setCommentText((prev) => ({
            ...prev,
            [reviewID]: "",
        }));

        fetchReviews();
    }

    useEffect(() => {
        if (movieID) fetchReviews();
    }, [movieID, refreshKey]);

    return (
        <section className="other-reviews-section">
            <h2>Other Reviews</h2>

            <div className="other-reviews-grid">
                {reviews.length === 0 ? (
                    <p className="empty-reviews">No reviews yet. Be the first one to review this movie.</p>
                ) : (
                    reviews.map((review) => {
                        const rating = Math.min(5, Math.max(0, Math.round(Number(review.rating) || 0)));
                        const liked = review.likedBy?.includes(CURRENT_USER_ID);

                        return (
                            <article className="review-card" key={review._id}>
                                <div className="review-stars">
                                    {"★".repeat(rating)}
                                    {"☆".repeat(5 - rating)}
                                </div>

                                <h3>{review.title || "Review title"}</h3>
                                <p>{review.content || "Review body"}</p>

                                <div className="review-user">
                                    <div className="review-avatar" />
                                    <div>
                                        <strong>{review.username || "Reviewer name"}</strong>
                                        <span>Date</span>
                                    </div>
                                </div>

                                <div className="review-actions">
                                    <button
                                        type="button"
                                        className={liked ? "like-button liked" : "like-button"}
                                        onClick={() => toggleLike(review._id)}
                                    >
                                        👍 {review.likedBy?.length || 0}
                                    </button>
                                </div>

                                <div className="comment-thread">
                                    <h4>Comments</h4>

                                    {review.comments?.map((comment) => (
                                        <div className="comment" key={comment._id}>
                                            <strong>{comment.username || "Reviewer Name"}</strong>
                                            <p>{comment.comment}</p>
                                        </div>
                                    ))}

                                    <form onSubmit={(e) => submitComment(e, review._id)}>
                                        <input
                                            value={commentText[review._id] || ""}
                                            onChange={(e) =>
                                                setCommentText((prev) => ({
                                                    ...prev,
                                                    [review._id]: e.target.value,
                                                }))
                                            }
                                            placeholder="Write a comment..."
                                        />

                                        <button type="submit">💬 Comment</button>
                                    </form>
                                </div>
                            </article>
                        );
                    })
                )}
            </div>
        </section>
    );
}