
const DEFAULT_CURRENCY = "USD";

/**
 * Formatea un precio como moneda.
 * @param price - Valor numérico.
 * @param showDecimals - Si true, muestra 2 decimales.
 * @param currency - Código ISO 4217 (USD, GTQ, EUR, etc.). Si no se pasa, usa USD.
 */
export function formatPrice(
  price: number,
  showDecimals = false,
  currency?: string | null
) {
  const code = (currency && currency.trim()) || DEFAULT_CURRENCY;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code.toUpperCase(),
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(price);
}
  