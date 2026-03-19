import React from "react";
import styles from "../admin-styles.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className={styles.fieldContainer}>
      {label && <label className={styles.fieldLabel}>{label}</label>}
      <input
        className={`${styles.fieldInput} ${className}`}
        {...props}
      />
      {error && <span className="text-danger" style={{ fontSize: "12px", marginTop: "4px", display: "block" }}>{error}</span>}
    </div>
  );
}
