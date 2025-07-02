import React, { useState, useEffect, type ReactNode, createContext } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastProps = {
  message: string;
  type: 'success' | 'error' | 'info'|'loading';
  onClose: () => void;
  duration?: number;
};

export const Toast = ({ message, type, onClose, duration = 4000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className='h-5 w-5 text-white' />;
      case 'error':
        return <AlertCircle className='h-5 w-5 text-white' />;
      case 'info':
        return <AlertCircle className='h-5 w-5 text-white' />;
      case 'loading':
        return <AlertCircle className='h-5 w-5 text-white' />;
      default:
        return null;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-chart-3';
      case 'error':
        return 'bg-destructive';
      case 'info':
        return 'bg-primary';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 flex items-center p-4 mb-4 rounded-lg shadow-lg animate-fadeIn',
        getBackgroundColor(),
      )}
    >
      <div className='inline-flex items-center justify-center flex-shrink-0 w-8 h-8 mr-2'>
        {getIcon()}
      </div>
      <div className='text-sm font-normal text-white'>{message}</div>
      <button
        type='button'
        className='ml-4 inline-flex items-center justify-center h-8 w-8 rounded-lg text-white hover:bg-white/20 focus:ring-2 focus:ring-white'
        onClick={onClose}
      >
        <X className='h-4 w-4' />
        <span className='sr-only'>Close</span>
      </button>
    </div>
  );
};

type ToastContainerProps = {
  children: React.ReactNode;
};

export const ToastContainer = ({ children }: ToastContainerProps) => {
  return <div className='toast-container'>{children}</div>;
};

// Toast context to manage toasts
type ToastContextType = {
  showToast: (message: string, type: ToastProps['type'], duration?: number) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<
    Array<{ id: string; message: string; type: ToastProps['type']; duration?: number }>
  >([]);

  const showToast = (message: string, type: ToastProps['type'] = 'info', duration?: number) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
  };

  const closeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className='fixed top-0 right-0 p-4 z-50 space-y-4'>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => closeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
