export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export class ErrorHandler {
  private static errors: AppError[] = [];
  private static maxErrors = 100;

  static logError(error: Error | AppError, context?: string): void {
    const appError: AppError = 'code' in error ? error : {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred',
      details: { context, stack: error.stack },
      timestamp: new Date().toISOString(),
    };

    this.errors.unshift(appError);
    
    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Log to console in development
    if (__DEV__) {
      console.error(`[${appError.code}] ${appError.message}`, appError.details);
    }

    // In production, you would send this to your error tracking service
    // Example: Sentry.captureException(appError);
  }

  static getRecentErrors(limit: number = 10): AppError[] {
    return this.errors.slice(0, limit);
  }

  static clearErrors(): void {
    this.errors = [];
  }

  static createError(code: string, message: string, details?: any): AppError {
    return {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
    };
  }

  static handleAsyncError<T>(
    promise: Promise<T>,
    context?: string
  ): Promise<T | null> {
    return promise.catch((error) => {
      this.logError(error, context);
      return null;
    });
  }

  static wrapFunction<T extends (...args: any[]) => any>(
    fn: T,
    context?: string
  ): T {
    return ((...args: any[]) => {
      try {
        const result = fn(...args);
        
        // Handle async functions
        if (result instanceof Promise) {
          return result.catch((error) => {
            this.logError(error, context);
            throw error;
          });
        }
        
        return result;
      } catch (error) {
        this.logError(error as Error, context);
        throw error;
      }
    }) as T;
  }

  static getUserFriendlyMessage(error: AppError | Error): string {
    if ('code' in error) {
      switch (error.code) {
        case 'NETWORK_ERROR':
          return 'Please check your internet connection and try again.';
        case 'AUTH_ERROR':
          return 'Please log in again to continue.';
        case 'PERMISSION_DENIED':
          return 'You don\'t have permission to perform this action.';
        case 'VALIDATION_ERROR':
          return 'Please check your input and try again.';
        case 'RATE_LIMIT_EXCEEDED':
          return 'Too many requests. Please wait a moment and try again.';
        default:
          return error.message || 'Something went wrong. Please try again.';
      }
    }
    
    return error.message || 'Something went wrong. Please try again.';
  }
}