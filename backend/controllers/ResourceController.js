import Resource from "../models/Resource.js";

export const createResource = async (req, res) => {
  try {
    // =====================================================
    // BASIC INFORMATION
    // =====================================================

    const {
      title,
      subtitle,
      description,

      // =====================================================
      // CLASSIFICATION
      // =====================================================

      category,
      resourceType,
      difficulty,
      estimatedDuration,

      // =====================================================
      // AUTHOR
      // =====================================================

      authorName,
      authorRole,

      // =====================================================
      // LINKS
      // =====================================================

      externalUrl,
      videoUrl,

      // =====================================================
      // STATUS
      // =====================================================

      status,
      isFeatured,

      // =====================================================
      // SEO
      // =====================================================

      seoTitle,
      seoDescription,

      // =====================================================
      // ARRAY FIELDS
      // =====================================================

      targetAudience,
      whatYouWillLearn,
      prerequisites,
      keyTakeaways,
      skills,
      tags,
    } = req.body;

    // =====================================================
    // GET UPLOADED FILES
    // =====================================================

    const resourceFile = req.files?.file?.[0] || null;

    const thumbnailFile = req.files?.thumbnail?.[0] || null;

    // =====================================================
    // BASIC VALIDATION
    // =====================================================

    if (
      !title?.trim() ||
      !subtitle?.trim() ||
      !description?.trim() ||
      !category ||
      !resourceType
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, subtitle, description, category and resource type are required",
      });
    }

    // =====================================================
    // VALIDATE RESOURCE TYPE
    // =====================================================

    const allowedResourceTypes = ["PDF", "File", "External Link"];

    if (!allowedResourceTypes.includes(resourceType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource type",
      });
    }

    // =====================================================
    // VALIDATE CATEGORY
    // =====================================================

    const allowedCategories = [
      "Interview Preparation",
      "Coding Roadmaps",
      "Resume Templates",
      "Career Guidance",
      "Skill Development",
    ];

    if (!allowedCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource category",
      });
    }

    // =====================================================
    // VALIDATE DIFFICULTY
    // =====================================================

    const allowedDifficulties = ["Beginner", "Intermediate", "Advanced"];

    const finalDifficulty = allowedDifficulties.includes(difficulty)
      ? difficulty
      : "Beginner";

    // =====================================================
    // EXTERNAL LINK VALIDATION
    // =====================================================

    if (resourceType === "External Link") {
      if (!externalUrl?.trim()) {
        return res.status(400).json({
          success: false,
          message: "External URL is required for external link resources",
        });
      }
    }

    // =====================================================
    // FILE VALIDATION
    // =====================================================

    if (resourceType === "PDF" || resourceType === "File") {
      if (!resourceFile) {
        return res.status(400).json({
          success: false,
          message: "Please upload a resource file",
        });
      }
    }

    // =====================================================
    // HELPER
    // PARSE FORM DATA ARRAYS
    // =====================================================

    const parseArray = (value) => {
      if (!value) {
        return [];
      }

      // Already an array
      if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
      }

      // JSON string
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);

          if (Array.isArray(parsed)) {
            return parsed.map((item) => String(item).trim()).filter(Boolean);
          }
        } catch (error) {
          // Handle comma-separated values
          return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }

      return [];
    };

    // =====================================================
    // PARSE ARRAYS
    // =====================================================

    const parsedTargetAudience = parseArray(targetAudience);

    const parsedWhatYouWillLearn = parseArray(whatYouWillLearn);

    const parsedPrerequisites = parseArray(prerequisites);

    const parsedKeyTakeaways = parseArray(keyTakeaways);

    const parsedSkills = parseArray(skills);

    const parsedTags = parseArray(tags).map((tag) => tag.toLowerCase());

    // =====================================================
    // CREATE RESOURCE
    // =====================================================

    const resource = await Resource.create({
      // ===================================================
      // BASIC INFORMATION
      // ===================================================

      title: title.trim(),

      subtitle: subtitle?.trim() || "",

      description: description.trim(),

      // ===================================================
      // CLASSIFICATION
      // ===================================================

      category,

      resourceType,

      difficulty: finalDifficulty,

      estimatedDuration: estimatedDuration?.trim() || "",

      // ===================================================
      // TARGET AUDIENCE
      // ===================================================

      targetAudience: parsedTargetAudience,

      // ===================================================
      // AUTHOR
      // ===================================================

      authorName: authorName?.trim() || "GuideX Career Team",

      authorRole: authorRole?.trim() || "Career & Learning Team",

      // ===================================================
      // EXTERNAL URL
      // ===================================================

      externalUrl: resourceType === "External Link" ? externalUrl.trim() : "",

      // ===================================================
      // VIDEO URL
      // ===================================================

      videoUrl: videoUrl?.trim() || "",

      // ===================================================
      // RESOURCE FILE
      // ===================================================

      fileUrl: resourceFile ? resourceFile.path : "",

      fileName: resourceFile ? resourceFile.originalname : "",

      fileSize: resourceFile ? resourceFile.size : 0,

      // ===================================================
      // THUMBNAIL
      // ===================================================

      thumbnail: thumbnailFile ? thumbnailFile.path : "",

      // ===================================================
      // LEARNING OUTCOMES
      // ===================================================

      whatYouWillLearn: parsedWhatYouWillLearn,

      prerequisites: parsedPrerequisites,

      keyTakeaways: parsedKeyTakeaways,

      // ===================================================
      // SKILLS
      // ===================================================

      skills: parsedSkills,

      // ===================================================
      // TAGS
      // ===================================================

      tags: parsedTags,

      // ===================================================
      // STATUS
      // ===================================================

      status: status === "Published" ? "Published" : "Draft",

      // ===================================================
      // FEATURED
      // ===================================================

      isFeatured: isFeatured === true || isFeatured === "true",

      // ===================================================
      // SEO
      // ===================================================

      seoTitle: seoTitle?.trim() || "",

      seoDescription: seoDescription?.trim() || "",

      // ===================================================
      // ADMIN
      // ===================================================

      createdBy: req.user?._id || req.user?.id || "Admin",

      // ===================================================
      // ANALYTICS DEFAULTS
      // ===================================================

      views: 0,

      likes: 0,

      likedBy: [],

      downloads: 0,

      downloadedBy: [],
    });

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(201).json({
      success: true,

      message: "Resource created successfully",

      resource,
    });
  } catch (error) {
    console.error("Create Resource Error:", error);

    return res.status(500).json({
      success: false,

      message: "Failed to create resource",

      error: error.message,
    });
  }
};



