import React from "react";
import styles from "../admin-styles.module.scss";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  children?: React.ReactNode;
}

export default function IconButton({
  icon,
  children,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      className={`${styles.editButton} d-flex align-items-center gap-2 ${className}`}
      {...props}
    >
      <span>{icon}</span>
      {children}
    </button>
  );
}
