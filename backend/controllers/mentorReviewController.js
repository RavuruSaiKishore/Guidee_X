import Review from "../models/Reviews.js";
import Mentor from "../models/Mentor.js";


export const getMyReviews = async (req, res) => {
  try {
    // =====================================================
    // 1. GET LOGGED-IN USER ID
    // =====================================================

    const userId = req.user?._id || req.user?.id;


    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // =====================================================
    // 2. FIND MENTOR PROFILE
    // =====================================================

    const mentor = await Mentor.findOne({
      $or: [{ user: userId }, { student: userId }],
    }).select("_id user student");


    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor profile not found.",
        userId,
      });
    }

    const mentorId = mentor._id;



    
    // =====================================================
    // 3. QUERY PARAMETERS
    // =====================================================

    const pageNumber = Math.max(parseInt(req.query.page) || 1, 1);

    const limitNumber = Math.min(
      Math.max(parseInt(req.query.limit) || 10, 1),
      50
    );

    const { rating, search } = req.query;

    // =====================================================
    // 4. BUILD QUERY
    // =====================================================

    const query = {
      mentorId: mentorId,
      isVisible: true,
    };

    // Rating filter
    if (
      rating &&
      rating !== "all" &&
      Number(rating) >= 1 &&
      Number(rating) <= 5
    ) {
      query.rating = Number(rating);
    }


    
    // =====================================================
    // 5. SEARCH
    // =====================================================

    // If searching by student name or review text,
    // we fetch matching reviews first.
    let reviewDocuments = await Review.find(query)
      .populate({
        path: "studentId",
        select: "firstName lastName email profileImage",
      })
      .populate({
        path: "bookingId",
        select: "sessionDate startTime endTime duration sessionType",
      })
      .sort({
        createdAt: -1,
      });
      
    // =====================================================
    // SEARCH FILTER
    // =====================================================

    if (search && search.trim()) {
      const searchTerm = search.trim().toLowerCase();

      reviewDocuments = reviewDocuments.filter((item) => {
        const studentName = `
          ${item.studentId?.firstName || ""}
          ${item.studentId?.lastName || ""}
        `.toLowerCase();

        const reviewText = (item.review || "").toLowerCase();

        const studentEmail = (item.studentId?.email || "").toLowerCase();

        return (
          studentName.includes(searchTerm) ||
          reviewText.includes(searchTerm) ||
          studentEmail.includes(searchTerm)
        );
      });
    }

    // =====================================================
    // 6. TOTAL REVIEWS AFTER FILTERS
    // =====================================================

    const totalReviews = reviewDocuments.length;

    // =====================================================
    // 7. PAGINATION
    // =====================================================

    const startIndex = (pageNumber - 1) * limitNumber;

    const endIndex = startIndex + limitNumber;

    const reviews = reviewDocuments.slice(startIndex, endIndex);


    // =====================================================
    // 8. RATING DISTRIBUTION
    //
    // This is calculated for ALL visible reviews
    // =====================================================

    const ratingDistributionResult = await Review.aggregate([
      {
        $match: {
          mentorId: mentorId,
          isVisible: true,
        },
      },
      {
        $group: {
          _id: "$rating",
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    const ratingDistribution = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    ratingDistributionResult.forEach((item) => {
      if (item._id >= 1 && item._id <= 5) {
        ratingDistribution[item._id] = item.count;
      }
    });

    // =====================================================
    // 9. AVERAGE RATING
    // =====================================================

    const ratingStats = await Review.aggregate([
      {
        $match: {
          mentorId: mentorId,
          isVisible: true,
        },
      },
      {
        $group: {
          _id: null,
          averageRating: {
            $avg: "$rating",
          },
          totalReviews: {
            $sum: 1,
          },
        },
      },
    ]);

    const averageRating =
      ratingStats.length > 0
        ? Number(ratingStats[0].averageRating.toFixed(1))
        : 0;

    const allReviewsCount =
      ratingStats.length > 0 ? ratingStats[0].totalReviews : 0;

    // =====================================================
    // 10. RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,

      data: {
        reviews,

        statistics: {
          averageRating,
          totalReviews: allReviewsCount,
          ratingDistribution,
        },

        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(totalReviews / limitNumber),
          totalReviews,
          limit: limitNumber,
        },
      },
    });
  } catch (error) {
    console.error("Get mentor reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch mentor reviews.",
      error: error.message,
    });
  }
};