export const getAllResourcesAdmin = async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      resources,
    });
  } catch (error) {
    console.error("Get Resources Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resources",
    });
  }
};

export const toggleResourceStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    resource.status = resource.status === "Published" ? "Draft" : "Published";

    await resource.save();

    res.status(200).json({
      success: true,
      message: `Resource ${
        resource.status === "Published" ? "published" : "moved to draft"
      }`,
      resource,
    });
  } catch (error) {
    console.error("Toggle Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update resource status",
    });
  }
};

export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      category,
      resourceType,
      externalUrl,
      status,
      removeExistingFile,
    } = req.body;

    // ==========================================
    // FIND RESOURCE
    // ==========================================

    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    // ==========================================
    // UPDATE BASIC INFORMATION
    // ==========================================

    if (title !== undefined) {
      resource.title = title.trim();
    }

    if (description !== undefined) {
      resource.description = description.trim();
    }

    if (category !== undefined) {
      resource.category = category;
    }

    if (resourceType !== undefined) {
      resource.resourceType = resourceType;
    }

    if (status !== undefined) {
      resource.status = status;
    }

    // ==========================================
    // EXTERNAL LINK RESOURCE
    // ==========================================

    if (resourceType === "External Link") {
      if (!externalUrl || !externalUrl.trim()) {
        return res.status(400).json({
          success: false,
          message: "External URL is required",
        });
      }

      resource.externalUrl = externalUrl.trim();

      // Remove old uploaded file information
      resource.fileUrl = "";
      resource.fileName = "";
      resource.fileSize = 0;
    }

    // ==========================================
    // REMOVE EXISTING FILE
    // ==========================================

    if (removeExistingFile === "true" && resourceType !== "External Link") {
      resource.fileUrl = "";
      resource.fileName = "";
      resource.fileSize = 0;
    }

    // ==========================================
    // NEW FILE UPLOAD
    // ==========================================

    if (req.file) {
      resource.fileUrl = req.file.path;

      resource.fileName = req.file.originalname;

      resource.fileSize = req.file.size;

      // Clear external link
      resource.externalUrl = "";
    }

    // ==========================================
    // VALIDATE FILE RESOURCE
    // ==========================================

    if (resourceType !== "External Link" && !resource.fileUrl) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resource file",
      });
    }

    // ==========================================
    // SAVE RESOURCE
    // ==========================================

    await resource.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      message: "Resource updated successfully",
      resource,
    });
  } catch (error) {
    console.error("Update Resource Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update resource",
      error: error.message,
    });
  }
};


