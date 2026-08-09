import Resource from "../models/Resource.js"; // Adjust path as needed
import mongoose from "mongoose";
import path from "path";
import fs from "fs";


export const createResource = async (req, res) => {
  try {
    const {
      title,
      slug,
      subtitle,
      description,
      bodyContent,

      // Taxonomy
      category,
      subcategory,
      resourceType,
      difficulty,
      estimatedDuration,

      // Content & Links
      externalUrl,
      primaryVideo, // JSON String or Object

      // Author & SEO
      author, // JSON String or Object
      seo, // JSON String or Object

      // Curriculum & Modules
      modules, // JSON String or Array

      // Educational Arrays
      targetAudience,
      whatYouWillLearn,
      prerequisites,
      keyTakeaways,
      skills,
      tags,

      // Attachments Manifest
      attachmentManifest, // JSON String or Array

      // Publishing & Flags
      status,
      isFeatured,
      isPremium,
    } = req.body;

    // =====================================================
    // 1. BASIC VALIDATION
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
          "Title, subtitle, description, category, and resource type are required.",
      });
    }

    // =====================================================
    // 2. FILE MAPPER (req.files from upload.any())
    // =====================================================
    const filesMap = {};
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        filesMap[file.fieldname] = file;
      });
    }

    const thumbnailFile = filesMap["thumbnail"] || null;
    const bannerFile = filesMap["bannerImage"] || null;

    // =====================================================
    // 3. PARSE JSON & ARRAY HELPERS
    // =====================================================
    const parseJSON = (value, fallback = {}) => {
      if (!value) return fallback;
      if (typeof value === "object") return value;
      try {
        return JSON.parse(value);
      } catch (err) {
        return fallback;
      }
    };

    const parseArray = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
      }
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return parsed.map((item) => String(item).trim()).filter(Boolean);
          }
        } catch (err) {
          return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }
      return [];
    };

    // =====================================================
    // 4. PROCESS ATTACHMENTS BUNDLE
    // =====================================================
    const parsedManifest = parseJSON(attachmentManifest, []);
    const processedAttachments = [];

    if (Array.isArray(parsedManifest)) {
      parsedManifest.forEach((item) => {
        const fileObj = filesMap[item.fieldKey];
        if (fileObj) {
          processedAttachments.push({
            title: item.title || fileObj.originalname,
            fileUrl:
              fileObj.path || fileObj.secure_url || fileObj.location || "",
            publicId: fileObj.filename || fileObj.public_id || "",
            fileType: item.fileType || "pdf",
            fileSize: fileObj.size || 0,
          });
        }
      });
    }

    // =====================================================
    // 5. SLUG GENERATION & DUPLICATE CHECK
    // =====================================================
    let finalSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    const existingSlug = await Resource.findOne({ slug: finalSlug });
    if (existingSlug) {
      finalSlug = `${finalSlug}-${Date.now()}`;
    }

    // =====================================================
    // 6. BUILD STRUCTURAL OBJECTS
    // =====================================================
    const parsedAuthor = parseJSON(author, {});
    const parsedSeo = parseJSON(seo, {});
    const parsedPrimaryVideo = parseJSON(primaryVideo, {});
    const parsedModules = parseJSON(modules, []);

    // =====================================================
    // 7. CREATE RESOURCE DOCUMENT
    // =====================================================
    const resource = await Resource.create({
      title: title.trim(),
      slug: finalSlug,
      subtitle: subtitle.trim(),
      description: description.trim(),
      bodyContent: bodyContent?.trim() || "",

      // Taxonomy
      category,
      subcategory: subcategory?.trim() || "",
      resourceType,
      difficulty: [
        "Beginner",
        "Intermediate",
        "Advanced",
        "All Levels",
      ].includes(difficulty)
        ? difficulty
        : "Beginner",
      estimatedDuration: estimatedDuration?.trim() || "",
      targetAudience: parseArray(targetAudience),

      // Author Attribution (Pure embedded sub-document)
      author: {
        name: parsedAuthor.name || "GuideX Career Team",
        role: parsedAuthor.role || "Career & Learning Team",
        avatar: parsedAuthor.avatar || "",
        bio: parsedAuthor.bio || "",
      },

      // Cover & Media
      thumbnail: {
        url: thumbnailFile
          ? thumbnailFile.path || thumbnailFile.secure_url || ""
          : "",
        publicId: thumbnailFile
          ? thumbnailFile.filename || thumbnailFile.public_id || ""
          : "",
      },
      bannerImage: {
        url: bannerFile ? bannerFile.path || bannerFile.secure_url || "" : "",
        publicId: bannerFile
          ? bannerFile.filename || bannerFile.public_id || ""
          : "",
      },
      attachments: processedAttachments,
      externalUrl: externalUrl?.trim() || "",
      primaryVideo: {
        provider: parsedPrimaryVideo.provider || "youtube",
        url: parsedPrimaryVideo.url || "",
        durationInSeconds: Number(parsedPrimaryVideo.durationInSeconds) || 0,
      },

      // Curriculum / Roadmap Modules
      modules: Array.isArray(parsedModules)
        ? parsedModules.map((m) => ({
            title: m.title?.trim() || "Module Section",
            description: m.description?.trim() || "",
            content: m.content || "",
            videoUrl: m.videoUrl?.trim() || "",
            durationInMinutes: Number(m.durationInMinutes) || 0,
            isFreePreview:
              m.isFreePreview === true || m.isFreePreview === "true",
          }))
        : [],

      // Educational Metadata
      whatYouWillLearn: parseArray(whatYouWillLearn),
      prerequisites: parseArray(prerequisites),
      keyTakeaways: parseArray(keyTakeaways),
      skills: parseArray(skills),
      tags: parseArray(tags).map((t) => t.toLowerCase()),

      // Publishing & Access
      status: status === "Published" ? "Published" : "Draft",
      isFeatured: isFeatured === true || isFeatured === "true",
      isPremium: isPremium === true || isPremium === "true",
      publishedAt: status === "Published" ? new Date() : null,

      // SEO
      seo: {
        title: parsedSeo.title || title.trim(),
        description: parsedSeo.description || subtitle.trim(),
        keywords: parseArray(parsedSeo.keywords),
        ogImage: parsedSeo.ogImage || "",
      },

      // Initial Metrics
      metrics: {
        viewsCount: 0,
        likesCount: 0,
        downloadsCount: 0,
        savesCount: 0,
        sharesCount: 0,
        averageRating: 0,
        totalRatings: 0,
      },
    });

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

