const mongoose = require("mongoose");

const Banner = require("../../models/Banner");

const bannerTypeMap = {
  hero: "hero-banner",
  herobanner: "hero-banner",
  "hero-banner": "hero-banner",
  promo: "promo-banner",
  promobanner: "promo-banner",
  "promo-banner": "promo-banner",
  slider: "slider-banner",
  sliderbanner: "slider-banner",
  "slider-banner": "slider-banner",
  sliderpromo: "slider-banner",
  "slider-promo": "slider-banner",
};

const normalizeBannerType = (type) => {
  if (!type || typeof type !== "string") {
    return null;
  }

  const normalized = type.trim().toLowerCase().replace(/\s+/g, "-");
  return bannerTypeMap[normalized] || bannerTypeMap[normalized.replace(/-/g, "")] || null;
};

const isInvalidBannerId = (id, res) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }

  res.status(400).json({
    success: false,
    message: "Valid banner id is required",
  });
  return true;
};

const getNextSlideNumber = async (bannerType) => {
  const lastBanner = await Banner.findOne({ bannerType })
    .sort({ slideNumber: -1 })
    .select("slideNumber");

  return lastBanner ? lastBanner.slideNumber + 1 : 1;
};

const buildBannerData = async (body, currentBanner = null) => {
  const data = {};

  if (body.name !== undefined) {
    data.name = typeof body.name === "string" ? body.name.trim() : "";
  }

  if (body.bannerType !== undefined) {
    data.bannerType = normalizeBannerType(body.bannerType);
  }

  if (body.isActive !== undefined) {
    data.isActive = Boolean(body.isActive);
  }

  if (body.slideNumber !== undefined) {
    data.slideNumber = Number(body.slideNumber);
  }

  const bannerType = data.bannerType || currentBanner?.bannerType;

  if (!currentBanner && data.slideNumber === undefined && bannerType) {
    data.slideNumber = await getNextSlideNumber(bannerType);
  }

  return data;
};

const validateBannerPayload = (data, isUpdate = false) => {
  if (!isUpdate && !data.name) {
    return "Banner name is required";
  }

  if (data.name !== undefined && !data.name) {
    return "Banner name is required";
  }

  if (!isUpdate && !data.bannerType) {
    return "Banner type is required";
  }

  if (data.bannerType !== undefined && !data.bannerType) {
    return "Banner type must be hero-banner, promo-banner, or slider-banner";
  }

  if (!isUpdate && data.slideNumber === undefined) {
    return "Banner slide number is required";
  }

  if (
    data.slideNumber !== undefined &&
    (!Number.isInteger(data.slideNumber) || data.slideNumber < 1)
  ) {
    return "Banner slide number must be a positive integer";
  }

  return null;
};

const ensurePromoBannerLimit = async (bannerData, currentBanner = null) => {
  const bannerType = bannerData.bannerType || currentBanner?.bannerType;
  const isActive =
    bannerData.isActive !== undefined ? bannerData.isActive : currentBanner?.isActive ?? true;

  if (bannerType !== "promo-banner" || !isActive) {
    return null;
  }

  const activePromoBannerCount = await Banner.countDocuments({
    bannerType: "promo-banner",
    isActive: true,
    ...(currentBanner ? { _id: { $ne: currentBanner._id } } : {}),
  });

  if (activePromoBannerCount >= 2) {
    return "Only 2 active promo banners are allowed";
  }

  return null;
};

const getBanners = async (req, res, next) => {
  try {
    const bannerType = normalizeBannerType(req.query.type);
    const filter = { isActive: true };

    if (bannerType) {
      filter.bannerType = bannerType;
    }

    const banners = await Banner.find(filter).sort({
      bannerType: 1,
      slideNumber: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Banners fetched successfully",
      banners,
    });
  } catch (error) {
    next(error);
  }
};

const postBanner = async (req, res, next) => {
  try {
    const data = await buildBannerData(req.body);
    const validationMessage = validateBannerPayload(data);

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage,
      });
    }

    const limitMessage = await ensurePromoBannerLimit(data);

    if (limitMessage) {
      return res.status(400).json({
        success: false,
        message: limitMessage,
      });
    }

    const banner = await Banner.create(data);

    return res.status(201).json({
      success: true,
      message: "Banner created successfully",
      banner,
    });
  } catch (error) {
    next(error);
  }
};

const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isInvalidBannerId(id, res)) {
      return;
    }

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    const data = await buildBannerData(req.body, banner);
    const validationMessage = validateBannerPayload(data, true);

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage,
      });
    }

    const limitMessage = await ensurePromoBannerLimit(data, banner);

    if (limitMessage) {
      return res.status(400).json({
        success: false,
        message: limitMessage,
      });
    }

    Object.assign(banner, data);
    await banner.save();

    return res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      banner,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isInvalidBannerId(id, res)) {
      return;
    }

    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleBannerActive = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isInvalidBannerId(id, res)) {
      return;
    }

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    const nextIsActive =
      typeof req.body.isActive === "boolean" ? req.body.isActive : !banner.isActive;
    const limitMessage = await ensurePromoBannerLimit({ isActive: nextIsActive }, banner);

    if (limitMessage) {
      return res.status(400).json({
        success: false,
        message: limitMessage,
      });
    }

    banner.isActive = nextIsActive;
    await banner.save();

    return res.status(200).json({
      success: true,
      message: "Banner active status updated successfully",
      banner,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBanners,
  postBanner,
  updateBanner,
  deleteBanner,
  toggleBannerActive,
};
