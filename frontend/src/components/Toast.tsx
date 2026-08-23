
import { useEffect } from 'react';

type ToastProps = {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
};

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="toast-overlay">
      <div className={`toast-box toast-${type}`}>
        {type === 'success' ? '✅' : '⚠️'} {message}
      </div>
    </div>
  );
}