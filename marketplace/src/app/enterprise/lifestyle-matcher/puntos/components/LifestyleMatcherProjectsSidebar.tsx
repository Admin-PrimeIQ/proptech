"use client";

import styles from "./LifestyleMatcherPointsBody.module.scss";
import type { MarkerCardItem } from "./lifestyleMatcherPoints.types";

type LifestyleMatcherProjectsSidebarProps = {
  loadingProperties: boolean;
  propertiesError: string | null;
  totalCards: number;
  paginatedMarkerCards: MarkerCardItem[];
  totalSidebarPages: number;
  sidebarPage: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  showPagination: boolean;
};

export default function LifestyleMatcherProjectsSidebar(props: LifestyleMatcherProjectsSidebarProps) {
  const {
    loadingProperties,
    propertiesError,
    totalCards,
    paginatedMarkerCards,
    totalSidebarPages,
    sidebarPage,
    onPrevPage,
    onNextPage,
    showPagination,
  } = props;

  return (
    <aside className={styles.projectsSidebar} aria-label="Proyectos dentro de isocrona">
      <header className={styles.projectsSidebarHeader}>
        <h4>Proyectos</h4>
        <span>{loadingProperties ? "Actualizando..." : `${totalCards} resultados`}</span>
      </header>

      {propertiesError ? <p className={styles.projectsSidebarMessage}>{propertiesError}</p> : null}
      {loadingProperties ? <p className={styles.projectsSidebarMessage}>Cargando propiedades...</p> : null}

      {!loadingProperties && totalCards === 0 ? (
        <article className={styles.emptyStateCard}>
          <p>No hay proyectos para la cobertura actual.</p>
        </article>
      ) : (
        <div className={styles.projectsCardsGrid}>
          {paginatedMarkerCards.map((card) => (
            <article key={card.key} className={styles.propertyCard} aria-label={`Proyecto ${card.nombreProyecto}`}>
              <div className={styles.cardThumb}>
                {card.imagen ? <img src={card.imagen} alt={card.nombreProyecto} loading="lazy" /> : null}
                {card.uso ? <span>{card.uso}</span> : null}
              </div>

              <div className={styles.cardBody}>
                <h4 className={styles.cardProjectName}>{card.nombreProyecto}</h4>
                <div className={styles.cardLocationRow}>
                  <p className={styles.cardLocationText}>{`${card.departamento}, ${card.municipio}`}</p>
                  {card.desarrollador !== "N/D" ? <span className={styles.cardFigure}>{card.desarrollador}</span> : null}
                </div>

                <ul>
                  <li>{`Total m2 ${card.totalM2}`}</li>
                  <li>{`parqueos ${card.parqueos}`}</li>
                  <li>{card.categoria}</li>
                  <li>{card.estado}</li>
                </ul>

                <div className={styles.cardFooter}>
                  <strong>{`Precio prom ${card.precioPromedioM2}`}</strong>
                  <small>/m2</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {showPagination ? (
        <div className={styles.sidebarPagination}>
          <div className={styles.sidebarPaginationControls}>
            <button type="button" onClick={onPrevPage} disabled={sidebarPage <= 1}>
              Anterior
            </button>
            <button type="button" onClick={onNextPage} disabled={sidebarPage >= totalSidebarPages}>
              Siguiente
            </button>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
