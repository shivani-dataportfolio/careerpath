import React from 'react';
import { cn } from './Button';

const Card = ({ className, children, ...props }) => {
    return (
        <div className={cn('premium-card p-6', className)} {...props}>
            {children}
        </div>
    );
};

const CardHeader = ({ className, children, ...props }) => (
    <div className={cn('mb-4', className)} {...props}>
        {children}
    </div>
);

const CardTitle = ({ className, children, ...props }) => (
    <h3 className={cn('text-lg font-semibold text-slate-800', className)} {...props}>
        {children}
    </h3>
);

const CardContent = ({ className, children, ...props }) => (
    <div className={cn('', className)} {...props}>
        {children}
    </div>
);

export { Card, CardHeader, CardTitle, CardContent };
