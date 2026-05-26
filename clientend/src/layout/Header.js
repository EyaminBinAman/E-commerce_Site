import MiddleBar from "@/components/MiddleBar";
import Navbar from "@/components/Navbar";
import TopBar from "@/components/TopBar";

export default function Header() {
  return (
    <>
      <TopBar />
      <div className="sticky top-0 z-50">
        <MiddleBar />
        <Navbar />
      </div>
    </>
  );
}
