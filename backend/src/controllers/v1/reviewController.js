const mongoose = require("mongoose");

const Review = require("../../models/Review");
const Product = require("../../models/Product");

const getProductFilter = async (value) => {
  if (!value) {
    return {};
  }

  if (mongoose.Types.ObjectId.isValid(value)) {
    return { product: value };
  }

  const product = await Product.findOne({
    slug: value,
    isDeleted: false,
  }).select("_id");

  return product ? { product: product._id } : { product: null };
};

const getReviews = async (req, res, next) => {
  try {
    const productFilter = await getProductFilter(req.query.product || req.query.productId);
    if (productFilter.product === null) {
      return res.status(200).json({
        success: true,
        message: "Reviews fetched successfully",
        reviews: [],
      });
    }

    const reviews = await Review.find({
      ...productFilter,
      ...(req.user?.role === "admin" ? {} : { isActive: true }),
    })
      .populate("product", "name slug price discountPrice")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

const postReview = async (req, res, next) => {
  try {
    const { productId, customerName, rating, comment } = req.body;

    if (!productId || !customerName || !comment || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "productId, customerName, rating, and comment are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Valid productId is required",
      });
    }

    const product = await Product.findOne({ _id: productId, isDeleted: false });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const review = await Review.create({
      product: product._id,
      customerName: customerName.trim(),
      rating: Number(rating),
      comment: comment.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    next(error);
  }
};

const replyReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reply } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid review id is required",
      });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    review.reply = typeof reply === "string" ? reply.trim() : "";
    review.status = review.reply ? "replied" : "pending";
    await review.save();

    return res.status(200).json({
      success: true,
      message: "Review reply updated successfully",
      review,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Valid review id is required",
      });
    }

    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReviews,
  postReview,
  replyReview,
  deleteReview,
};
