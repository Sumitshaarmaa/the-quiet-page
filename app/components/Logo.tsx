import Link from "next/link";

type LogoProps = {
  className?: string;
};

export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link
      href="/"
      className={`group flex items-center ${className}`}
      aria-label="The Quiet Page"
    >
      <img
        src="/main_logo.png"
        alt="The Quiet Page"
        className="h-[68px] w-auto object-contain transition-opacity duration-300 group-hover:opacity-75"
      />
    </Link>
  );
}