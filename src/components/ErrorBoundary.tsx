import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error captured by SarkariBoard ErrorBoundary:", error, errorInfo);
  }

  public componentDidMount() {
    // Standard React ErrorBoundary does not require global window-level interceptors
  }

  public componentWillUnmount() {
    // Standard React ErrorBoundary does not require global window-level interceptors
  }

  private handleReset = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F5] p-4 select-none">
          <div className="max-w-md w-full bg-white border-4 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center space-y-6">
            {/* Header banner */}
            <div className="bg-red-800 border-2 border-black p-3 text-white text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="font-mono font-black text-xs sm:text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                <AlertCircle className="w-5 h-5 text-white shrink-0" />
                <span>CRITICAL RECOVERY PORTAL</span>
              </h2>
            </div>

            <div className="space-y-3">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-950 uppercase select-text">
                Oops! Something went wrong while loading the data.
              </h1>
              <p className="text-xs sm:text-sm text-gray-700 font-medium font-mono">
                The interface encountered an unexpected execution error. Try refreshing the page to reload the data.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-amber-50 p-3 border-2 border-black text-left overflow-auto max-h-32 text-xs font-mono text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <p className="font-extrabold select-text text-red-800">
                  [{this.state.error.name}] {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <p className="opacity-70 mt-1.5 select-all whitespace-pre text-[10px] leading-relaxed">
                    {this.state.error.stack.split("\n").slice(0, 3).join("\n")}
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-650 hover:bg-black text-white font-black uppercase text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Page
              </button>

              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                    sessionStorage.clear();
                  } catch (e) {
                    console.error(e);
                  }
                  window.location.href = "/";
                }}
                className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-white text-gray-950 font-black uppercase text-xs border-2 border-black hover:bg-gray-100 transition-all cursor-pointer"
              >
                Clear Cache & Reset
              </button>
            </div>

            <div className="text-[10px] text-gray-600 font-mono font-bold uppercase tracking-wider">
              SARKARI BOARD • SYSTEM RECOVERY PORTAL
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