// =====================================================
// GET ALL RESOURCES (ADMIN PANEL)
// =====================================================
export const getAllResourcesAdmin = async (req, res) => {
  try {
    const {
      search,
      category,
      status,
      difficulty,
      isFeatured,
      isPremium,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query;

    // =====================================================
    // 1. BUILD DYNAMIC QUERY FILTER
    // =====================================================
    const filter = {};

    // Text Search (Title, Subtitle, or Tags)
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { title: searchRegex },
        { subtitle: searchRegex },
        { tags: searchRegex },
        { category: searchRegex },
      ];
    }

    // Category Filter
    if (category && category !== "All") {
      filter.category = category;
    }

    // Status Filter (Draft, Published, Archived)
    if (status && status !== "All") {
      filter.status = status;
    }

    // Difficulty Filter
    if (difficulty && difficulty !== "All") {
      filter.difficulty = difficulty;
    }

    // Featured Filter
    if (isFeatured !== undefined && isFeatured !== "") {
      filter.isFeatured = isFeatured === "true" || isFeatured === true;
    }

    // Premium Filter
    if (isPremium !== undefined && isPremium !== "") {
      filter.isPremium = isPremium === "true" || isPremium === true;
    }

    // =====================================================
    // 2. PAGINATION & SORTING SETUP
    // =====================================================
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    // Sort order map
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    // =====================================================
    // 3. EXECUTE PARALLEL QUERIES
    // =====================================================
    const [resources, totalResources, totalPublished, totalDrafts] =
      await Promise.all([
        Resource.find(filter)
          .select(
            "title slug subtitle category resourceType difficulty status isFeatured isPremium metrics thumbnail author createdAt publishedAt"
          )
          .sort(sortOptions)
          .skip(skip)
          .limit(limitNum)
          .lean(),

        Resource.countDocuments(filter), // Filtered count for pagination
        Resource.countDocuments({ status: "Published" }), // Overall admin metric
        Resource.countDocuments({ status: "Draft" }), // Overall admin metric
      ]);

    const totalPages = Math.ceil(totalResources / limitNum);

    // =====================================================
    // 4. RESPONSE PAYLOAD
    // =====================================================
    return res.status(200).json({
      success: true,
      count: resources.length,
      pagination: {
        totalResources,
        totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      stats: {
        totalPublished,
        totalDrafts,
      },
      resources,
    });
  } catch (error) {
    console.error("Get All Resources Admin Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resources for admin panel",
      error: error.message,
    });
  }
};

