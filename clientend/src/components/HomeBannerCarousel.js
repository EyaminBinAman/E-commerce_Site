import BannerCarousel from "@/components/BannerCarousel";

export default function HomeBannerCarousel({ initialBanners = [] }) {
  return (
    <BannerCarousel
      initialBanners={initialBanners}
      bannerType="hero-banner"
      autoPlayMs={2500}
    />
  );
}
