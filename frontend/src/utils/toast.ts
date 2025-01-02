import { toast as hotToast, ToastOptions } from 'react-hot-toast';

export const toastConfig: ToastOptions = {
  position: 'bottom-center',
  duration: 4000,
  style: {
    background: '#333',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
  },
};

export const toast = {
  success: (message: string) => hotToast.success(message, toastConfig),
  error: (message: string) => hotToast.error(message, toastConfig),
  loading: (message: string) => hotToast.loading(message, toastConfig),
};