export const toggleResourceStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID format.",
      });
    }

    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found.",
      });
    }

    // Toggle between Published and Draft
    const newStatus = resource.status === "Published" ? "Draft" : "Published";
    resource.status = newStatus;

    // Set or clear published timestamp
    if (newStatus === "Published") {
      resource.publishedAt = resource.publishedAt || new Date();
    }

    await resource.save();

    return res.status(200).json({
      success: true,
      message: `Resource status changed to ${newStatus.toLowerCase()}.`,
      status: resource.status,
      publishedAt: resource.publishedAt,
      resource,
    });
  } catch (error) {
    console.error("Toggle Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update resource status.",
      error: error.message,
    });
  }
};


export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID format.",
      });
    }

    const {
      title,
      slug,
      subtitle,
      description,
      bodyContent,

      // Taxonomy
      category,
      subcategory,
      resourceType,
      difficulty,
      estimatedDuration,

      // Content & Links
      externalUrl,
      primaryVideo, // JSON string or Object

      // Author & SEO
      author, // JSON string or Object
      seo, // JSON string or Object

      // Curriculum & Modules
      modules, // JSON string or Array

      // Educational Arrays
      targetAudience,
      whatYouWillLearn,
      prerequisites,
      keyTakeaways,
      skills,
      tags,

      // Attachments Manifest
      attachmentManifest, // JSON string or Array

      // Publishing & Access
      status,
      isFeatured,
      isPremium,
    } = req.body;

    // =====================================================
    // 1. FIND RESOURCE
    // =====================================================
    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found.",
      });
    }

    // =====================================================
    // 2. PARSE FILE MAPPER (req.files from upload.any())
    // =====================================================
    const filesMap = {};
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file) => {
        filesMap[file.fieldname] = file;
      });
    }

    const thumbnailFile = filesMap["thumbnail"] || null;
    const bannerFile = filesMap["bannerImage"] || null;

    // =====================================================
    // 3. PARSE JSON & ARRAY HELPERS
    // =====================================================
    const parseJSON = (value, fallback = {}) => {
      if (!value) return fallback;
      if (typeof value === "object") return value;
      try {
        return JSON.parse(value);
      } catch (err) {
        return fallback;
      }
    };

    const parseArray = (value) => {
      if (!value) return [];
      if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean);
      }
      if (typeof value === "string") {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return parsed.map((item) => String(item).trim()).filter(Boolean);
          }
        } catch (err) {
          return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        }
      }
      return [];
    };

    // =====================================================
    // 4. UPDATE BASIC IDENTIFICATION & ROUTING
    // =====================================================
    if (title !== undefined) resource.title = title.trim();
    if (subtitle !== undefined) resource.subtitle = subtitle.trim();
    if (description !== undefined) resource.description = description.trim();
    if (bodyContent !== undefined) resource.bodyContent = bodyContent.trim();

    // Slug update or generation
    if (slug !== undefined && slug.trim() !== "") {
      let finalSlug = slug
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      if (finalSlug !== resource.slug) {
        const existingSlug = await Resource.findOne({ slug: finalSlug });
        if (existingSlug) {
          finalSlug = `${finalSlug}-${Date.now()}`;
        }
        resource.slug = finalSlug;
      }
    }

    // =====================================================
    // 5. UPDATE TAXONOMY & CLASSIFICATION
    // =====================================================
    if (category !== undefined) resource.category = category;
    if (subcategory !== undefined) resource.subcategory = subcategory.trim();
    if (resourceType !== undefined) resource.resourceType = resourceType;

    if (difficulty !== undefined) {
      resource.difficulty = [
        "Beginner",
        "Intermediate",
        "Advanced",
        "All Levels",
      ].includes(difficulty)
        ? difficulty
        : "Beginner";
    }

    if (estimatedDuration !== undefined) {
      resource.estimatedDuration = estimatedDuration.trim();
    }

    if (targetAudience !== undefined) {
      resource.targetAudience = parseArray(targetAudience);
    }

    // =====================================================
    // 6. UPDATE AUTHOR ATTRIBUTION
    // =====================================================
    if (author !== undefined) {
      const parsedAuthor = parseJSON(author, {});
      resource.author = {
        name:
          parsedAuthor.name || resource.author?.name || "GuideX Career Team",
        role:
          parsedAuthor.role ||
          resource.author?.role ||
          "Career & Learning Team",
        avatar: parsedAuthor.avatar || resource.author?.avatar || "",
        bio: parsedAuthor.bio || resource.author?.bio || "",
      };
    }

    // =====================================================
    // 7. UPDATE COVERS & PRIMARY MEDIA
    // =====================================================
    if (thumbnailFile) {
      resource.thumbnail = {
        url: thumbnailFile.path || thumbnailFile.secure_url || "",
        publicId: thumbnailFile.filename || thumbnailFile.public_id || "",
      };
    }

    if (bannerFile) {
      resource.bannerImage = {
        url: bannerFile.path || bannerFile.secure_url || "",
        publicId: bannerFile.filename || bannerFile.public_id || "",
      };
    }

    if (externalUrl !== undefined) {
      resource.externalUrl = externalUrl.trim();
    }

    if (primaryVideo !== undefined) {
      const parsedVideo = parseJSON(primaryVideo, {});
      resource.primaryVideo = {
        provider:
          parsedVideo.provider || resource.primaryVideo?.provider || "youtube",
        url:
          parsedVideo.url !== undefined
            ? parsedVideo.url
            : resource.primaryVideo?.url || "",
        durationInSeconds:
          Number(parsedVideo.durationInSeconds) ||
          resource.primaryVideo?.durationInSeconds ||
          0,
      };
    }

    // =====================================================
    // 8. UPDATE ATTACHMENTS BUNDLE
    // =====================================================
    if (attachmentManifest !== undefined) {
      const parsedManifest = parseJSON(attachmentManifest, []);
      const processedAttachments = [];

      if (Array.isArray(parsedManifest)) {
        parsedManifest.forEach((item) => {
          if (item.fieldKey && filesMap[item.fieldKey]) {
            // New uploaded file binary
            const fileObj = filesMap[item.fieldKey];
            processedAttachments.push({
              title: item.title || fileObj.originalname,
              fileUrl:
                fileObj.path || fileObj.secure_url || fileObj.location || "",
              publicId: fileObj.filename || fileObj.public_id || "",
              fileType: item.fileType || "pdf",
              fileSize: fileObj.size || 0,
            });
          } else if (item.fileUrl) {
            // Retain existing file attachment
            processedAttachments.push({
              title: item.title || "File Attachment",
              fileUrl: item.fileUrl,
              publicId: item.publicId || "",
              fileType: item.fileType || "pdf",
              fileSize: item.fileSize || 0,
            });
          }
        });
      }

      resource.attachments = processedAttachments;
    }

    // =====================================================
    // 9. UPDATE CURRICULUM MODULES
    // =====================================================
    if (modules !== undefined) {
      const parsedModules = parseJSON(modules, []);
      resource.modules = Array.isArray(parsedModules)
        ? parsedModules.map((m) => ({
            title: m.title?.trim() || "Module Section",
            description: m.description?.trim() || "",
            content: m.content || "",
            videoUrl: m.videoUrl?.trim() || "",
            durationInMinutes: Number(m.durationInMinutes) || 0,
            isFreePreview:
              m.isFreePreview === true || m.isFreePreview === "true",
          }))
        : [];
    }

    // =====================================================
    // 10. UPDATE EDUCATIONAL METADATA
    // =====================================================
    if (whatYouWillLearn !== undefined) {
      resource.whatYouWillLearn = parseArray(whatYouWillLearn);
    }
    if (prerequisites !== undefined) {
      resource.prerequisites = parseArray(prerequisites);
    }
    if (keyTakeaways !== undefined) {
      resource.keyTakeaways = parseArray(keyTakeaways);
    }
    if (skills !== undefined) {
      resource.skills = parseArray(skills);
    }
    if (tags !== undefined) {
      resource.tags = parseArray(tags).map((t) => t.toLowerCase());
    }

    // =====================================================
    // 11. PUBLISHING, ACCESS & SEO
    // =====================================================
    if (status !== undefined) {
      const newStatus = status === "Published" ? "Published" : "Draft";
      if (newStatus === "Published" && resource.status !== "Published") {
        resource.publishedAt = new Date();
      }
      resource.status = newStatus;
    }

    if (isFeatured !== undefined) {
      resource.isFeatured = isFeatured === true || isFeatured === "true";
    }

    if (isPremium !== undefined) {
      resource.isPremium = isPremium === true || isPremium === "true";
    }

    if (seo !== undefined) {
      const parsedSeo = parseJSON(seo, {});
      resource.seo = {
        title: parsedSeo.title || resource.seo?.title || resource.title,
        description:
          parsedSeo.description ||
          resource.seo?.description ||
          resource.subtitle,
        keywords:
          parsedSeo.keywords !== undefined
            ? parseArray(parsedSeo.keywords)
            : resource.seo?.keywords || [],
        ogImage: parsedSeo.ogImage || resource.seo?.ogImage || "",
      };
    }

    // =====================================================
    // 12. SAVE DOCUMENT
    // =====================================================
    await resource.save();

    return res.status(200).json({
      success: true,
      message: "Resource updated successfully.",
      resource,
    });
  } catch (error) {
    console.error("Update Resource Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update resource.",
      error: error.message,
    });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID format.",
      });
    }

    const resource = await Resource.findById(id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found.",
      });
    }

    // Optional: Cloudinary/S3 Cleanup Hook can be placed here using resource.thumbnail.publicId or resource.attachments

    await Resource.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Resource deleted successfully.",
      deletedId: id,
    });
  } catch (error) {
    console.error("Delete Resource Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete resource.",
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
            (student) =>
              (student._id || student).toString() === studentId.toString()
          )
        : false;

      // Extract counts safely from nested metrics or top-level fallback
      const likesCount =
        resource.metrics?.likesCount ??
        resource.likes ??
        resource.likedBy?.length ??
        0;

      const viewsCount = resource.metrics?.viewsCount ?? resource.views ?? 0;

      const downloadsCount =
        resource.metrics?.downloadsCount ??
        resource.downloads ??
        resource.downloadedBy?.length ??
        0;

      return {
        ...resource,
        isLiked,
        likes: likesCount,
        views: viewsCount,
        downloads: downloadsCount,
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

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid resource ID format.",
      });
    }

    // Retrieve resource with populated student relations (REMOVED author.userRef)
    const resource = await Resource.findById(id)
      .populate({
        path: "likedBy",
        select: "firstName lastName email profileImage role isActive",
      })
      .populate({
        path: "downloadedBy",
        select: "firstName lastName email profileImage role isActive",
      })
      .populate({
        path: "savedBy",
        select: "firstName lastName email profileImage role isActive",
      })
      .lean();

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found.",
      });
    }

    return res.status(200).json({
      success: true,
      resource,
    });
  } catch (error) {
    console.error("Get admin resource details error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch resource details.",
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


// =====================================================
export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user?._id || req.user?.id;

    // Search by ObjectId or slug
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { slug: id };

    const resource = await Resource.findOne(query).lean();

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    // Check interaction status
    const isLiked = studentId
      ? (resource.likedBy || []).some(
          (uid) => uid.toString() === studentId.toString()
        )
      : false;

    const isSaved = studentId
      ? (resource.savedBy || []).some(
          (uid) => uid.toString() === studentId.toString()
        )
      : false;

    const isDownloaded = studentId
      ? (resource.downloadedBy || []).some(
          (uid) => uid.toString() === studentId.toString()
        )
      : false;

    // Full Unrestricted Response mapping
    const completeResource = {
      ...resource,
      isLiked,
      isSaved,
      isDownloaded,
      metrics: {
        viewsCount: resource.metrics?.viewsCount ?? resource.views ?? 0,
        likesCount: resource.metrics?.likesCount ?? resource.likes ?? 0,
        downloadsCount:
          resource.metrics?.downloadsCount ?? resource.downloads ?? 0,
        savesCount: resource.metrics?.savesCount || 0,
        sharesCount: resource.metrics?.sharesCount || 0,
        averageRating: resource.metrics?.averageRating || 0,
        totalRatings: resource.metrics?.totalRatings || 0,
      },
      publishedAt: resource.publishedAt || resource.createdAt,
    };

    return res.status(200).json({
      success: true,
      message: "Resource fetched successfully",
      resource: completeResource,
    });
  } catch (error) {
    console.error("Get Resource Details Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch resource details",
      error: error.message,
    });
  }
};


