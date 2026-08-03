import Mentor from "../models/Mentor.js";
import Review from "../models/Reviews.js";

export const updateMentorRating = async (mentorId) => {
  const reviews = await Review.find({
    mentorId,
    isVisible: true,
  });

  const mentor = await Mentor.findById(mentorId);

  if (!mentor) return;

  if (reviews.length === 0) {
    mentor.averageRating = 0;
    mentor.totalReviews = 0;
    mentor.reviews = [];

    await mentor.save();

    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

  mentor.averageRating = Number((totalRating / reviews.length).toFixed(1));

  mentor.totalReviews = reviews.length;

  mentor.reviews = reviews.map((review) => review._id);

  await mentor.save();
};
