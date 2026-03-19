
"use client";
import { Range } from "react-range";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { formatPrice } from "@/components/Utils/formatPrice";
import NiceSelect from "@/components/UI/NiceSelect";

const MONEDA_OPTIONS = [
  { value: "", label: "Todas las monedas" },
  { value: "GTQ", label: "GTQ" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

type RangeFilterProps = {
  onPriceChange?: (min: number | null, max: number | null, moneda: string | null) => void;
};

export default function RangeFilter({ onPriceChange }: RangeFilterProps) {
  const searchParams = useSearchParams();
  const monedaFromUrl = searchParams.get("moneda")?.trim() || "";
  const precioMinFromUrl = searchParams.get("precioMin");
  const precioMaxFromUrl = searchParams.get("precioMax");

  const [moneda, setMoneda] = useState<string>(monedaFromUrl);
  // Rango fijo: 0 a 1,500,000 sin importar la moneda
  const minPrice = 0;
  const maxPrice = 1500000;
  const [priceValues, setPriceValues] = useState<[number, number]>(() => {
    // Inicializar desde URL o usar valores por defecto
    if (precioMinFromUrl && precioMaxFromUrl) {
      const urlMin = parseInt(precioMinFromUrl, 10);
      const urlMax = parseInt(precioMaxFromUrl, 10);
      if (!isNaN(urlMin) && !isNaN(urlMax)) {
        const clampedMin = Math.max(minPrice, Math.min(maxPrice, urlMin));
        const clampedMax = Math.max(clampedMin, Math.min(maxPrice, urlMax));
        return [clampedMin, clampedMax];
      }
    }
    return [minPrice, maxPrice];
  });
  const isInternalChangeRef = useRef(false);

  // Inicializar valores desde URL al montar
  useEffect(() => {
    if (precioMinFromUrl && precioMaxFromUrl) {
      const urlMin = parseInt(precioMinFromUrl, 10);
      const urlMax = parseInt(precioMaxFromUrl, 10);
      if (!isNaN(urlMin) && !isNaN(urlMax)) {
        const clampedMin = Math.max(minPrice, Math.min(maxPrice, urlMin));
        const clampedMax = Math.max(clampedMin, Math.min(maxPrice, urlMax));
        setPriceValues([clampedMin, clampedMax]);
      }
    }
  }, []); // Solo al montar

  // Sincronizar moneda desde URL cuando cambia externamente (navegación, etc.)
  useEffect(() => {
    // Si el cambio fue interno, ignorar este efecto
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }
    
    const urlMoneda = searchParams.get("moneda")?.trim() || "";
    if (urlMoneda !== moneda) {
      setMoneda(urlMoneda);
      // Notificar al padre con los valores actuales y la nueva moneda
      if (onPriceChange) {
        onPriceChange(priceValues[0], priceValues[1], urlMoneda || null);
      }
    }
  }, [searchParams.toString(), moneda, priceValues, onPriceChange]); // Solo cuando cambia searchParams

  // Sincronizar valores de precio desde URL (sin cambiar moneda)
  useEffect(() => {
    const urlMin = searchParams.get("precioMin");
    const urlMax = searchParams.get("precioMax");
    const urlMoneda = searchParams.get("moneda")?.trim() || "";

    // Solo actualizar valores si la moneda coincide (para evitar conflictos)
    if (urlMoneda === moneda && urlMin && urlMax) {
      const min = parseInt(urlMin, 10);
      const max = parseInt(urlMax, 10);
      if (!isNaN(min) && !isNaN(max) && min >= minPrice && max <= maxPrice) {
        setPriceValues([min, max]);
      }
    }
  }, [searchParams, moneda]);

  const handleMonedaChange = useCallback(
    (item: { value: string; label: string }) => {
      const nuevaMoneda = item.value || "";
      isInternalChangeRef.current = true; // Marcar como cambio interno
      setMoneda(nuevaMoneda);
      // Notificar al padre con los valores actuales y la nueva moneda
      // El rango se mantiene igual (0-1500000) sin importar la moneda
      if (onPriceChange) {
        onPriceChange(priceValues[0], priceValues[1], nuevaMoneda || null);
      }
    },
    [onPriceChange, priceValues]
  );

  const handlePriceChange = useCallback(
    (values: number[]) => {
      const [min, max] = values as [number, number];
      setPriceValues([min, max]);
      if (onPriceChange) {
        onPriceChange(min, max, moneda || null);
      }
    },
    [moneda, onPriceChange]
  );

  const monedaInitialIndex = MONEDA_OPTIONS.findIndex((opt) => opt.value === moneda);
  const monedaDisplayIndex = monedaInitialIndex >= 0 ? monedaInitialIndex : 0;

  return (
    <div className="tp-property-filter-box mb-30">
      {/* Price Range */}
      <div className="tp-property-filter-item-1 mb-40">
        <h4 className="tp-property-filter-title">Price range</h4>
        
        {/* Selector de moneda */}
        <div className={`tp-team-contact-select tp-select mb-20${moneda?.trim() ? " tp-filter-active" : ""}`}>
          <NiceSelect
            key={`moneda-${monedaDisplayIndex}`}
            options={MONEDA_OPTIONS}
            defaultCurrent={monedaDisplayIndex}
            onChange={handleMonedaChange}
            name="moneda"
            cls="select wide"
          />
        </div>

        <div className="tp-property-widget-filter p-relative">
          <span className="tp-property-widget-filter-title">Rango</span>
          <span className="input-range">
            <input
              type="text"
              id="price-amount"
              value={`${formatPrice(priceValues[0], false, moneda || undefined)} - ${formatPrice(priceValues[1], false, moneda || undefined)}`}
              readOnly
            />
          </span>
          <div className="slider-container">
            <Range
              step={Math.max(1, Math.floor((maxPrice - minPrice) / 1000))}
              min={minPrice}
              max={maxPrice}
              values={priceValues}
              onChange={handlePriceChange}
              renderTrack={({ props, children }) => {
                const left = ((priceValues[0] - minPrice) / (maxPrice - minPrice)) * 100;
                const right = ((priceValues[1] - minPrice) / (maxPrice - minPrice)) * 100;
                return (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: "7px",
                      width: "100%",
                      background: `linear-gradient(to right, #ffffff ${left}%, #5758D6 ${left}%, #5758D6 ${right}%, #ffffff ${right}%)`,
                      boxShadow: "0px 0px 4px 0px rgba(192, 204, 231, 0.6)",
                      marginTop: "12px",
                    }}
                  >
                    {children}
                  </div>
                );
              }}
              renderThumb={({ props }) => (
                <div
                  {...props}
                  key={props.key}
                  style={{
                    ...props.style,
                    height: "12px",
                    width: "8px",
                    backgroundColor: "#5758D6",
                  }}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


