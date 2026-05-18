import { cn } from "../../lib/utils";

function Badge({ className, variant = "default", children, ...props }) {
  const variants = {
    default: "bg-clay text-white",
    secondary: "bg-forest text-white",
    outline: "border border-clay text-clay",
  };
  
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Badge };