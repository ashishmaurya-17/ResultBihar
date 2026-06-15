import React from "react";
import { auditCardData } from "../lib/dataAuditor";

interface SarkariDataTableProps {
  title?: string;
  headers?: string[];
  rows: Array<Array<React.ReactNode | string>>;
  colWidths?: string[];
  className?: string;
  isLoading?: boolean;
}

function highlightCellContent(val: React.ReactNode): React.ReactNode {
  if (!val || typeof val !== "string") {
    return val;
  }

  const trimmed = val.trim();

  if (trimmed.toLowerCase() === "no") {
    return "0";
  }

  // 1. Exact Single Date Pattern (e.g. 10/12/2026, 10-12-2026) or key date terms
  if (/^\d{1,2}[-/\.]\d{1,2}[-/\.]\d{2,4}$/.test(trimmed)) {
    return (
      <span className="bg-rose-50 dark:bg-rose-950/40 border border-rose-250 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 px-2.5 py-0.5 rounded font-mono font-black text-[11px] sm:text-xs select-all shadow-3xs tracking-tight inline-block">
        {trimmed}
      </span>
    );
  }

  // 2. Rupee/Fees Pattern (e.g. ₹500, ₹0, Rs. 100, Free, Nil)
  if (
    trimmed.startsWith("₹") || 
    trimmed.startsWith("Rs") || 
    /^\d+\s*\/-$/.test(trimmed) || 
    trimmed.toLowerCase() === "no fee" || 
    trimmed.toLowerCase() === "exempted" || 
    trimmed.toLowerCase() === "nil"
  ) {
    return (
      <span className="bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-900/80 text-emerald-950 dark:text-emerald-100 px-2.5 py-0.5 rounded font-mono font-black text-[11px] sm:text-xs shadow-3xs tracking-tight inline-block">
        {trimmed}
      </span>
    );
  }

  // 3. Compact Metrics (e.g. "18 Years", "37 Years", "125 Posts", "84 Seats")
  if (/^\d+\s*(?:Years|Posts|Seats|Ages|Months|Days|Post|Seat|Marks|Percent|%)/i.test(trimmed)) {
    return (
      <span className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-250 dark:border-indigo-900/60 text-indigo-900 dark:text-indigo-200 px-2.5 py-0.5 rounded font-mono font-black text-[11px] sm:text-xs shadow-3xs tracking-tight inline-block">
        {trimmed}
      </span>
    );
  }

  // 4. Embedded Numbers / Dates / Rupee markers in sentences
  const searchRegex = /(\b\d{1,2}[-/\.]\d{1,2}[-/\.]\d{2,4}\b|(?:₹|Rs\.?)\s*\d+[-/\w]*)/gi;
  if (searchRegex.test(trimmed)) {
    const parts = trimmed.split(searchRegex);
    return (
      <span className="leading-relaxed">
        {parts.map((p, idx) => {
          if (searchRegex.test(p) && /\d/.test(p)) {
            let bgClass = "bg-amber-100 dark:bg-amber-950/70 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-900";
            if (p.includes("/") || p.includes("-")) {
              bgClass = "bg-rose-50 dark:bg-rose-950/45 text-rose-900 dark:text-rose-200 border border-rose-250 dark:border-rose-900/60";
            } else if (p.includes("₹") || p.toLowerCase().includes("rs")) {
              bgClass = "bg-emerald-50 dark:bg-emerald-950/45 text-emerald-900 dark:text-emerald-200 border border-emerald-250 dark:border-emerald-900/60";
            }
            return (
              <span key={idx} className={`${bgClass} px-1.5 py-0.5 rounded font-mono font-black text-[10.5px] mx-0.5 shadow-4xs inline-block`}>
                {p}
              </span>
            );
          }
          return p;
        })}
      </span>
    );
  }

  return val;
}

