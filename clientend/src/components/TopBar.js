import Container from "@/components/Container";
import {
  HiOutlineMapPin,
  HiOutlineTruck,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCube,
} from "react-icons/hi2";

const topBarItems = [
  {
    text: "Delivering across Bangladesh",
    icon: HiOutlineMapPin,
  },
  {
    text: "Free shipping on orders over \u09F33500",
    icon: HiOutlineTruck,
  },
  {
    text: "24/7 Pet Expert Help",
    icon: HiOutlineChatBubbleLeftRight,
  },
  {
    text: "Track Order",
    icon: HiOutlineCube,
  },
];

export default function TopBar() {
  return (
    <div className="bg-main text-white">
      <Container>
        <div className="flex min-h-11 items-center justify-center gap-4 overflow-x-auto text-sm font-medium whitespace-nowrap sm:justify-between">
          {topBarItems.map(({ text, icon: Icon }) => (
            <span key={text} className="flex items-center gap-2 opacity-95">
              <Icon className="text-base text-white/90" />
              {text}
            </span>
          ))}
        </div>
      </Container>
    </div>
  );
}
