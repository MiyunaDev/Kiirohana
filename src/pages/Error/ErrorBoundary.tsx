// OPSIONAL AJA, KALOPUN NGGA DIPAKE JUGA GAGAPA, CUMA UDAH KU UBAH DI MAIN.TSX NYA 

// <ErrorBoundary>
//   <RouterProvider router={router} />
// </ErrorBoundary>


import { Component, ReactNode } from "react";
import { Link } from "react-router";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full min-h-screen flex items-center justify-center px-4 bg-[#0F0F14] text-white overflow-hidden">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-[#171720] overflow-hidden shadow-2xl">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-red-500 opacity-20 blur-3xl rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-red-500 opacity-10 blur-3xl rounded-full" />

            <div className="relative z-10 flex flex-col items-center text-center px-6 py-14 sm:px-10">
              <h1 className="text-7xl sm:text-8xl font-black tracking-widest text-red-500 drop-shadow-lg">
                Boundaries Error
              </h1>

              <h2 className="mt-4 text-2xl sm:text-3xl font-bold">
                Halo? Kamu ngapain disini?
              </h2>

              <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-md leading-relaxed">
                Kalo kamu ada disini. Kamu ngapain?
                coba kamu balik lagi ke halaman sebelumnya, atau restart appnya.
              </p>

              {this.state.error && (
                <details className="mt-4 w-full max-w-md text-left">
                  <summary className="text-xs text-gray-500 cursor-pointer select-none">
                    Error details
                  </summary>
                  <pre className="mt-2 p-3 rounded-lg bg-black/40 text-xs text-red-300 overflow-auto max-h-40">
                    {this.state.error.message}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-3 mt-10 w-full sm:w-auto">
                <button
                  onClick={this.handleRestart}
                  className="px-6 py-3 rounded-2xl bg-[#C667F7] hover:brightness-110 transition-all duration-200"
                >
                  Restart App
                </button>

                <button
                  onClick={this.handleReload}
                  className="px-6 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
