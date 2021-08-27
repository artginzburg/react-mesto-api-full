import { useRef, useEffect, useCallback } from 'react';

import useEventListener from './useEventListener';

export default function useEscapeHandler(handler) {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  const escHandler = useCallback((e) => {
    if (e.key === 'Escape') {
      savedHandler.current();
    }
  }, []);

  useEventListener('keydown', escHandler);
}
