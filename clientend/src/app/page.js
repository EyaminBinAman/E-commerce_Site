import CategoryDealsBanner from "@/components/CategoryDealsBanner";
import CustomerReviews from "@/components/CustomerReviews";
import HomeBannerCarousel from "@/components/HomeBannerCarousel";
import PopularBrands from "@/components/PopularBrands";
import ShopByPetType from "@/components/ShopByPetType";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function Home() {
  return (
    <main className="bg-white">
      <HomeBannerCarousel />
      <ShopByPetType />
      <PopularBrands />
      <CategoryDealsBanner />
      <WhyChooseUs />
      <CustomerReviews />
    </main>
  );
}
