import { useEffect } from 'react';

const useBodyScrollLock = (isLocked: boolean): void => {
  useEffect(() => {
    if (!isLocked) return;

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLocked]);
};

export default useBodyScrollLock;
