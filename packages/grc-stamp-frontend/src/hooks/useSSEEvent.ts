import { useEffect } from 'react';
import sseManager from '../lib/sseManager';
import { EventType } from '@/types';

export const useSSEEvent = (type: EventType, callback: (data: any) => void) => {
  useEffect(() => {
    sseManager.on(type, callback);
    return () => {
      sseManager.off(type, callback);
    };
  }, [type, callback]);
};
