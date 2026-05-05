import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
        primary: 'btn-primary',
        outline: 'btn-outline',
        ghost: 'text-slate-600 hover:bg-slate-100',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-100',
    };

    const sizes = {
        sm: 'px-4 py-1.5 text-sm',
        md: 'px-6 py-2.5',
        lg: 'px-8 py-3 text-lg',
        xl: 'px-10 py-5 text-xl font-black uppercase tracking-widest',
    };

    return (
        <button
            ref={ref}
            className={cn('btn', variants[variant], sizes[size], className)}
            {...props}
        />
    );
});

Button.displayName = 'Button';

export { Button };
