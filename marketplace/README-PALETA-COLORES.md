# README - Paleta De Colores Del Proyecto

Inventario actualizado de colores usados en el frontend, con base en el codigo actual.

Fecha de corte: 16 de febrero de 2026.

## 1. Alcance del analisis

Se analizaron:

- `src/**`
- `public/assets/scss/**`
- `documentation/**` (seccion separada, porque es documentacion estatica)

Se detectaron literales de color y variables CSS con este patron:

- Hex: `#RGB`, `#RRGGBB`, `#RRGGBBAA`
- Funciones: `rgb(...)`, `rgba(...)`, `hsl(...)`, `hsla(...)`
- Variables: `var(--...)`

## 2. Totales globales (app)

Directorio analizado: `src` + `public/assets/scss`

- Coincidencias totales: `2107`
- Colores/valores unicos: `400`
- Hex unicos: `204`
- `rgb/rgba/hsl/hsla` unicos: `165`
- Variables `var(--...)` unicas: `31`

## 3. Fuente oficial de tokens

Archivo fuente:

- `public/assets/scss/utils/_colors.scss`

Mapa principal:

- `common.white`: `#ffffff`
- `common.black`: `#000`
- `common.gray`: `#F0F4FD`
- `theme.primary`: `#5758D6`
- `theme.secondary`: `#F0F4FD`
- `heading.primary`: `#262B35`
- `heading.secondary`: `#1F242C`
- `text.body`: `#787878`
- `text.1`: `#01103D`
- `border.primary`: `#FEF3DF`
- `border.secondary`: `#F0F2F4`

Generacion de variables CSS:

- Archivo: `public/assets/scss/utils/_root.scss`
- Prefijos generados: `--tp-common-*`, `--tp-theme-*`, `--tp-heading-*`, `--tp-text-*`, `--tp-border-*`

## 4. Variables de color mas usadas (app)

- `var(--tp-common-white)`: 358
- `var(--tp-theme-primary)`: 291
- `var(--tp-heading-primary)`: 174
- `var(--tp-common-black)`: 95
- `var(--tp-text-body)`: 51
- `var(--tp-theme-secondary)`: 24
- `var(--tp-border-secondary)`: 7
- `var(--tp-text-1)`: 3
- `var(--tp-heading-2)`: 3
- `var(--tp-border-primary)`: 2

Nota: `var(--map-sidebar-width)` y `var(--bs-gutter-*)` aparecen en el conteo de `var(--...)`, pero no son colores semanticos de marca.

## 5. Colores hardcodeados mas frecuentes (app)

Top de literales (sin `var(...)`):

- `#5758D6`: 106
- `#E6E6E6`: 55
- `#262B35`: 50
- `#fff`: 50
- `#F0F4FD`: 39
- `#ffffff`: 25
- `#666`: 14
- `rgba(255, 255, 255, 0.95)`: 13
- `rgba(255, 255, 255, 0.92)`: 12
- `rgba(255, 255, 255, 0.4)`: 10
- `#e5e5e5`: 10
- `rgba(0,0,0,0.15)`: 10
- `#AEB2BA`: 9
- `#80858F`: 9
- `#E0E2E3`: 9
- `rgba(3, 4, 28, 0.12)`: 9
- `#D9D9D9`: 7
- `rgba(0,0,0,0.5)`: 7
- `rgba(255, 255, 255, 0.14)`: 7
- `rgba(87, 88, 214, 0.08)`: 6
- `rgba(87, 88, 214, 0.06)`: 6
- `#1C274C`: 6
- `#dc3545`: 6

## 6. Archivos con mayor concentracion de colores

Top de archivos con mas referencias de color:

- `public/assets/scss/layout/pages/_update.scss`: 341
- `public/assets/scss/layout/pages/_hero.scss`: 144
- `src/app/enterprise/mapa-dinamico/components/MapaDinamicoBody.module.scss`: 84
- `public/assets/scss/layout/header/_header.scss`: 83
- `public/assets/scss/layout/header/_header-2.scss`: 76
- `public/assets/scss/layout/pages/_listing.scss`: 65
- `public/assets/scss/layout/pages/_property.scss`: 58
- `public/assets/scss/layout/blog/_postbox.scss`: 56
- `public/assets/scss/layout/pages/_contact.scss`: 53
- `public/assets/scss/layout/pages/_team.scss`: 49
- `public/assets/scss/layout/pages/_rent.scss`: 47
- `public/assets/scss/components/_offcanvas.scss`: 44
- `src/components/Admin/admin-styles.module.scss`: 38
- `public/assets/scss/components/_rangeSlider.scss`: 38
- `public/assets/scss/layout/pages/_testimonial.scss`: 36

## 7. Colores usados en los componentes Enterprise de mapas

### `src/app/enterprise/mapa-dinamico/components/MapaDinamicoBody.module.scss`

Predominan:

- Base: `#ffffff`, `#fff`
- Primario y derivados: `var(--tp-theme-primary)`, `rgba(87, 88, 214, 0.06)`, `rgba(87, 88, 214, 0.26)`
- Neutros de UI: `#1a2437`, `#1d2940`, `#23314b`, `#607089`, `#697792`, `#8693a9`, `#8a95aa`
- Bordes/superficie: `#cdd7ea`, `#ced8ee`, `#cfd9ef`, `#d2dcf3`, `#d6e0f2`, `#d7e0f2`, `#d8e0ee`, `#f4f7ff`, `#f7f9ff`
- Sombras: `rgba(15, 24, 42, 0.15)`, `rgba(15, 24, 42, 0.22)`, `rgba(15, 24, 42, 0.5)`

### `src/app/enterprise/mapa-absorcion/components/MapaAbsorcionBody.module.scss`

Usa la misma familia cromatica del modulo dinamico:

- `var(--tp-theme-primary)`, `var(--tp-heading-primary)`
- `#ffffff`, `#fff`
- `#1a2437`, `#23314b`, `#607089`, `#697792`, `#8693a9`, `#8a95aa`
- `#cdd7ea`, `#d2dcf3`, `#d6e0f2`, `#d7e0f2`, `#d8e0ee`, `#f4f7ff`, `#f7f9fc`
- `rgba(87, 88, 214, 0.06)`, `rgba(87, 88, 214, 0.26)`

## 8. Analisis de carpeta `documentation/`

Totales en `documentation/**`:

- Coincidencias totales: `867`
- Colores/valores unicos: `219`
- Hex unicos: `154`
- `rgb/rgba/hsl/hsla` unicos: `51`
- Variables `var(--...)` unicas: `14`

Conclusiones:

- La mayor parte de esos colores viene de `documentation/assets/css/vendor/bootstrap.min.css` (727 coincidencias).
- Esos estilos no gobiernan el frontend de `src`/`public/assets/scss`; son parte de la documentacion estatica del template.

Top colores en documentacion:

- `#fff` (135), `#6c757d` (39), `#007bff` (34), `#212529` (30), `#28a745` (28), `#dc3545` (28).

## 9. Nota tecnica importante

En `public/assets/scss/utils/_colors.scss` existe:

- `$black : #0000;`

`#0000` es transparente (alpha 0), no negro opaco. El token oficial `common.black` sigue en `#000`, pero conviene corregir esa variable SCSS auxiliar para evitar confusiones futuras.

## 10. Recomendaciones para mantener consistencia

1. Priorizar `var(--tp-...)` en nuevos componentes.
2. Evitar hardcodear nuevos grises/azules si ya existe un token equivalente.
3. Para cambios de marca, editar primero `public/assets/scss/utils/_colors.scss` y luego ajustar excepciones visuales (header glass, mapas, admin).
