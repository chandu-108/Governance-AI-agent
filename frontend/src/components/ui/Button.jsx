import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const VARIANT_MAP = {
  default:     'btn-primary',
  primary:     'btn-primary',
  secondary:   'btn-secondary',
  outline:     'btn-secondary',
  ghost:       'btn-ghost',
  destructive: 'btn-danger',
  danger:      'btn-danger',
};

const SIZE_MAP = {
  default: '',
  sm: '!h-8 !px-3 !text-[12px]',
  lg: '!h-10 !px-5 !text-[14px]',
  icon: '!h-8 !w-8 !p-0',
};

const Button = forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  isLoading,
  children,
  disabled,
  ...props
}, ref) => {
  const variantClass = VARIANT_MAP[variant] ?? 'btn-secondary';
  const sizeClass = SIZE_MAP[size] ?? '';

  return (
    <button
      ref={ref}
      disabled={isLoading || disabled}
      className={cn(variantClass, sizeClass, className)}
      {...props}
    >
      {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin flex-shrink-0" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
