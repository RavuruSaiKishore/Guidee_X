import Booking from "../models/Bookings.js";
import Mentor from "../models/Mentor.js";
import Review from "../models/Reviews.js";

/* ===========================================
   GET REVIEW DETAILS
=========================================== */

export const getReviewDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("mentor");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      mentor: booking.mentor,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ===========================================
   SUBMIT REVIEW
=========================================== */

export const submitReview = async (req, res) => {
  try {
    const { bookingId, rating, review } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.reviewSubmitted) {
      return res.status(400).json({
        success: false,
        message: "Review already submitted.",
      });
    }

    const newReview = await Review.create({
      mentorId: booking.mentor,
      studentId: booking.student,
      bookingId,
      rating,
      review,
    });

    booking.reviewSubmitted = true;

    await booking.save();

    const mentor = await Mentor.findById(booking.mentor);

    mentor.reviews.push(newReview._id);

    mentor.totalReviews += 1;

    const reviews = await Review.find({
      mentorId: mentor._id,
    });

    const total = reviews.reduce((sum, item) => sum + item.rating, 0);

    mentor.averageRating = total / reviews.length;

    await mentor.save();

    res.json({
      success: true,
      message: "Review submitted successfully.",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
