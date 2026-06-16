import { apiRequest } from "@/lib/api";

export async function getProductReviews(productId) {
  const data = await apiRequest(`/reviews/get-reviews?productId=${productId}`);
  return data.reviews || [];
}

export async function submitProductReview({ productId, rating, comment }) {
  const data = await apiRequest("/reviews/post-reviews", {
    method: "POST",
    body: JSON.stringify({ productId, rating, comment }),
  });
  return data.review;
}
