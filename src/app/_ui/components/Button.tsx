import { cva, type VariantProps } from "class-variance-authority";

const button = cva(
  "flex items-center justify-center rounded-xl cursor-pointer select-none disabled:bg-brand-star-dust disabled:text-white disabled:cursor-not-allowed transition-colors duration-200 ease-in-out",
  {
    variants: {
      intent: {
        primary: [
          "bg-brand-bittersweet text-white",
          "hover:bg-brand-bittersweet-dark",
          "dark:bg-blue-600 dark:hover:bg-blue-700" // Dark mode colors
        ],
        secondary: [
          "bg-brand-light-blue text-white",
          "hover:bg-brand-light-blue/90",
          "dark:bg-gray-700 dark:hover:bg-gray-600" // Dark mode colors
        ],
      },
      size: {
        small: ["text-sm", "h-[52px]", "px-2"],
        medium: ["text-base", "h-[60px]", "px-4"],
        large: ["text-lg", "h-[68px]", "px-6"],
      },
      block: {
        true: ["w-full"],
        false: ["w-auto"],
      },
      darkMode: { // New darkMode variant
        true: [], // Classes are handled within intent variants
        false: []
      }
    },
    defaultVariants: {
      intent: "primary",
      size: "medium",
      block: false,
      darkMode: false
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof button> {
  darkMode?: boolean; // Add darkMode prop
}

export const Button: React.FC<ButtonProps> = ({
  className,
  intent,
  size,
  block,
  darkMode,
  ...props
}) => (
  <button
    className={button({
      intent,
      size,
      block,
      darkMode,
      className
    })}
    {...props}
  />
);