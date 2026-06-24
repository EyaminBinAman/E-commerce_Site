import CategoryDealsBanner from "@/components/CategoryDealsBanner";
import CustomerReviews from "@/components/CustomerReviews";
import HomeBannerCarousel from "@/components/HomeBannerCarousel";
import PopularBrands from "@/components/PopularBrands";
import ShopByPetType from "@/components/ShopByPetType";
import SliderBannerCarousel from "@/components/SliderBannerCarousel";
import WhyChooseUs from "@/components/WhyChooseUs";
import { fetchBanners, fetchHeroBanners, fetchSliderBanners } from "@/lib/bannerApi";

export default async function Home() {
  const [heroBanners, promoBanners, sliderBanners] = await Promise.all([
    fetchHeroBanners(),
    fetchBanners("promo-banner"),
    fetchSliderBanners(),
  ]);

  return (
    <main className="bg-white">
      <HomeBannerCarousel initialBanners={heroBanners} />
      <ShopByPetType />
      <PopularBrands />
      <CategoryDealsBanner initialPromoBanners={promoBanners} />
      <WhyChooseUs />
      <SliderBannerCarousel initialBanners={sliderBanners} />
      <CustomerReviews />
    </main>
  );
}
