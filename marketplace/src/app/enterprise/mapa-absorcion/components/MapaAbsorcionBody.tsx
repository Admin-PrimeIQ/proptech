"use client";

import styles from "./MapaAbsorcionBody.module.scss";
import MapContainer from "@/components/Map/MapContainer";

export default function MapaAbsorcionBody() {
  return (
    <section className={styles.pageArea} aria-label="Mapa de absorcion enterprise">
      <div className={styles.pageContainer}>
        <header className={styles.titleRow}>
          <h2>Mapa de absorcion</h2>
        </header>

        <div className={styles.layoutGrid}>
          <article className={styles.mapPanel}>
            <MapContainer className={styles.mapCanvas} />
          </article>

          <aside className={styles.sidePanel}>
            <div className={styles.searchBar}>
              <i className="fa-regular fa-magnifying-glass" />
              <input type="text" placeholder="Escribe zona o departamento" />
            </div>

            <div className={styles.filterPanel}>
              <div className={styles.filterHead}>
                <h4>Filtros</h4>
                <button type="button" aria-label="Cerrar filtros">
                  <i className="fa-regular fa-xmark" />
                </button>
              </div>

              <div className={styles.filterGroup}>
                <h5>Subzonas</h5>
                <label><input type="checkbox" defaultChecked /> Todas</label>
                <label><input type="checkbox" /> rural</label>
                <label><input type="checkbox" /> Urbana</label>
                <label><input type="checkbox" /> Condos</label>
                <label><input type="checkbox" /> Single-Family Homes</label>
              </div>

              <div className={styles.filterGroup}>
                <h5>Seleccione un año</h5>
                <select defaultValue="">
                  <option value="" disabled>
                    Año de absorcion
                  </option>
                  <option>2021</option>
                  <option>2022</option>
                  <option>2023</option>
                  <option>2024</option>
                  <option>2025</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <h5>Propiedades</h5>
                <label><input type="checkbox" defaultChecked /> Todas</label>
                <label><input type="checkbox" /> Casas</label>
                <label><input type="checkbox" /> Departamentos</label>
                <label><input type="checkbox" /> Terrenos</label>
                <label><input type="checkbox" /> Oficina</label>
              </div>

              <button type="button" className={styles.filterAction}>
                Obtener Dashboard
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