function isEmptyOrNA(val: React.ReactNode): boolean {
  if (!val) return true;
  if (typeof val === "string") {
    const trimmed = val.trim().toUpperCase();
    return trimmed === "" || trimmed === "N/A" || trimmed === "NOT APPLICABLE" || trimmed === "NILL" || trimmed === "NIL";
  }
  return false;
}

export const SarkariDataTable: React.FC<SarkariDataTableProps> = ({
  title,
  headers,
  rows,
  colWidths,
  className = "",
  isLoading = false,
}) => {
  return (
    <div className={`w-full border-2 border-gray-950 dark:border-zinc-700 my-3 bg-white dark:bg-zinc-900 transition-colors duration-300 ${className}`} role="table" aria-label={title || "Data table"}>
      {title && (
        <div id="table-title" className="bg-red-800 dark:bg-red-900 text-white font-mono text-xs uppercase font-extrabold tracking-tight px-3 py-1.5 text-center border-b-2 border-gray-950 dark:border-zinc-700">
          {title}
        </div>
      )}

      {/* Desktop View: Standard structured table (only on sm device and up) */}
      <table className="hidden sm:table w-full text-left border-collapse font-sans text-[12.5px] sm:text-[13px] md:text-[13.5px] text-gray-900 dark:text-zinc-200" aria-labelledby={title ? "table-title" : undefined}>
        {headers && headers.length > 0 && (
          <thead className="table-header-group">
            <tr className="bg-neutral-100 dark:bg-zinc-805 border-b-2 border-gray-950 dark:border-zinc-700">
              {headers.map((hdr, i) => (
                <th
                  key={i}
                  style={colWidths && colWidths[i] ? { width: colWidths[i] } : undefined}
                  className="px-3 md:px-4 py-2 sm:py-2.5 font-mono font-black text-gray-900 dark:text-zinc-100 border-r border-gray-900 dark:border-zinc-700 last:border-r-0 uppercase text-[10.5px] sm:text-[11.5px] md:text-xs tracking-tight"
                >
                  {hdr}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="table-row-group">
          {isLoading ? (
            [1, 2, 3].map((idx) => (
              <tr 
                key={idx} 
                className="table-row border-b border-gray-900 dark:border-zinc-700 last:border-b-0 animate-pulse bg-neutral-100/40 dark:bg-zinc-800/10"
              >
                {(headers && headers.length > 0 ? headers : ["Col 1", "Col 2"]).map((_, cellIdx) => (
                  <td key={cellIdx} className="px-3 md:px-4 py-3 border-r border-gray-900 dark:border-zinc-700 last:border-r-0 align-middle">
                    <div className="h-4 bg-neutral-200 dark:bg-zinc-700 rounded-none w-3/4 max-w-[240px]" />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr className="table-row">
              <td
                colSpan={headers ? headers.length : 1}
                className="px-3 py-4 text-center text-gray-500 font-mono text-[11px] uppercase table-cell"
              >
                NO DATA / NOT APPLICABLE
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`table-row border-b border-gray-900 dark:border-zinc-700 last:border-b-0 py-2 sm:py-0 transition-colors duration-300 ${
                  rowIndex % 2 === 0 ? "bg-white dark:bg-zinc-900/40" : "bg-neutral-50 dark:bg-zinc-800/20"
                }`}
              >
                    {row.map((cell, cellIndex) => {
                      const label = headers && headers[cellIndex] ? headers[cellIndex] : `Field ${cellIndex + 1}`;
                      const audited = auditCardData(label, cell);
                      return (
                        <td
                          key={cellIndex}
                          className="px-3 md:px-4 py-2 sm:py-2.5 table-cell border-r border-gray-900 dark:border-zinc-700 last:border-r-0 align-top leading-relaxed text-gray-950 dark:text-zinc-300"
                        >
                          <div className="break-words max-w-full text-[12px] sm:text-[13px] md:text-[13.5px] font-semibold text-neutral-800 dark:text-neutral-200">
                            {highlightCellContent(audited.refinedValue)}
                          </div>
                          {!audited.isValid && audited.remediation && (
                            <div className="text-[10px] text-amber-700 bg-amber-50 p-1 rounded mt-1 italic leading-tight">
                              {audited.remediation}
                            </div>
                          )}
                        </td>
                      );
                    })}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Mobile View: High-fidelity, zero-overflow elegant card-based design with absolute clarity */}
      <div className="sm:hidden block p-3.5 space-y-3.5 bg-neutral-50/50 dark:bg-zinc-950/20">
        {isLoading ? (
          [1, 2, 3].map((idx) => (
            <div key={idx} className="py-4 border-b border-neutral-300 last:border-b-0 animate-pulse space-y-2">
              <div className="h-3 bg-neutral-200 dark:bg-zinc-800 w-1/4" />
              <div className="h-4 bg-neutral-300 dark:bg-zinc-700 w-5/6" />
              <div className="h-3 bg-neutral-250 dark:bg-zinc-800 w-1/2" />
            </div>
          ))
        ) : rows.length === 0 ? (
          <div className="text-center text-gray-505 font-mono text-[11px] py-4 uppercase">
            NO DATA / NOT APPLICABLE
          </div>
        ) : (
          rows.map((row, rowIndex) => {
            const isImportantDates = headers && headers.length >= 3;

            return (
              <div
                key={rowIndex}
                className="py-4 border-b border-neutral-300 last:border-b-0 last:pb-0"
              >
                {!isImportantDates ? (
                  <div className="flex flex-col gap-3">
                    {row.map((cell, cellIndex) => {
                      const label = headers && headers[cellIndex] ? headers[cellIndex] : `Field ${cellIndex + 1}`;
                      const audited = auditCardData(label, cell);
                      return (
                        <div key={cellIndex} className="py-3 border-b border-neutral-300 last:border-b-0 last:pb-0">
                          <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                            {label}
                          </div>
                          <div className="text-[13px] font-semibold text-neutral-900 leading-tight">
                            {highlightCellContent(audited.refinedValue)}
                          </div>
                          {!audited.isValid && audited.remediation && (
                            <div className="text-[10px] text-amber-700 bg-amber-50 p-1 rounded mt-1 italic leading-tight">
                              {audited.remediation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Special 3-col layout for Important Dates: Event/Date/Notes */
                  <div className="flex flex-col gap-1.5 pt-0.5">
                    {/* Event Name */}
                    <div className="text-[14px] font-extrabold text-neutral-950 dark:text-zinc-50 leading-snug min-w-0 break-words">
                      {highlightCellContent(auditCardData(headers && headers[0] ? headers[0] : "Event", row[0]).refinedValue)}
                    </div>

                    {/* Target Date */}
                    <div className="flex items-center gap-1.5 text-[12px] text-neutral-700 dark:text-zinc-300 min-w-0 overflow-hidden">
                      <span className="text-[10px] text-gray-400 dark:text-zinc-500 font-mono uppercase font-semibold flex-shrink-0">
                        {headers && headers[1] ? headers[1] : "Date"}:
                      </span>
                      <span className="font-bold text-neutral-900 dark:text-zinc-200 break-words">
                        {highlightCellContent(auditCardData(headers && headers[1] ? headers[1] : "Date", row[1]).refinedValue)}
                      </span>
                    </div>

                    {/* Notes/Info (after divider if not empty/NA) */}
                    {!isEmptyOrNA(row[2]) && (
                      <div className="mt-1">
                        <div className="border-t border-dashed border-gray-200 dark:border-zinc-800 my-1.5" />
                        <div className="text-[11.5px] leading-relaxed text-gray-600 dark:text-zinc-400 font-medium min-w-0 break-words">
                          {highlightCellContent(auditCardData(headers && headers[2] ? headers[2] : "Notes", row[2]).refinedValue)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
