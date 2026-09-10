import mongoose from 'mongoose';
import userReviewSchema from '../../models/UserReview.js';

// Use mongodb service name in Docker, localhost for tests
const uri = process.env.MONGO_URI || 'mongodb://admin:admin@localhost:27017/reviewdb?authSource=admin';

const UserReview = mongoose.model('UserReview', userReviewSchema, 'reviews');

async function addReview(review) {
    await mongoose.connect(uri);
    const addedItem = new UserReview(review);
    const result = await addedItem.save();
    await mongoose.disconnect();
    return result;
}

async function removeReview(id) {
    await mongoose.connect(uri);
    const removedItem = await UserReview.findByIdAndDelete(id).exec();
    await mongoose.disconnect();
    return removedItem;
}

async function updateReview(id, updatedReview) {
    await mongoose.connect(uri);
    const result = await UserReview.findByIdAndUpdate(id, updatedReview, { new: true });
    await mongoose.disconnect();
    return result;
}


async function getTopFiftyReviews() {
    await mongoose.connect(uri);
    const listOfReviews = await UserReview.find().exec();
    await mongoose.disconnect();
    return listOfReviews.slice(0, 50);
}

async function getAllReviewsByUser(userID) {
    await mongoose.connect(uri);
    const listOfReviews = await UserReview.find({ 'userID': userID }).exec();
    await mongoose.disconnect();
    return listOfReviews;
}

async function getAllReviewsByMovie(movieID) {
    await mongoose.connect(uri);
    const listOfReviews = await UserReview.find({ 'movieID': movieID }).exec();
    console.log(listOfReviews)
    await mongoose.disconnect();
    return listOfReviews;
}

async function getAllMovieReviewsByRating(movieID, rating) {
    await mongoose.connect(uri);
    var listOfReviews;
    if (isInt(rating)) {
        listOfReviews = await UserReview.find({ 'rating': { $gte: rating, $lte: rating + 1 }, 'movieID': movieID }).exec();
    } else {
        listOfReviews = await UserReview.find({ 'rating': rating, 'movieID': movieID }).exec();
    }
    await mongoose.disconnect();
    return listOfReviews;
}

async function getAllUserReviewsByRating(userID, rating) {
    await mongoose.connect(uri);
    var listOfReviews;
    if (isInt(rating)) {
        listOfReviews = await UserReview.find({ 'rating': { $gte: rating, $lte: rating + 1 }, 'userID': userID }).exec();
    } else {
        listOfReviews = await UserReview.find({ 'rating': rating, 'userID': userID }).exec();
    }
    await mongoose.disconnect();
    return listOfReviews;
}


async function addReviewForUser(allData) {
    await mongoose.connect(uri);

    // const newReview = new UserReview({
    //     userID: allData.userID,
    //     username: allData.username || "Reviewer Name",
    //     title: allData.title,
    //     content: allData.reviewText,
    //     movieID: allData.movieID,
    //     rating: allData.rating,
    //     thumbsDown: 0,
    //     thumbsUp: 0,
    // });

    const newReview = new UserReview({
        userID: String(allData.userID),
        username: allData.username || "Reviewer Name",
        title: allData.title,
        content: allData.reviewText,
        movieID: String(allData.movieID),
        rating: allData.rating,

        likedBy: [],
        dislikedBy: [],
        comments: [],
    });

    const result = await newReview.save();
    await mongoose.disconnect();

    return result._id;
}




async function updateReviewForUser(allData) {
    await mongoose.connect(uri);
    const result = await UserReview.updateOne({ 'userID': allData.userID }, {
        'content': allData.content,
        'rating': allData.rating,
        'username': allData.username,
        'title': allData.title,
    }).exec();
    await mongoose.disconnect();
    return result.acknowledged;
}

async function rateReview(reviewID, isPositive) {
    await mongoose.connect(uri);
    var result;
    if (isPositive) {
        result = await UserReview.updateOne({ '_id': reviewID }, { $inc: { thumbsUp: 1 } }).exec();
    } else {
        result = await UserReview.updateOne({ '_id': reviewID }, { $inc: { thumbsDown: 1 } }).exec();
    }
    await mongoose.disconnect();
    return result.acknowledged;
}

async function deleteReview(reviewID) {
    await mongoose.connect(uri);
    const result = await UserReview.findByIdAndDelete(reviewID).exec();
    await mongoose.disconnect();
    return result !== null;
}

async function getAllReviews() {
    await mongoose.connect(uri);
    const reviews = await UserReview.find({}).sort({ _id: -1 }).exec();
    await mongoose.disconnect();
    return reviews;
}

// New functions for toggling likes and adding comments
async function toggleLikeReview(reviewID, userID) {
    await mongoose.connect(uri);

    const review = await UserReview.findById(reviewID);

    if (!review) {
        await mongoose.disconnect();
        return null;
    }

    review.likedBy = review.likedBy || [];
    review.dislikedBy = review.dislikedBy || [];

    const user = String(userID);
    const hasLiked = review.likedBy.includes(user);

    if (hasLiked) {
        review.likedBy = review.likedBy.filter((id) => id !== user);
    } else {
        review.likedBy.push(user);
        review.dislikedBy = review.dislikedBy.filter((id) => id !== user);
    }

    await review.save();
    await mongoose.disconnect();

    return review;
}

async function addCommentToReview(reviewID, commentData) {
    await mongoose.connect(uri);

    const review = await UserReview.findById(reviewID);

    if (!review) {
        await mongoose.disconnect();
        return null;
    }

    review.comments = review.comments || [];

    review.comments.push({
        userID: String(commentData.userID),
        username: commentData.username || "Reviewer Name",
        comment: commentData.comment,
    });
    await review.save();
    await mongoose.disconnect();

    return review;
}



function isInt(n) {
    return n % 1 === 0;
}

export {
    addReview,
    removeReview,
    updateReview,
    getAllReviewsByUser,
    getAllReviewsByMovie,
    getAllMovieReviewsByRating,
    getAllUserReviewsByRating,
    addReviewForUser,
    updateReviewForUser,
    rateReview,
    deleteReview,
    getAllReviews,
    toggleLikeReview,
    addCommentToReview
};