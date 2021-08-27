import { useState, useEffect, memo } from 'react';
import { createPortal } from 'react-dom';

import { classNames } from '../utils/toClassNames';

const POPUP_ANIMATION_DURATION = 250;

const defaults = {
  className: 'popup',
  classNameClosed: '',
  isOpened: false,
};
defaults.classNameOpened = `${defaults.className}_opened`;

const modalRoot = document.getElementById('modal-root');

const Popup = memo(({ isOpen, ...props }) => {
  const [classNameForAnimation, setClassNameForAnimation] = useState(defaults.classNameClosed);
  const [shouldAppearInDOM, setShouldAppearInDOM] = useState(defaults.isOpened);

  useEffect(() => {
    if (!isOpen) {
      document.activeElement.blur(); // fixes mobile keyboard being stuck on the screen after form submission (due to `event.preventDefault()`)
    }

    if (isOpen) {
      setShouldAppearInDOM(!defaults.isOpened);
      const showingTimout = setTimeout(() => {
        setClassNameForAnimation(defaults.classNameOpened);
      }, 10);

      return () => clearTimeout(showingTimout);
    } else {
      setClassNameForAnimation(defaults.classNameClosed);
      const hidingTimeout = setTimeout(() => {
        setShouldAppearInDOM(defaults.isOpened);
      }, POPUP_ANIMATION_DURATION);

      return () => clearTimeout(hidingTimeout);
    }
  }, [isOpen]);

  if (!shouldAppearInDOM) {
    return null;
  }

  const popupClassNames = [defaults.className, props.className, classNameForAnimation];

  return createPortal(
    <section
      onClick={props.onClick}
      style={{ transitionDuration: `${POPUP_ANIMATION_DURATION}ms` }}
      {...classNames(popupClassNames)}
      id={props.id}
    >
      {props.children}
    </section>,
    modalRoot
  );
});

export default Popup;
