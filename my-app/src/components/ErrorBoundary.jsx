import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console in development
        console.error('Error caught by boundary:', error, errorInfo);

        // Store error details in state
        this.setState({
            error,
            errorInfo
        });

        // Send to Sentry if available
        if (window.Sentry) {
            window.Sentry.captureException(error, {
                extra: {
                    componentStack: errorInfo.componentStack,
                },
            });
        }
    }

    handleReload = () => {
        window.location.reload();
    };

    handleGoHome = () => {
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 transition-colors duration-300">
                    <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 text-center border border-slate-100 dark:border-slate-800">
                        <div className="bg-red-50 dark:bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="text-red-500 dark:text-red-400" size={32} />
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            Something went wrong
                        </h2>

                        <p className="text-slate-600 dark:text-slate-400 mb-8">
                            We apologize for the inconvenience. The error has been logged and we'll look into it.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={18} />
                                Reload Page
                            </button>

                            <button
                                onClick={() => window.location.href = '/'}
                                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <Home size={18} />
                                Go to Homepage
                            </button>
                        </div>

                        {import.meta.env.DEV && this.state.error && (
                            <div className="mt-8 text-left">
                                <details className="cursor-pointer group">
                                    <summary className="text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors list-none flex items-center gap-1">
                                        <span className="group-open:rotate-90 transition-transform">▶</span>
                                        Error Details
                                    </summary>
                                    <div className="mt-2 p-4 bg-slate-50 dark:bg-slate-950 rounded-lg overflow-auto max-h-48 text-xs font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                                        <p className="font-bold text-red-500 dark:text-red-400 mb-2">{this.state.error.toString()}</p>
                                        <pre className="whitespace-pre-wrap">{this.state.errorInfo?.componentStack}</pre>
                                    </div>
                                </details>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
