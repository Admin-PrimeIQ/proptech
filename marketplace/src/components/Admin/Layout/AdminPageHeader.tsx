import React from "react";
import styles from "../admin-styles.module.scss";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function AdminPageHeader({ title, subtitle }: AdminPageHeaderProps) {
  return (
    <div className={styles.pageHeader}>
      <h1 className={styles.pageTitle}>{title}</h1>
      {subtitle && (
        <p className={styles.pageSubtitle}>{subtitle}</p>
      )}
    </div>
  );
}
