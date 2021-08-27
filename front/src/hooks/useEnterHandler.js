import { useRef, useEffect, useCallback } from 'react';

import useEventListener from './useEventListener';

export default function useEnterHandler(handler) {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  const enterHandler = useCallback((e) => {
    if (e.key === 'Enter') {
      savedHandler.current();
    }
  }, []);

  useEventListener('keydown', enterHandler);
}
