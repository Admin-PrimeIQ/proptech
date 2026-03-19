import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({
  label,
  error,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="tp-dashboard-new-input">
      {label && <label>{label}</label>}
      <textarea
        className={`flex-grow-1 ${className}`}
        {...props}
      />
      {error && <span className="text-danger" style={{ fontSize: "12px" }}>{error}</span>}
    </div>
  );
}
