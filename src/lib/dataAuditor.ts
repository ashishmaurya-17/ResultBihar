export interface AuditReport {
  isValid: boolean;
  refinedValue: string;
  remediation?: string; // Psychological tip if value is missing/incorrect
}

/**
 * PSYCHOLOGICAL DATA AUDITOR
 * Analyzes and refines data to improve clarity and user confidence.
 * Rather than 'errors', it provides 'refinement' and 'engagement' prompts.
 */
export const auditCardData = (label: string, value: any): AuditReport => {
  const strVal = String(value || "").trim();

  // 1. Normalize Boolean/Logic values (e.g., 'no' -> '0')
  if (["no", "none", "n/a", "not applicable"].includes(strVal.toLowerCase())) {
    return { isValid: true, refinedValue: "0" };
  }

  // 2. Normalize Currency
  if (label.toLowerCase().includes("fee") && strVal !== "0") {
    const cleaned = strVal.replace(/[^0-9]/g, "");
    if (cleaned) return { isValid: true, refinedValue: `₹${cleaned}` };
  }

  // 3. Flagging Missing Critical Data (Psychological prompt for missing value)
  if (!strVal || strVal === "undefined" || strVal === "null") {
    return {
      isValid: false,
      refinedValue: "PENDING",
      remediation: `The ${label} is currently being verified. Please stay tuned for updates.`
    };
  }

  return { isValid: true, refinedValue: strVal };
};
