import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/app/lib/utils";


const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 ",
        destructive:
          "bg-destructive text-white py-[7px] px-[30px] rounded-lg font-medium text-base min-w-[100px] hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-[#E4E4E4] hover:bg-[#D4D4D4] text-black px-10 h-11 rounded-lg font-medium text-base min-w-[100px]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        cancel:
          " border-gray-300 text-gray-700 hover:bg-gray-50 px-5 h-11 rounded-lg font-medium text-base min-w-[100px] border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 cursor-pointer",

        create:
          "bg-primary hover:bg-primary/50 text-white px-10 h-11 rounded-lg font-medium text-base min-w-[100px] cursor-pointer",
        navbarCta:
          "w-full h-11 px-5 text-sm " +
          "sm:w-auto sm:h-12 sm:px-7 sm:text-base " +
          "md:h-[52px] md:px-8 md:text-lg " +
          "lg:h-14 lg:px-9 lg:text-xl " +
          "xl:w-[275px] xl:h-[60px] xl:pt-[15px] xl:pr-[42px] xl:pb-4 xl:pl-[42px] xl:text-[22px] " +
          "gap-[10px] rounded-[20px] bg-[#67003E] text-white font-poppins font-medium uppercase text-center leading-[120%] tracking-[0px] hover:opacity-90 cursor-pointer",
        heroCta:     "w-full h-11 px-5 text-sm " +
          "sm:w-auto sm:h-12 sm:px-7 sm:text-base " +
          "md:h-[52px] md:px-8 md:text-lg " +
          "lg:h-14 lg:px-9 lg:text-xl " +
          "xl:w-[275px] xl:h-[60px] xl:pt-[15px] xl:pr-[42px] xl:pb-4 xl:pl-[42px] xl:text-[22px] " +
          "gap-[10px] rounded-[20px] bg-transparent border-2 border-white text-white font-poppins font-medium uppercase text-center leading-[120%] tracking-[0px] hover:opacity-90 cursor-pointer",
        deletecancel:
          "w-[138px] h-[42px]  py-8 opacity-100 rounded-[5px] p-[10px] gap-[8px] border border-[#3D3E46] text-base bg-white",
        delete:
          "w-[138px] h-[42px] opacity-100 rounded-[5px] p-[10px] gap-[8px] border bg-red-600 text-white text-base",
        deleteicon:
          "h-4 p-1 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 cursor-pointer flex-shrink-0 text-red-600 hover:bg-red-100 hover:text-red-600 transition-colors",
        editicon:
          "h-4 p-1 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 cursor-pointer flex-shrink-0 hover:bg-primary-100 transition-colors text-primary",
        viewicon:
          "h-4 p-1 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 cursor-pointer hover:bg-gray-200",
      },
      size: {
        default: " px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  type = "button",
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      type={type}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