export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    await Resource.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Resource deleted successfully",
    });
  } catch (error) {
    console.error("Delete Resource Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete resource",
    });
  }
};



export const downloadResource = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const studentId = req.user.id;

    const resource =
      await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message:
          "Resource not found",
      });
    }

    // ================================================
    // CHECK RESOURCE STATUS
    // ================================================

    if (
      resource.status !==
      "Published"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "This resource is not available",
      });
    }

    // ================================================
    // CHECK IF STUDENT ALREADY DOWNLOADED
    // ================================================

    const alreadyDownloaded =
      resource.downloadedBy.some(
        (userId) =>
          userId.toString() ===
          studentId.toString()
      );

    // ================================================
    // TRACK UNIQUE STUDENT DOWNLOAD
    // ================================================

    if (!alreadyDownloaded) {
      resource.downloadedBy.push(
        studentId
      );
    }

    // ================================================
    // INCREMENT TOTAL DOWNLOADS
    // ================================================

    resource.downloads += 1;

    await resource.save();

    // ================================================
    // RETURN FILE URL
    // ================================================

    const downloadUrl =
      resource.resourceType ===
      "External Link"
        ? resource.externalUrl
        : resource.fileUrl;

    return res.status(200).json({
      success: true,

      message:
        "Download tracked successfully",

      downloadUrl,

      downloads:
        resource.downloads,

      uniqueDownloads:
        resource.downloadedBy.length,
    });
  } catch (error) {
    console.error(
      "Download resource error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to download resource",
      error: error.message,
    });
  }
};


export const getPublishedResources = async (req, res) => {
  try {
    const studentId = req.user?.id || req.user?._id;

    const resources = await Resource.find({
      status: "Published",
    })
      .populate({
        path: "createdBy",
        select: "firstName lastName email profileImage",
      })
      .populate({
        path: "likedBy",
        select: "firstName lastName email profileImage",
      })
      .populate({
        path: "downloadedBy",
        select: "firstName lastName email profileImage",
      })
      .sort({ createdAt: -1 })
      .lean();

    const formattedResources = resources.map((resource) => {
      const isLiked = studentId
        ? resource.likedBy?.some(
            (student) => student._id?.toString() === studentId.toString()
          )
        : false;

      return {
        ...resource,
        isLiked,
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedResources.length,
      resources: formattedResources,
    });
  } catch (error) {
    console.error("Get Published Resources Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch published resources",
      error: error.message,
    });
  }
};


