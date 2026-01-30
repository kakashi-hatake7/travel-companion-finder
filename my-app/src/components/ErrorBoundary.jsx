import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
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
                <div className="error-boundary-container">
                    <div className="error-boundary-content">
                        <div className="error-icon">
                            <AlertTriangle size={64} />
                        </div>

                        <h1>Oops! Something went wrong</h1>
                        <p className="error-message">
                            We're sorry for the inconvenience. The error has been logged and we'll fix it soon.
                        </p>

                        {import.meta.env.DEV && this.state.error && (
                            <details className="error-details">
                                <summary>Error Details (Development Only)</summary>
                                <pre>{this.state.error.toString()}</pre>
                                <pre>{this.state.errorInfo?.componentStack}</pre>
                            </details>
                        )}

                        <div className="error-actions">
                            <button
                                className="btn-primary"
                                onClick={this.handleReload}
                            >
                                <RefreshCw size={18} />
                                Reload Page
                            </button>

                            <button
                                className="btn-secondary"
                                onClick={this.handleGoHome}
                            >
                                Go to Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
