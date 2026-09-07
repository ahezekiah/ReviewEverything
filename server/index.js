import {
    addReviewForUser, updateReviewForUser, deleteReview, getAllReviewsByMovie, getAllReviewsByUser, getAllMovieReviewsByRating,
    getAllUserReviewsByRating, rateReview, getAllReviews, toggleLikeReview, addCommentToReview
} from './data/review-DAL.js';
import express from 'express';
import cors from 'cors';
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Review Everything API is running."
    });
});

app.get("/api", (req, res) => {
    res.json({
        isServingJSON: true
    });
});

app.get('/api/reviews', async (req, res) => {
    const result = await getAllReviews();
    res.json({ reviews: result });
});

app.get('/api/user/reviews', async (req, res) => {
    const userID = await req.query.userID
    const result = await getAllReviewsByUser(userID)
    res.json({ 'reviews': result })
})

app.get('/api/movies/reviews', async (req, res) => {
    const movieID = await req.query.movieID
    console.log('review: ', movieID)
    const result = await getAllReviewsByMovie(movieID)
    res.json({ 'reviews': result })
})

app.get('/api/movies/reviews/:rating', async (req, res) => {
    const movieID = await req.query.movieID;
    const rating = await req.params.rating;
    const result = await getAllMovieReviewsByRating(movieID, rating)
    res.json({ 'reviews': result })
})

app.get('/api/user/reviews/:rating', async (req, res) => {
    const userID = await req.query.userID;
    const rating = await req.params.rating;
    const result = await getAllUserReviewsByRating(userID, rating)
    res.json({ 'reviews': result })
})

app.post("/api/user/reviews", async (req, res) => {
    try {
        const result = await addReviewForUser(req.body);
        res.json({ givenID: result });
    } catch (error) {
        console.error("POST /api/user/reviews failed:", error);
        res.status(500).json({ message: "Failed to save review." });
    }
});


// app.post('/api/user/reviews', async (req, res) => {
//     const allData = await req.body;
//     const result = await addReviewForUser(allData)
//     res.json({ 'givenID': result })
// })

app.patch('/api/user/reviews', async (req, res) => {
    const allData = await req.body;
    const result = await updateReviewForUser(allData)
    res.json({ 'posted': result })
})

app.patch('/api/user/rate/:rate', async (req, res) => {
    const reviewID = req.body.reviewID;
    const isPositive = await req.params.rate === 'true';
    const result = await rateReview(reviewID, isPositive);
    res.json({ 'wasRated': result })
})

app.delete('/api/user/reviews', async (req, res) => {
    const reviewID = await req.body.reviewID;
    const result = await deleteReview(reviewID)
    res.json({ 'posted': result })
})

// New endpoints for toggling like and adding comments
app.patch("/api/reviews/:reviewID/like", async (req, res) => {
    try {
        const review = await toggleLikeReview(req.params.reviewID, req.body.userID);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.json({ review });
    } catch (error) {
        console.error("Toggle like failed:", error);
        res.status(500).json({ message: "Failed to update like." });
    }
});

app.post("/api/reviews/:reviewID/comments", async (req, res) => {
    try {
        const review = await addCommentToReview(req.params.reviewID, req.body);

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.json({ review });
    } catch (error) {
        console.error("Add comment failed:", error);
        res.status(500).json({ message: "Failed to add comment." });
    }
});


// Only start server if this file is run directly (not imported for tests)
const PORT = process.env.PORT || 3100;

if (import.meta.url === `file://${process.argv[1]}`) {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(
            `Review Everything API listening on port ${PORT}`
        );
    });
}

export default app;