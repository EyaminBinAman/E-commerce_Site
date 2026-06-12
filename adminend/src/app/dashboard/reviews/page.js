"use client";

import { useState } from "react";

import DashboardShell, { Badge, Icon } from "@/components/DashboardShell";
import { useToast } from "@/components/ui/toast";

const initialReviews = [
  {
    id: "RV-3001",
    customer: "Rafi",
    product: "Chicken Flavour Cat Food",
    rating: 5,
    review:
      "Delivery was quick and the product quality is exactly what my cat needs.",
    reply: "Thanks for the feedback, Rafi.",
    status: "replied",
  },
  {
    id: "RV-3002",
    customer: "Ayesha",
    product: "Dog Biscuit Gravy Mix",
    rating: 4,
    review: "My dog liked it. Packaging could be a little stronger.",
    reply: "",
    status: "pending",
  },
  {
    id: "RV-3003",
    customer: "Nabil",
    product: "Cat Litter 10L",
    rating: 3,
    review: "Good value, but the bag was slightly damaged on arrival.",
    reply: "Thanks for reporting this.",
    status: "replied",
  },
];

function stars(count) {
  return "★★★★★".slice(0, count);
}

export default function ReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState(initialReviews);
  const [selectedId, setSelectedId] = useState(initialReviews[0].id);
  const [replyText, setReplyText] = useState(initialReviews[0].reply);

  const selectedReview = reviews.find((item) => item.id === selectedId) || reviews[0];

  const selectReview = (id) => {
    const next = reviews.find((item) => item.id === id);
    if (!next) {
      return;
    }

    setSelectedId(id);
    setReplyText(next.reply);
  };

  const saveReply = () => {
    setReviews((prev) =>
      prev.map((item) =>
        item.id === selectedId
          ? {
              ...item,
              reply: replyText.trim(),
              status: replyText.trim() ? "replied" : item.status,
            }
          : item
      )
    );
    showToast({ tone: "success", title: "Reply saved." });
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
          Pick a review from the list, write a short reply, and save it.
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
            {reviews.map((review) => {
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
                  <p className="mt-3 text-sm font-black text-amber-500">{stars(review.rating)}</p>
                  <p className="mt-3 line-clamp-2 text-sm font-semibold leading-6 text-slate-600">
                    {review.review}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-[24px] border border-neutral-200 bg-white p-5 shadow-lg shadow-main/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.35em] text-main/70">
                Reply
              </p>
              <h2 className="mt-2 text-xl font-black text-main">
                Selected review
              </h2>
            </div>
            <Icon name="chat" className="h-6 w-6 text-main/70" />
          </div>

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
              rows={7}
              className="mt-1.5 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold leading-6 text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-main"
              placeholder="Write a short reply..."
            />
          </label>

          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={saveReply}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-main px-4 text-sm font-black text-white transition hover:bg-mainHover"
            >
              <Icon name="send" className="h-4 w-4" />
              Save reply
            </button>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
