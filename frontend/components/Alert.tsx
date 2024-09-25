import React from 'react';

interface AlertProps {
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
}

const Alert: React.FC<AlertProps> = ({ title, children, variant = 'default' }) => {
  const baseClasses = "border-l-4 p-4 mb-4";
  const variantClasses = {
    default: "bg-blue-100 border-blue-500 text-blue-700",
    destructive: "bg-red-100 border-red-500 text-red-700"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`} role="alert">
      {title && <h3 className="font-bold mb-2">{title}</h3>}
      <p>{children}</p>
    </div>
  );
};

export default Alert;
