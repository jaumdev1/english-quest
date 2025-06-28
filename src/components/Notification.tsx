import { X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface NotificationProps {
  type: 'error' | 'success' | 'loading';
  message: string;
  onClose?: () => void;
  show?: boolean;
}

export function Notification({ type, message, onClose, show = true }: NotificationProps) {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle size={20} className="text-red-400" />;
      case 'success':
        return <CheckCircle size={20} className="text-accent-400" />;
      case 'loading':
        return <Loader2 size={20} className="text-accent-400 animate-spin" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      case 'success':
        return 'bg-accent-500/10 border-accent-500/20';
      case 'loading':
        return 'bg-accent-500/10 border-accent-500/20';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'success':
        return 'text-accent-400';
      case 'loading':
        return 'text-accent-400';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full animate-slideInRight">
      <div className={`${getBgColor()} backdrop-blur-sm border rounded-xl p-4 shadow-lg`}>
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1">
            <p className={`${getTextColor()} font-montserrat text-sm`}>
              {message}
            </p>
          </div>
          {onClose && type !== 'loading' && (
            <button
              onClick={onClose}
              className="text-dark-200 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 