export const toggleResourceLike = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user?._id || req.user?.id;

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

    // Ensure likedBy is initialized
    if (!resource.likedBy) {
      resource.likedBy = [];
    }

    const alreadyLiked = resource.likedBy.some(
      (student) => student.toString() === studentId.toString()
    );

    if (alreadyLiked) {
      // UNLIKE
      resource.likedBy.pull(studentId);
    } else {
      // LIKE
      resource.likedBy.push(studentId);
    }

    // Always calculate likes count directly from array length
    const totalLikes = resource.likedBy.length;
    resource.likes = totalLikes;

    if (!resource.metrics) {
      resource.metrics = {};
    }
    resource.metrics.likesCount = totalLikes;

    await resource.save();

    return res.status(200).json({
      success: true,
      message: alreadyLiked
        ? "Resource unliked successfully"
        : "Resource liked successfully",
      isLiked: !alreadyLiked,
      likes: totalLikes,
      metrics: resource.metrics,
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


export const trackResourceView = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user?._id || req.user?.id;

    if (!studentId) {
      // Unauthenticated view handling (optional: return current count without incrementing)
      const resource = await Resource.findById(id).select("metrics views");
      return res.status(200).json({
        success: true,
        views: resource?.metrics?.viewsCount ?? resource?.views ?? 0,
      });
    }

    // Step 1: Try to add studentId to viewedBy ONLY if it isn't already in the array
    const updatedResource = await Resource.findOneAndUpdate(
      {
        _id: id,
        status: "Published",
        viewedBy: { $ne: studentId }, // Match ONLY if student hasn't viewed yet
      },
      {
        $addToSet: { viewedBy: studentId },
        $inc: {
          "metrics.viewsCount": 1,
          views: 1, // Sync legacy views field if present
        },
      },
      { new: true }
    );

    // Step 2: If updatedResource is null, either the user already viewed it OR resource doesn't exist
    if (!updatedResource) {
      const existingResource = await Resource.findOne({
        _id: id,
        status: "Published",
      }).lean();

      if (!existingResource) {
        return res.status(404).json({
          success: false,
          message: "Resource not found",
        });
      }

      // User already viewed this resource
      return res.status(200).json({
        success: true,
        views:
          existingResource.metrics?.viewsCount ?? existingResource.views ?? 0,
      });
    }

    return res.status(200).json({
      success: true,
      views: updatedResource.metrics?.viewsCount ?? updatedResource.views ?? 0,
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


export const getResourceInteractions = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findById(id)
      .populate({
        path: "likedBy",
        select: "firstName lastName email profileImage createdAt phone",
      })
      .populate({
        path: "downloadedBy",
        select: "firstName lastName email profileImage createdAt phone",
      })
      .populate({
        path: "savedBy",
        select: "firstName lastName email profileImage createdAt phone",
      })
      .populate({
        path: "viewedBy",
        select: "firstName lastName email profileImage createdAt phone",
      })
      .lean();

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found",
      });
    }

    return res.status(200).json({
      success: true,
      resourceTitle: resource.title,
      resourceType: resource.resourceType,
      category: resource.category,
      createdAt: resource.createdAt,
      metrics: {
        viewsCount: resource.metrics?.viewsCount ?? resource.views ?? 0,
        likesCount: resource.metrics?.likesCount ?? resource.likes ?? 0,
        downloadsCount:
          resource.metrics?.downloadsCount ?? resource.downloads ?? 0,
        savesCount: resource.metrics?.savesCount ?? resource.saves ?? 0,
      },
      interactions: {
        likedBy: resource.likedBy || [],
        downloadedBy: resource.downloadedBy || [],
        savedBy: resource.savedBy || [],
        viewedBy: resource.viewedBy || [],
      },
    });
  } catch (error) {
    console.error("Get Resource Interactions Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch student interactions",
      error: error.message,
    });
  }
};


