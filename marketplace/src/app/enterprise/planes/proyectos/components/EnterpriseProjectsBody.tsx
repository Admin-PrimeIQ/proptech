"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./EnterpriseProjectsBody.module.scss";
import { getEnterpriseProjectsData } from "../services/enterpriseProjects.service";
import { EnterpriseProjectsData, ProjectFileItem } from "../types";
import EnterpriseMobileBottomNav from "@/components/Enterprise/EnterpriseMobileBottomNav";

const FILE_ICON_BY_TYPE: Record<ProjectFileItem["type"], string> = {
  pdf: "▣",
  xlsx: "▦",
  zip: "▤",
  dwg: "△",
  doc: "▥",
};

export default function EnterpriseProjectsBody() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EnterpriseProjectsData | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        const response = await getEnterpriseProjectsData();
        if (cancelled) return;
        setData(response);
      } catch {
        if (cancelled) return;
        setError("No se pudo cargar la información de proyectos.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <section className={styles.pageWrap}>
        <div className="container">
          <p className={styles.feedbackText}>Cargando proyectos...</p>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className={styles.pageWrap}>
        <div className="container">
          <p className={styles.feedbackText}>{error ?? "No se encontró información de proyectos."}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.pageWrap} aria-label="Listado de proyectos enterprise">
      <div className={styles.fullViewport}>
        <div className={styles.shell}>
          <div className={styles.headerRow}>
            <h1>{data.title}</h1>
            <Link href="/enterprise/planes" className={styles.backBtn}>
              Regresar
            </Link>
          </div>
          <p>{data.description}</p>

          <div className={styles.topTabs}>
            <button type="button" className={styles.activeTab}>
              All Files
            </button>
          </div>

          <div className={styles.sectionHead}>PROJECT FOLDERS</div>
          <div className={styles.folderGrid}>
            {data.folders.map((folder) => (
              <article
                key={folder.id}
                className={`${styles.folderCard} ${folder.active ? styles.folderCardActive : ""}`}
              >
                <span className={styles.folderIcon}>▣</span>
                <div>
                  <h4>{folder.name}</h4>
                  <small>{folder.stats}</small>
                </div>
              </article>
            ))}
          </div>

          <div className={styles.sectionHead}>FILES & DOCUMENTS</div>
          <div className={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>NAME</th>
                  <th>LAST MODIFIED</th>
                </tr>
              </thead>
              <tbody>
                {data.files.map((file) => (
                  <tr key={file.id}>
                    <td>
                      <span className={styles.fileNameCell}>
                        <i>{FILE_ICON_BY_TYPE[file.type]}</i>
                        {file.name}
                      </span>
                    </td>
                    <td>{file.lastModified}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.mobileBottomSpacer}></div>
        </div>
      </div>

      <EnterpriseMobileBottomNav activeTab="perfil" />
    </section>
  );
}
