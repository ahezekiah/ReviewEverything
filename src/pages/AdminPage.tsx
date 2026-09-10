import { useEffect, useState } from "react";
import "./style/adminpage.css";
import { API_BASE } from "../config/api";

type Review = {
    _id?: string;
    title?: string;
    username?: string;
    content?: string;
    rating?: number;
};

export default function AdminPage() {
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchReviews() {
            try {
                const response = await fetch(
                    `${API_BASE}/reviews`
                );

                if (!response.ok) {
                    throw new Error(
                        "Unable to load reviews."
                    );
                }

                const data = await response.json();

                setReviews(
                    Array.isArray(data.reviews)
                        ? data.reviews
                        : []
                );
            } catch (requestError) {
                setError(
                    requestError instanceof Error
                        ? requestError.message
                        : "Unable to load reviews."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchReviews();
    }, []);

    if (loading) {
        return (
            <main>
                <p>Loading...</p>
            </main>
        );
    }

    return (
        <main>
            <h1>Admin Dashboard</h1>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

            {!error && (
                <>
                    <p>
                        Total reviews: {reviews.length}
                    </p>

                    {reviews.length === 0 ? (
                        <p>No reviews found.</p>
                    ) : (
                        <section>
                            {reviews.map((review, index) => (
                                <article
                                    key={review._id || index}
                                >
                                    <h2>
                                        {review.title ||
                                            "Untitled Review"}
                                    </h2>

                                    <p>
                                        Reviewer:{" "}
                                        {review.username ||
                                            "Anonymous"}
                                    </p>

                                    <p>
                                        Rating:{" "}
                                        {review.rating ?? "N/A"}
                                    </p>

                                    <p>{review.content}</p>
                                </article>
                            ))}
                        </section>
                    )}
                </>
            )}
        </main>
    );
}