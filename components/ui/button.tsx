import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn, Playlist } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        border: 'bg-white border border-input border-blue-50 hover:bg-accent hover:text-accent-foreground',
        blackBorder: 'bg-white border border-black hover:bg-gray-100 hover:bg-accent hover:text-accent-foreground',
        whiteBorder: 'bg-black border border-white hover:bg-gray-100 hover:bg-accent-foreground hover:text-accent',
        rectangle: 'flex-grow border border-gray-600 text-gray-50 rounded-none px-4 py-2 hover:border-white',
        selectedRectangle: 'flex-grow border border-white-600 text-gray-50 rounded-none px-4 py-2 border border-gray-300',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'flex-grow w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild, fullWidth = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';


    return (
      <div className={fullWidth ? "flex w-full max-w-lg" : "flex text-left"}>
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {props.children}
          
        </Comp>

        
      </div>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