export const getAdminResourceDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // ==========================================
    // FIND RESOURCE
    // ==========================================

    const resource = await Resource.findById(id)
      .populate({
        path: "likedBy",
        select: "firstName lastName email profileImage role isActive isBlocked",
      })
      .populate({
        path: "downloadedBy",
        select: "firstName lastName email profileImage role isActive isBlocked",
      })
      .lean();

    // ==========================================
    // RESOURCE NOT FOUND
    // ==========================================

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,
      resource,
    });
  } catch (error) {
    console.error("Get admin resource details error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resource details",
      error: error.message,
    });
  }
};



export const AdmingetResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    // Student ID from protect middleware
    const studentId = req.user?._id || req.user?.id;

    // =================================================
    // FIND RESOURCE BY ID
    // =================================================

    const resource = await Resource.findOne({
      _id: id,
      status: "Published",
    }).lean();

    // =================================================
    // RESOURCE NOT FOUND
    // =================================================

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    // =================================================
    // CHECK LIKE STATUS
    // =================================================

    const isLiked = studentId
      ? resource.likedBy?.some(
          (likedStudentId) => likedStudentId.toString() === studentId.toString()
        )
      : false;

    // =================================================
    // REMOVE PRIVATE STUDENT DATA
    // =================================================

    delete resource.likedBy;
    delete resource.downloadedBy;

    // =================================================
    // RESPONSE
    // =================================================

    return res.status(200).json({
      success: true,
      message: "Resource fetched successfully",
      resource: {
        ...resource,
        isLiked,
      },
    });
  } catch (error) {
    console.error("Get Resource By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resource",
      error: error.message,
    });
  }
};

export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    // =====================================================
    // CURRENT STUDENT ID
    // =====================================================

    const studentId = req.user?._id || req.user?.id;

    // =====================================================
    // FIND PUBLISHED RESOURCE
    // =====================================================

    const resource = await Resource.findOne({
      _id: id,
      status: "Published",
    }).lean();

    // =====================================================
    // RESOURCE NOT FOUND
    // =====================================================

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    // =====================================================
    // CHECK IF CURRENT STUDENT LIKED RESOURCE
    // =====================================================

    const isLiked = studentId
      ? (resource.likedBy || []).some(
          (likedStudentId) => likedStudentId.toString() === studentId.toString()
        )
      : false;

    // =====================================================
    // CHECK IF CURRENT STUDENT DOWNLOADED RESOURCE
    // =====================================================

    const isDownloaded = studentId
      ? (resource.downloadedBy || []).some(
          (downloadedStudentId) =>
            downloadedStudentId.toString() === studentId.toString()
        )
      : false;

    // =====================================================
    // BUILD COMPLETE RESOURCE RESPONSE
    // =====================================================

    const formattedResource = {
      ...resource,

      // Current student's interaction
      isLiked,
      isDownloaded,

      // Make sure counters are always available
      views: resource.views || 0,
      likes: resource.likes || 0,
      downloads: resource.downloads || 0,

      // Ensure arrays are always available
      likedBy: resource.likedBy || [],
      downloadedBy: resource.downloadedBy || [],

      // File information
      fileName: resource.fileName || null,
      fileSize: resource.fileSize || 0,
      fileUrl: resource.fileUrl || null,

      // External resource
      externalUrl: resource.externalUrl || null,

      // General information
      title: resource.title || "",
      description: resource.description || "",
      category: resource.category || "",
      resourceType: resource.resourceType || "",
      status: resource.status || "",
      createdAt: resource.createdAt || null,
      updatedAt: resource.updatedAt || null,
      createdBy: resource.createdBy || null,
    };

    // =====================================================
    // RESPONSE
    // =====================================================

    return res.status(200).json({
      success: true,
      message: "Resource fetched successfully",
      resource: formattedResource,
    });
  } catch (error) {
    console.error("Get Resource Error:", error);

    // =====================================================
    // INVALID MONGODB ID
    // =====================================================

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID",
      });
    }

    // =====================================================
    // SERVER ERROR
    // =====================================================

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resource",
      error: error.message,
    });
  }
};


