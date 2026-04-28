import type { TextareaHTMLAttributes } from "react";

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={[
        "w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-nl-text placeholder:text-nl-textMuted outline-none transition-all duration-300",
        "focus:border-nl-accent/40 focus:shadow-[0_0_0_2px_rgba(206,241,123,0.2)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
