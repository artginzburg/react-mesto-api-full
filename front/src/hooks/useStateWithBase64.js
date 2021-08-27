import { useCallback, useEffect, useRef } from 'react';
import useStateWithLocalStorage from './useStateWithLocalStorage';

export const parseFixedLocalBase64Value = (elementName) =>
  localStorage[elementName] && atob(JSON.parse(localStorage[elementName]));

export default function useStateWithBase64(computed, defaultForComputed) {
  const [initialState, updateState] = useStateWithLocalStorage(computed, defaultForComputed);

  const setState = useCallback(
    (value) => {
      updateState(btoa(value));
    },
    [updateState]
  );

  const state = useRef(atob(initialState));

  useEffect(() => {
    state.current = atob(initialState);
  });

  return [state.current, setState];
}
