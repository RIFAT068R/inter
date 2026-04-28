import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-nl-accent text-nl-bg hover:brightness-110",
  secondary:
    "border border-white/10 bg-white/5 text-white hover:border-nl-accent/40 hover:shadow-[0_0_20px_rgba(206,241,123,0.2)]",
  ghost: "bg-transparent text-white hover:bg-white/5",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
}) {
  return (
    <button
      type={type}
      className={[
        "inline-flex h-11 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-nl-accent/30 disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
