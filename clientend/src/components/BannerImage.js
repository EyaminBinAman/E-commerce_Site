import { getBannerImageUrl } from "@/lib/bannerApi";

export default function BannerImage({
  imageUrl,
  src,
  alt = "Banner",
  priority = false,
  className = "h-full w-full object-cover",
  wrapperClassName = "",
}) {
  const resolvedSrc = src || getBannerImageUrl(imageUrl);

  if (!resolvedSrc) {
    return null;
  }

  return (
    <div className={wrapperClassName}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolvedSrc}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={className}
      />
    </div>
  );
}
