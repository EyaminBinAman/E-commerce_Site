"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardShell, { Badge, Icon } from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";
import { adminApi } from "@/lib/adminApi";

function stars(count) {
  return "★★★★★".slice(0, count);
}

const normalizeReview = (review) => ({
  id: review._id,
  customer: review.customerName,
  product: review.product?.name || "Product",
  rating: review.rating,
  review: review.comment,
  reply: review.reply || "",
  status: review.status || (review.reply ? "replied" : "pending"),
});

export default function ReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let alive = true;

    adminApi("/reviews/get-reviews")
      .then((data) => {
        if (!alive) return;

        const nextReviews = (data.reviews || []).map(normalizeReview);
        setReviews(nextReviews);
        if (nextReviews[0]) {
          setSelectedId(nextReviews[0].id);
          setReplyText(nextReviews[0].reply);
        }
      })
      .catch((error) => {
        showToast({ tone: "danger", title: error.message || "Failed to load reviews." });
      })
      .finally(() => {
        if (alive) setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [showToast]);

  const selectedReview = useMemo(
    () => reviews.find((item) => item.id === selectedId) || reviews[0] || null,
    [reviews, selectedId]
  );

  const selectReview = (id) => {
    const next = reviews.find((item) => item.id === id);
    if (!next) return;

    setSelectedId(id);
    setReplyText(next.reply);
  };

  const saveReply = async () => {
    if (!selectedReview) {
      return;
    }

    setSaving(true);
    try {
      await adminApi(`/reviews/reply-reviews/${selectedReview.id}`, {
        method: "PATCH",
        body: JSON.stringify({ reply: replyText.trim() }),
      });

      const data = await adminApi("/reviews/get-reviews");
      const nextReviews = (data.reviews || []).map(normalizeReview);
      setReviews(nextReviews);
      const refreshed = nextReviews.find((item) => item.id === selectedReview.id);
      setReplyText(refreshed?.reply || "");
      showToast({ tone: "success", title: "Reply saved." });
    } catch (error) {
      showToast({ tone: "danger", title: error.message || "Failed to save reply." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell activeItem="Reviews & Replies">
      <div className="rounded-[24px] border border-neutral-200 bg-white px-5 py-5 shadow-lg shadow-main/5 md:px-6">
        <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
          Customer Voice
        </p>
        <h1 className="mt-2 text-2xl font-black tracking-tight text-main md:text-3xl">
          Reviews & Replies
        </h1>
        <p className="mt-1.5 max-w-3xl text-sm font-semibold leading-6 text-slate-500">
          Keep the review list short, select one review, and save a reply when
          needed.
        </p>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[24px] border border-neutral-200 bg-white shadow-lg shadow-main/5">
          <div className="border-b border-neutral-100 px-5 py-4">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
              Review list
            </p>
          </div>
          <div className="space-y-3 p-4">
            {loading ? (
              <p className="px-2 py-4 text-sm font-semibold text-slate-500">
                Loading reviews...
              </p>
            ) : reviews.length ? (
              reviews.map((review) => {
                const isActive = review.id === selectedId;
                return (
                  <button
                    type="button"
                    key={review.id}
                    onClick={() => selectReview(review.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isActive
                        ? "border-main/30 bg-mainSoft shadow-inner"
                        : "border-neutral-200 bg-white hover:border-main/20 hover:bg-mainSoft/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-black text-main">{review.customer}</p>
                        <p className="mt-1 text-xs font-semibold text-slate-400">
                          {review.product}
                        </p>
                      </div>
                      <Badge tone={review.status === "replied" ? "green" : "yellow"}>
                        {review.status === "replied" ? "Replied" : "Pending"}
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm font-black text-amber-500">
                      {stars(review.rating)}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-slate-600">
                      {review.review}
                    </p>
                  </button>
                );
              })
            ) : (
              <p className="px-2 py-4 text-sm font-semibold text-slate-500">
                No reviews yet.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
                Reply
              </p>
              <h2 className="mt-2 text-xl font-black text-main">Selected review</h2>
            </div>
            <Icon name="chat" className="h-6 w-6 text-main/70" />
          </div>

          {selectedReview ? (
            <>
              <div className="mt-5 rounded-2xl border border-neutral-200 bg-mainSoft/30 p-4">
                <p className="text-sm font-black text-main">{selectedReview.customer}</p>
                <p className="mt-1 text-xs font-semibold text-slate-400">
                  {selectedReview.product}
                </p>
                <p className="mt-3 text-sm font-black text-amber-500">
                  {stars(selectedReview.rating)}
                </p>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                  {selectedReview.review}
                </p>
              </div>

              <label className="mt-5 block">
                <span className="text-xs font-black uppercase tracking-[0.22em] text-main/75">
                  Reply text
                </span>
                <textarea
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                  rows={6}
                  className="mt-1.5 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-main"
                  placeholder="Write a short reply..."
                />
              </label>

              <div className="mt-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={saveReply}
                  disabled={saving}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-main px-4 text-sm font-black text-white transition hover:bg-mainHover disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <Icon name="send" className="h-4 w-4" />
                  {saving ? "Saving..." : "Save reply"}
                </button>
              </div>
            </>
          ) : (
            <p className="mt-5 text-sm font-semibold text-slate-500">
              Select a review to reply.
            </p>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}
