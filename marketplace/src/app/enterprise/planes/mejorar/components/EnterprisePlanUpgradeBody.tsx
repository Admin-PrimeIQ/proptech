"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./EnterprisePlanUpgradeBody.module.scss";
import { getEnterprisePlanUpgradeData } from "../services/enterprisePlanUpgrade.service";
import { EnterprisePlanUpgradeData } from "../types";
import EnterpriseMobileBottomNav from "@/components/Enterprise/EnterpriseMobileBottomNav";

function FeatureIcon({ included }: { included: boolean }) {
  if (!included) {
    return <span className={`${styles.featureIcon} ${styles.locked}`}>◌</span>;
  }
  return <span className={`${styles.featureIcon} ${styles.included}`}>✓</span>;
}

export default function EnterprisePlanUpgradeBody() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EnterprisePlanUpgradeData | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setLoading(true);
        const response = await getEnterprisePlanUpgradeData();
        if (cancelled) return;
        setData(response);
      } catch {
        if (cancelled) return;
        setError("No se pudo cargar la información de planes.");
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
          <p className={styles.feedbackText}>Cargando detalles del plan...</p>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className={styles.pageWrap}>
        <div className="container">
          <p className={styles.feedbackText}>{error ?? "No se encontró información del plan."}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.pageWrap} aria-label="Comparación de planes enterprise">
      <div className="container">
        <h1 className={styles.pageTitle}>{data.pageTitle}</h1>
        <p className={styles.pageDescription}>{data.pageDescription}</p>

        <article className={styles.currentPlanCard}>
          <div className={styles.planImageArea} aria-hidden>
            <div className={styles.planImagePlaceholder}></div>
          </div>

          <div className={styles.planInfoArea}>
            <span className={styles.activeBadge}>{data.activePlanLabel}</span>
            <h2>{data.activePlanName}</h2>
            <p>{data.activePlanDescription}</p>

            <div className={styles.featuresGrid}>
              {data.activePlanFeatures.map((feature) => (
                <div key={feature.label} className={styles.featureItem}>
                  <FeatureIcon included={feature.included} />
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>

            <div className={styles.currentPlanFooter}>
              <small>Próxima facturación: {data.nextBillingDate}</small>
              <button type="button">Mejorar Plan</button>
            </div>
          </div>
        </article>

        <h3 className={styles.compareTitle}>Compara y Mejora</h3>

        <div className={styles.planGrid}>
          {data.planOptions.map((plan) => (
            <article
              key={plan.id}
              className={`${styles.planCard} ${plan.highlighted ? styles.planCardHighlighted : ""}`}
            >
              {plan.highlighted ? <span className={styles.recommendedTag}>RECOMENDADO</span> : null}
              <h4>{plan.name}</h4>
              <p className={styles.priceLine}>
                <strong>{plan.price}</strong> <span>{plan.priceUnit}</span>
              </p>
              <p className={styles.planDescription}>{plan.description}</p>

              <button
                type="button"
                className={`${styles.planActionBtn} ${plan.current ? styles.planActionCurrent : ""} ${
                  plan.id === "enterprise" ? styles.planActionDark : ""
                }`}
              >
                {plan.ctaLabel}
              </button>

              <ul>
                {plan.features.map((item) => (
                  <li key={item}>
                    <span>◌</span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <article className={styles.customCard}>
          <div>
            <h4>{data.customSolutionTitle}</h4>
            <p>{data.customSolutionDescription}</p>
          </div>
          <Link href="/enterprise/dashboard">Hablar con un asesor</Link>
        </article>
      </div>

      <EnterpriseMobileBottomNav activeTab="planes" />
    </section>
  );
}
