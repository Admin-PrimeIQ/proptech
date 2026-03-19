import React from "react";
import styles from "../admin-styles.module.scss";

interface AdminSectionCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function AdminSectionCard({ children, className = "" }: AdminSectionCardProps) {
  return (
    <div className={`${styles.sectionCard} ${className}`}>
      {children}
    </div>
  );
}