export const submitResourceReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const studentId = req.user?._id || req.user?.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Student authentication required to submit a review",
      });
    }

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid rating between 1 and 5 stars",
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

    if (!resource.metrics) {
      resource.metrics = { averageRating: 0, totalRatings: 0 };
    }

    const currentTotal = resource.metrics.totalRatings || 0;
    const currentAvg = resource.metrics.averageRating || 0;

    // Calculate rolling average
    const newTotalRatings = currentTotal + 1;
    const newAverageRating = Number(
      ((currentAvg * currentTotal + numericRating) / newTotalRatings).toFixed(1)
    );

    resource.metrics.totalRatings = newTotalRatings;
    resource.metrics.averageRating = newAverageRating;

    await resource.save();

    return res.status(200).json({
      success: true,
      message: "Thank you for your rating!",
      averageRating: resource.metrics.averageRating,
      totalRatings: resource.metrics.totalRatings,
    });
  } catch (error) {
    console.error("Submit Review Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit review",
      error: error.message,
    });
  }
};




// =====================================================
// DOWNLOAD RESOURCE FILE (TRACKS UNIQUE DOWNLOADS)
// =====================================================
export const downloadResourceFile = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user?._id || req.user?.id;

    const resource = await Resource.findOne({
      _id: id,
      status: "Published",
    });

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: "Resource not found or not published",
      });
    }

    const fileUrl = resource.fileUrl || resource.attachments?.[0]?.fileUrl;

    if (!fileUrl) {
      return res.status(400).json({
        success: false,
        message: "No downloadable file is associated with this resource",
      });
    }

    // Update download tracking metrics
    if (!resource.downloadedBy) {
      resource.downloadedBy = [];
    }

    if (studentId) {
      const alreadyDownloaded = resource.downloadedBy.some(
        (uid) => uid.toString() === studentId.toString()
      );

      if (!alreadyDownloaded) {
        resource.downloadedBy.push(studentId);
      }
    }

    const totalDownloads = resource.downloadedBy.length;
    if (!resource.metrics) resource.metrics = {};
    resource.metrics.downloadsCount = totalDownloads;
    resource.downloads = totalDownloads;

    await resource.save();

    // Check if local file path exists on server disk
    const relativePath = fileUrl.replace(/^https?:\/\/[^\/]+/, "");
    const localFilePath = path.join(process.cwd(), relativePath);

    if (fs.existsSync(localFilePath)) {
      return res.download(
        localFilePath,
        resource.fileName || path.basename(localFilePath)
      );
    }

    // If external Cloudinary / S3 / Remote URL
    return res.status(200).json({
      success: true,
      message: "Download metric updated",
      downloadUrl: fileUrl,
      downloadsCount: totalDownloads,
    });
  } catch (error) {
    console.error("Download Resource Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process download",
      error: error.message,
    });
  }
};