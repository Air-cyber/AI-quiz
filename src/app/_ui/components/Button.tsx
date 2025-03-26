import { cva, type VariantProps } from "class-variance-authority";
import { ReactNode } from "react";

const button = cva(
  "flex items-center justify-center rounded-xl cursor-pointer select-none disabled:bg-brand-star-dust disabled:text-white disabled:cursor-not-allowed transition-colors duration-200 ease-in-out",
  {
    variants: {
      intent: {
        primary: [
          "bg-brand-bittersweet text-white",
          "hover:bg-brand-bittersweet-dark",
          "dark:bg-blue-600 dark:hover:bg-blue-700"
        ],
        secondary: [
          "bg-brand-light-blue text-white",
          "hover:bg-brand-light-blue/90",
          "dark:bg-gray-700 dark:hover:bg-gray-600"
        ],
      },
      size: {
        small: ["text-sm", "h-[52px]", "px-2", "gap-1"],
        medium: ["text-base", "h-[60px]", "px-4", "gap-2"],
        large: ["text-lg", "h-[68px]", "px-6", "gap-3"],
      },
      block: {
        true: ["w-full"],
        false: ["w-auto"],
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "medium",
      block: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof button> {
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

export const Button: React.FC<ButtonProps> = ({
  className,
  intent,
  size,
  block,
  icon,
  iconPosition = "left",
  children,
  ...props
}) => (
  <button
    className={button({
      intent,
      size,
      block,
      className
    })}
    {...props}
  >
    {icon && iconPosition === "left" && (
      <span className="inline-flex">{icon}</span>
    )}
    {children}
    {icon && iconPosition === "right" && (
      <span className="inline-flex">{icon}</span>
    )}
  </button>
);