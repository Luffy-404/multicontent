type TeamMarkProps = {
  name: string;
  logoUrl?: string | null;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-14 w-14 text-base",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
}

export function TeamMark({ name, logoUrl, size = "md" }: TeamMarkProps) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt=""
        className={`${sizes[size]} rounded-full border border-white/[0.08] bg-[#050608] object-cover`}
      />
    );
  }

  return (
    <span className={`${sizes[size]} grid shrink-0 place-items-center rounded-full border border-white/[0.08] bg-[#050608] font-tight font-bold text-[#F8FAFC]`}>
      {initials(name)}
    </span>
  );
}
