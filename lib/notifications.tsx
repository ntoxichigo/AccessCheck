'use client';

/**
 * Notification System
 * Toast notifications and in-app notification center
 */

import { Toaster as SonnerToaster, toast } from 'sonner';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast notification wrapper with custom styling
 */
export const notify = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      icon: <CheckCircle2 className="h-5 w-5" />,
      duration: 4000,
    });
  },

  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
      icon: <XCircle className="h-5 w-5" />,
      duration: 6000,
    });
  },

  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      icon: <AlertCircle className="h-5 w-5" />,
      duration: 5000,
    });
  },

  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      icon: <Info className="h-5 w-5" />,
      duration: 4000,
    });
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  dismiss: (toastId: string | number) => {
    toast.dismiss(toastId);
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: Error) => string);
    }
  ) => {
    return toast.promise(promise, messages);
  },
};

/**
 * Toaster component to be added to root layout
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: 'hsl(var(--background))',
          border: '1px solid hsl(var(--border))',
          color: 'hsl(var(--foreground))',
        },
        className: 'font-sans',
      }}
    />
  );
}

/**
 * Custom notification component for complex notifications
 */
interface CustomNotificationProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

export function showCustomNotification({
  title,
  description,
  action,
  onClose,
}: CustomNotificationProps) {
  toast.custom(
    (t) => (
      <div className="flex items-start gap-3 rounded-lg border bg-background p-4 shadow-lg">
        <Info className="h-5 w-5 text-blue-500 mt-0.5" />
        <div className="flex-1">
          <div className="font-semibold text-sm">{title}</div>
          {description && <div className="text-sm text-muted-foreground mt-1">{description}</div>}
          {action && (
            <button
              onClick={() => {
                action.onClick();
                toast.dismiss(t);
              }}
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              {action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => {
            toast.dismiss(t);
            onClose?.();
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ),
    {
      duration: 6000,
    }
  );
}
