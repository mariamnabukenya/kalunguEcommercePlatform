import toast from 'react-hot-toast';

interface ErrorInfo {
  message: string;
  code?: string | number;
  details?: any;
  timestamp: string;
  url?: string;
  userAgent?: string;
}

class ErrorHandler {
  private errorQueue: ErrorInfo[] = [];
  private maxQueueSize = 50;

  // Log error to console and optionally show toast
  logError(error: Error | string, showToast: boolean = true, context?: string): void {
    const errorInfo: ErrorInfo = {
      message: typeof error === 'string' ? error : error.message,
      code: typeof error === 'object' && 'code' in error ? (error as any).code : undefined,
      details: typeof error === 'object' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Add context if provided
    if (context) {
      errorInfo.message = `[${context}] ${errorInfo.message}`;
    }

    // Add to queue
    this.addToQueue(errorInfo);

    // Log to console
    console.error('Error logged:', errorInfo);

    // Show toast if enabled
    if (showToast) {
      toast.error(errorInfo.message);
    }

    // Send to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(errorInfo);
    }
  }

  // Handle API errors specifically
  handleApiError(error: any, context?: string): void {
    let message = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const data = error.response.data;
      
      switch (status) {
        case 400:
          message = data.message || 'Invalid request';
          break;
        case 401:
          message = 'Please log in to continue';
          break;
        case 403:
          message = 'You do not have permission to perform this action';
          break;
        case 404:
          message = 'The requested resource was not found';
          break;
        case 422:
          message = data.message || 'Validation error';
          break;
        case 429:
          message = 'Too many requests. Please try again later';
          break;
        case 500:
          message = 'Server error. Please try again later';
          break;
        default:
          message = data.message || `Error ${status}`;
      }
    } else if (error.request) {
      // Network error
      message = 'Network error. Please check your connection';
    } else {
      // Other error
      message = error.message || 'An unexpected error occurred';
    }

    this.logError(message, true, context);
  }

  // Handle form validation errors
  handleValidationError(errors: Record<string, string[]>): void {
    const firstError = Object.values(errors)[0]?.[0];
    if (firstError) {
      toast.error(firstError);
    }
  }

  // Add error to queue
  private addToQueue(errorInfo: ErrorInfo): void {
    this.errorQueue.unshift(errorInfo);
    
    // Keep queue size manageable
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(0, this.maxQueueSize);
    }
  }

  // Send error to external service (e.g., Sentry, LogRocket, etc.)
  private sendToExternalService(errorInfo: ErrorInfo): void {
    // Example: Send to Sentry
    // if (typeof Sentry !== 'undefined') {
    //   Sentry.captureException(new Error(errorInfo.message), {
    //     extra: errorInfo,
    //   });
    // }

    // Example: Send to custom endpoint
    // fetch('/api/errors', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(errorInfo),
    // }).catch(() => {
    //   // Silently fail if error reporting fails
    // });

    console.log('Error sent to external service:', errorInfo);
  }

  // Get error queue for debugging
  getErrorQueue(): ErrorInfo[] {
    return [...this.errorQueue];
  }

  // Clear error queue
  clearErrorQueue(): void {
    this.errorQueue = [];
  }

  // Handle unhandled promise rejections
  handleUnhandledRejection(event: PromiseRejectionEvent): void {
    this.logError(
      `Unhandled promise rejection: ${event.reason}`,
      false,
      'UnhandledRejection'
    );
  }

  // Handle uncaught errors
  handleUncaughtError(event: ErrorEvent): void {
    this.logError(
      event.error || event.message,
      false,
      'UncaughtError'
    );
  }

  // Initialize global error handlers
  initialize(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this));

    // Handle uncaught errors
    window.addEventListener('error', this.handleUncaughtError.bind(this));

    console.log('Error handler initialized');
  }
}

export const errorHandler = new ErrorHandler();
export default errorHandler;
