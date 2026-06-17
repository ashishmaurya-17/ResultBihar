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

  // 1. Exact Date Pattern
  if (/^\d{1,2}[-/\.]\d{1,2}[-/\.]\d{2,4}$/.test(trimmed)) {
    return (
      <span className="bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-200 px-2.5 py-1 rounded-lg font-mono font-black text-[11px] sm:text-xs select-all tracking-tight inline-block">
        {trimmed}
      </span>
    );
  }

  // 2. Fees Pattern
  if (
    trimmed.startsWith("₹") || 
    trimmed.startsWith("Rs") || 
    /^\d+\s*\/-$/.test(trimmed) || 
    trimmed.toLowerCase() === "no fee" || 
    trimmed.toLowerCase() === "exempted" || 
    trimmed.toLowerCase() === "nil"
  ) {
    return (
      <span className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/60 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg font-mono font-black text-[11px] sm:text-xs tracking-tight inline-block">
        {trimmed}
      </span>
    );
  }

  // 3. Metric parameters
  if (/^\d+\s*(?:Years|Posts|Seats|Ages|Months|Days|Post|Seat|Marks|Percent|%)/i.test(trimmed)) {
    return (
      <span className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-indigo-750 dark:text-indigo-300 px-2.5 py-1 rounded-lg font-mono font-black text-[11px] sm:text-xs tracking-tight inline-block">
        {trimmed}
      </span>
    );
  }

  // 4. Embedded patterns
  const searchRegex = /(\b\d{1,2}[-/\.]\d{1,2}[-/\.]\d{2,4}\b|(?:₹|Rs\.?)\s*\d+[-/\w]*)/gi;
  if (searchRegex.test(trimmed)) {
    const parts = trimmed.split(searchRegex);
    return (
      <span className="leading-relaxed">
        {parts.map((p, idx) => {
          if (searchRegex.test(p) && /\d/.test(p)) {
            let bgClass = "bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-100 dark:border-amber-900/30";
            if (p.includes("/") || p.includes("-")) {
              bgClass = "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-200 border border-rose-100 dark:border-rose-900/30";
            } else if (p.includes("₹") || p.toLowerCase().includes("rs")) {
              bgClass = "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-100/30 dark:border-emerald-900/20";
            }
            return (
              <span key={idx} className={`${bgClass} px-2 py-0.5 rounded-md font-mono font-black text-[10.5px] mx-0.5 inline-block`}>
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
    <div className={`w-full border border-neutral-150 dark:border-zinc-800 rounded-3xl overflow-hidden my-4 bg-white dark:bg-zinc-900/60 shadow-[0_2px_15px_rgba(0,0,0,0.015)] transition-all duration-300 ${className}`} role="table" aria-label={title || "Data table"}>
      {title && (
        <div id="table-title" className="bg-neutral-50 dark:bg-zinc-950/80 text-neutral-850 dark:text-zinc-100 font-sans text-xs uppercase font-black tracking-wider px-4 py-3 text-center border-b border-neutral-150 dark:border-zinc-800">
          {title}
        </div>
      )}

      {/* Desktop View: Standard structured table */}
      <table className="hidden sm:table w-full text-left border-collapse font-sans text-[12.5px] sm:text-[13px] md:text-[13.5px] text-gray-900 dark:text-zinc-200" aria-labelledby={title ? "table-title" : undefined}>
        {headers && headers.length > 0 && (
          <thead className="table-header-group">
            <tr className="bg-neutral-50/50 dark:bg-zinc-950/40 border-b border-neutral-150 dark:border-zinc-800">
              {headers.map((hdr, i) => (
                <th
                  key={i}
                  style={colWidths && colWidths[i] ? { width: colWidths[i] } : undefined}
                  className="px-4 py-3 font-sans font-black text-neutral-800 dark:text-zinc-100 border-r border-neutral-150 last:border-r-0 dark:border-zinc-800 uppercase text-[11px] sm:text-xs tracking-wider"
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
                className="table-row border-b border-neutral-150 dark:border-zinc-800 last:border-b-0 animate-pulse bg-neutral-100/40 dark:bg-zinc-850/10"
              >
                {(headers && headers.length > 0 ? headers : ["Col 1", "Col 2"]).map((_, cellIdx) => (
                  <td key={cellIdx} className="px-4 py-3.5 border-r border-neutral-150 last:border-r-0 dark:border-zinc-800 align-middle">
                    <div className="h-4 bg-neutral-100 dark:bg-zinc-850 rounded-lg w-3/4 max-w-[240px]" />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr className="table-row">
              <td
                colSpan={headers ? headers.length : 1}
                className="px-4 py-5 text-center text-neutral-400 font-sans font-bold text-xs uppercase table-cell"
              >
                NO DATA / NOT APPLICABLE
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`table-row border-b border-neutral-150 last:border-b-0 dark:border-zinc-800 transition-colors duration-300 ${
                  rowIndex % 2 === 0 ? "bg-white dark:bg-zinc-900/10" : "bg-neutral-50/20 dark:bg-zinc-950/10"
                }`}
              >
                {row.map((cell, cellIndex) => {
                  const label = headers && headers[cellIndex] ? headers[cellIndex] : `Field ${cellIndex + 1}`;
                  const audited = auditCardData(label, cell);
                  return (
                    <td
                      key={cellIndex}
                      className="px-4 py-3 table-cell border-r border-neutral-150 last:border-r-0 dark:border-zinc-800 align-top leading-relaxed text-neutral-800 dark:text-zinc-300"
                    >
                      <div className="break-words max-w-full text-[13px] sm:text-[13.5px] font-bold text-neutral-800 dark:text-zinc-100">
                        {highlightCellContent(audited.refinedValue)}
                      </div>
                      {!audited.isValid && audited.remediation && (
                        <div className="text-[10px] text-amber-800 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 p-2 rounded-lg mt-1.5 italic leading-tight border border-amber-200/50 dark:border-amber-900/40">
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

      {/* Mobile View: High-fidelity, card-based with elegance */}
      <div className="sm:hidden block p-4 space-y-4 bg-neutral-50/25 dark:bg-zinc-950/10">
        {isLoading ? (
          [1, 2, 3].map((idx) => (
            <div key={idx} className="py-4 border-b border-neutral-150 last:border-b-0 animate-pulse space-y-2">
              <div className="h-3 bg-neutral-150 dark:bg-zinc-800 w-1/4 rounded-lg" />
              <div className="h-4 bg-neutral-200 dark:bg-zinc-700 w-5/6 rounded-lg" />
              <div className="h-3 bg-neutral-150 dark:bg-zinc-800 w-1/2 rounded-lg" />
            </div>
          ))
        ) : rows.length === 0 ? (
          <div className="text-center text-neutral-400 font-sans font-bold text-xs py-5 uppercase">
            NO DATA / NOT APPLICABLE
          </div>
        ) : (
          rows.map((row, rowIndex) => {
            const isImportantDates = headers && headers.length >= 3;

            return (
              <div
                key={rowIndex}
                className="py-4 border-b border-neutral-150 dark:border-zinc-800 last:border-b-0 last:pb-0"
              >
                {!isImportantDates ? (
                  <div className="flex flex-col gap-3">
                    {row.map((cell, cellIndex) => {
                      const label = headers && headers[cellIndex] ? headers[cellIndex] : `Field ${cellIndex + 1}`;
                      const audited = auditCardData(label, cell);
                      return (
                        <div key={cellIndex} className="py-2.5 border-b border-neutral-100 last:border-b-0 last:pb-0 dark:border-zinc-800/50">
                          <div className="text-[10px] font-black text-neutral-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
                            {label}
                          </div>
                          <div className="text-[13px] font-bold text-neutral-900 dark:text-zinc-100 leading-tight">
                            {highlightCellContent(audited.refinedValue)}
                          </div>
                          {!audited.isValid && audited.remediation && (
                            <div className="text-[10px] text-amber-800 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/25 p-2 rounded-lg mt-1.5 italic leading-tight border border-amber-250 dark:border-amber-900/30">
                              {audited.remediation}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Special 3-col layout for Important Dates: Event/Date/Notes */
                  <div className="flex flex-col gap-2 pt-0.5">
                    {/* Event Name */}
                    <div className="text-[14px] font-black text-neutral-950 dark:text-zinc-50 leading-snug break-words">
                      {highlightCellContent(auditCardData(headers && headers[0] ? headers[0] : "Event", row[0]).refinedValue)}
                    </div>

                    {/* Target Date */}
                    <div className="flex items-center gap-1.5 text-[12.5px] text-neutral-750 dark:text-zinc-300">
                      <span className="text-[10px] text-neutral-400 dark:text-zinc-500 font-sans uppercase font-black tracking-wider flex-shrink-0">
                        {headers && headers[1] ? headers[1] : "Date"}:
                      </span>
                      <span className="font-bold text-neutral-900 dark:text-zinc-200 break-words">
                        {highlightCellContent(auditCardData(headers && headers[1] ? headers[1] : "Date", row[1]).refinedValue)}
                      </span>
                    </div>

                    {/* Notes/Info */}
                    {!isEmptyOrNA(row[2]) && (
                      <div className="mt-1">
                        <div className="border-t border-dashed border-neutral-150 dark:border-zinc-800 my-2" />
                        <div className="text-[12px] leading-relaxed text-neutral-500 dark:text-zinc-400 font-bold break-words">
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
