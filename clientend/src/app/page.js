import CategoryDealsBanner from "@/components/CategoryDealsBanner";
import CustomerReviews from "@/components/CustomerReviews";
import HomeBannerCarousel from "@/components/HomeBannerCarousel";
import PopularBrands from "@/components/PopularBrands";
import ShopByPetType from "@/components/ShopByPetType";
import WhyChooseUs from "@/components/WhyChooseUs";
import { fetchBanners } from "@/lib/bannerApi";

export default async function Home() {
  const [heroBanners, promoBanners] = await Promise.all([
    fetchBanners("hero-banner"),
    fetchBanners("promo-banner"),
  ]);

  return (
    <main className="bg-white">
      <HomeBannerCarousel initialBanners={heroBanners} />
      <ShopByPetType />
      <PopularBrands />
      <CategoryDealsBanner initialPromoBanners={promoBanners} />
      <WhyChooseUs />
      <CustomerReviews />
    </main>
  );
}
