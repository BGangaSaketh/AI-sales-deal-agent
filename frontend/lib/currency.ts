/**
 * Reusable Currency Conversion and Formatting Utilities
 * Handles dual-currency representation: USD ($) and INR (₹)
 */

// Configurable USD to INR conversion rate (as of user's reference: $25,000 -> ₹20,80,000)
export const USD_TO_INR_RATE = 83.2;

/**
 * Formats a USD amount using US locales (e.g. $25,000)
 */
export function formatUsd(value: number, maximumFractionDigits: number = 0): string {
  if (value === undefined || value === null || isNaN(value)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits,
  }).format(value);
}

/**
 * Converts a USD amount to INR and formats it using Indian locales (e.g. ₹20,80,000)
 */
export function formatInr(valueInUsd: number, maximumFractionDigits: number = 0): string {
  if (valueInUsd === undefined || valueInUsd === null || isNaN(valueInUsd)) return "₹0";
  const valueInInr = valueInUsd * USD_TO_INR_RATE;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits,
  }).format(valueInInr);
}

/**
 * Formats a USD value to a dual currency string: $25,000 (₹20,80,000)
 */
export function formatDualCurrency(valueInUsd: number, maximumFractionDigits: number = 0): string {
  if (valueInUsd === undefined || valueInUsd === null || isNaN(valueInUsd)) return "$0 (₹0)";
  const usdStr = formatUsd(valueInUsd, maximumFractionDigits);
  const inrStr = formatInr(valueInUsd, maximumFractionDigits);
  return `${usdStr} (${inrStr})`;
}
