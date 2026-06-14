import { PiPawPrintFill } from "react-icons/pi";

export default function BrandLogo({ size = "md", showText = true, className = "" }) {
  const sizes = {
    sm: {
      iconWrap: "h-11 w-11 rounded-2xl",
      icon: "h-8 w-8",
      text: "text-lg",
    },
    md: {
      iconWrap: "h-12 w-12 rounded-2xl",
      icon: "h-9 w-9",
      text: "text-[1.65rem]",
    },
    lg: {
      iconWrap: "h-12 w-12 rounded-2xl",
      icon: "h-9 w-9",
      text: "text-[2rem]",
    },
  };

  const config = sizes[size] || sizes.md;

  return (
    <div className={`flex items-center gap-3 text-main ${className}`}>
      <span
        className={`flex shrink-0 items-center justify-center bg-accentSoft ${config.iconWrap}`}
      >
        <PiPawPrintFill className={`${config.icon} text-main`} aria-hidden="true" />
      </span>
      {showText ? (
        <div className="leading-none">
          <span className={`font-black tracking-[-0.04em] text-main ${config.text}`}>
            Paw
          </span>
          <span className={`font-black tracking-[-0.04em] text-accent ${config.text}`}>
            Tail
          </span>
        </div>
      ) : null}
    </div>
  );
}
