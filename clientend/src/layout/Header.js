import MiddleBar from "@/components/MiddleBar";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";
import { getBrandNavbarView } from "@/lib/brandApi";
import { getCategoryAnimalsView } from "@/lib/categoryApi";

export default async function Header() {
  const [animals, brands] = await Promise.all([
    getCategoryAnimalsView(),
    getBrandNavbarView(),
  ]);

  return (
    <>
      <TopBar />
      <div className="sticky top-0 z-50">
        <MiddleBar />
        <Navbar animals={animals} brands={brands} />
      </div>
    </>
  );
}
