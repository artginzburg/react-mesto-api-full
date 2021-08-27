import { memo } from 'react';

import Popup from './Popup';

const popupShouldntRender = (prevProps, nextProps) => {
  const isOpen = prevProps.isOpen;
  const notSame = prevProps.isOpen !== nextProps.isOpen;
  const condition = isOpen || notSame;
  return !condition;
};

const inPopup = (Component, propsFunction) => {
  function ComponentWrapper(props) {
    const popupProps = {
      isOpen: props.isOpen,
      onClick: props.onClose,
      ...(propsFunction && propsFunction(props)),
    };

    return (
      <Popup {...popupProps}>
        <Component {...props} />
      </Popup>
    );
  }

  return memo(ComponentWrapper, popupShouldntRender);
};

export default inPopup;
