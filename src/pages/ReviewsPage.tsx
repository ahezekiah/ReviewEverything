import { useEffect, useState } from "react";
import "./style/reviews.css";
import { API_BASE } from "../config/api";

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
  movieName?: string;
  username?: string;
  title?: string;
  content?: string;
  rating?: number;
  likedBy?: string[];
  dislikedBy?: string[];
  comments?: Comment[];
};

const CURRENT_USER_ID = "1";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  async function toggleLike(reviewID: string) {
    await fetch(`${API_BASE}/reviews/${reviewID}/like`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: CURRENT_USER_ID }),
    });

    await loadReviews();
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

    await loadReviews();
  }

  const loadReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/reviews`);
      const data = await res.json();

      const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

      const reviewsWithMovieNames = await Promise.all(
        (data.reviews || []).map(async (review: Review) => {
          try {
            const movieRes = await fetch(
              `https://api.themoviedb.org/3/movie/${review.movieID}?api_key=${API_KEY}`
            );

            const movieData = await movieRes.json();

            return {
              ...review,
              movieName: movieData.title || "Unknown Movie",
            };
          } catch {
            return {
              ...review,
              movieName: "Unknown Movie",
            };
          }
        })
      );

      setReviews(reviewsWithMovieNames);
    } catch (error) {
      console.error("Failed to load reviews:", error);
    }
  };

  useEffect(() => {
    let ignore = false;

    async function fetchInitialReviews() {
      try {
        const res = await fetch(`${API_BASE}/reviews`);
        const data = await res.json();

        const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

        const reviewsWithMovieNames = await Promise.all(
          (data.reviews || []).map(async (review: Review) => {
            try {
              const movieRes = await fetch(
                `https://api.themoviedb.org/3/movie/${review.movieID}?api_key=${API_KEY}`
              );

              const movieData = await movieRes.json();

              return {
                ...review,
                movieName: movieData.title || "Unknown Movie",
              };
            } catch {
              return {
                ...review,
                movieName: "Unknown Movie",
              };
            }
          })
        );

        if (!ignore) {
          setReviews(reviewsWithMovieNames);
        }
      } catch (error) {
        console.error("Failed to load reviews:", error);
      }
    }

    fetchInitialReviews();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="reviews-page">
      <h1>All Reviews</h1>

      <div className="reviews-page-grid">
        {reviews.map((review) => {
          const rating = Math.min(5, Math.max(0, Math.round(Number(review.rating) || 0)));
          const liked = review.likedBy?.includes(CURRENT_USER_ID);

          return (
            <article className="reviews-page-card" key={review._id}>
              <div className="reviews-page-stars">
                {"★".repeat(rating)}
                {"☆".repeat(5 - rating)}
              </div>

              <h2>{review.title || "Untitled Review"}</h2>
              <p>{review.content || "No review text."}</p>

              <footer>
                <span>By: {review.username || "Reviewer Name"}</span>
                <span>Movie: {review.movieName}</span>
              </footer>

              <button
                type="button"
                className={liked ? "like-button liked" : "like-button"}
                onClick={() => toggleLike(review._id)}
              >
                👍 {review.likedBy?.length || 0}
              </button>

              <div className="comment-thread">
                <h3>Comments</h3>

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
        })}
      </div>
      <footer className="landing-footer">
        <p>Review Everything</p>
        <p>Group Name © 2026</p>
        <p>Links</p>
      </footer>
    </main>
  );
}