export const trackResourceView = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findOneAndUpdate(
      {
        _id: id,
        status: "Published",
      },
      {
        $inc: {
          views: 1,
        },
      },
      {
        new: true,
      }
    );

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    return res.status(200).json({
      success: true,
      views: resource.views,
    });
  } catch (error) {
    console.error("Track Resource View Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to track resource view",
      error: error.message,
    });
  }
};


export const toggleResourceLike = async (req, res) => {
  try {
    const { id } = req.params;

    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Student authentication required",
      });
    }

    const resource = await Resource.findOne({
      _id: id,
      status: "Published",
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    // =================================================
    // CHECK IF STUDENT ALREADY LIKED
    // =================================================

    const alreadyLiked = resource.likedBy.some(
      (student) => student.toString() === studentId.toString()
    );

    // =================================================
    // UNLIKE
    // =================================================

    if (alreadyLiked) {
      resource.likedBy.pull(studentId);

      resource.likes = Math.max(0, resource.likes - 1);

      await resource.save();

      return res.status(200).json({
        success: true,
        message: "Resource unliked successfully",

        isLiked: false,

        likes: resource.likes,
      });
    }

    // =================================================
    // LIKE
    // =================================================

    resource.likedBy.push(studentId);

    resource.likes += 1;

    await resource.save();

    return res.status(200).json({
      success: true,
      message: "Resource liked successfully",

      isLiked: true,

      likes: resource.likes,
    });
  } catch (error) {
    console.error("Toggle Resource Like Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update resource like",
      error: error.message,
    });
  }
};


export const trackResourceDownload = async (req, res) => {
  try {
    const { id } = req.params;

    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Student authentication required",
      });
    }

    const resource = await Resource.findOne({
      _id: id,
      status: "Published",
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    // ==========================================
    // CHECK EXISTING DOWNLOAD
    // ==========================================

    const alreadyDownloaded = resource.downloadedBy.some(
      (student) => student.toString() === studentId.toString()
    );

    // ==========================================
    // FIRST DOWNLOAD
    // ==========================================

    if (!alreadyDownloaded) {
      resource.downloadedBy.push(studentId);

      resource.downloads += 1;

      await resource.save();
    }

    // ==========================================
    // EXTERNAL LINK
    // ==========================================

    if (resource.resourceType === "External Link") {
      return res.status(200).json({
        success: true,

        resourceType: "External Link",

        externalUrl: resource.externalUrl,

        downloads: resource.downloads,

        isFirstDownload: !alreadyDownloaded,
      });
    }

    // ==========================================
    // FILE RESOURCE
    // ==========================================

    if (!resource.fileUrl) {
      return res.status(404).json({
        success: false,
        message: "Resource file not found",
      });
    }

    return res.status(200).json({
      success: true,

      resourceType: resource.resourceType,

      fileUrl: resource.fileUrl,

      fileName: resource.fileName,

      fileSize: resource.fileSize,

      downloads: resource.downloads,

      isFirstDownload: !alreadyDownloaded,
    });
  } catch (error) {
    console.error("Track Resource Download Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to track resource download",
      error: error.message,
    });
  }
};


export const downloadResourceFile = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findOne({
      _id: id,
      status: "Published",
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    // ==========================================
    // EXTERNAL LINK
    // ==========================================

    if (resource.resourceType === "External Link") {
      return res.status(400).json({
        success: false,
        message: "This resource is an external link",

        externalUrl: resource.externalUrl,
      });
    }

    // ==========================================
    // FILE CHECK
    // ==========================================

    if (!resource.fileUrl) {
      return res.status(404).json({
        success: false,
        message: "Resource file not found",
      });
    }

    // ==========================================
    // REDIRECT TO FILE
    // ==========================================

    return res.redirect(resource.fileUrl);
  } catch (error) {
    console.error("Download Resource File Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to download resource",
      error: error.message,
    });
  }
};