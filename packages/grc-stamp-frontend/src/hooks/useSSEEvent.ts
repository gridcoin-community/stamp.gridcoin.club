import { useEffect } from 'react';
import { EventType } from '@/types';
import sseManager from '../lib/sseManager';

export const useSSEEvent = (type: EventType, callback: (data: any) => void) => {
  useEffect(() => {
    sseManager.on(type, callback);
    return () => {
      sseManager.off(type, callback);
    };
  }, [type, callback]);
};
