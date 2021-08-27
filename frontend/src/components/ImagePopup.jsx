import { popupSelectors } from '../utils/utils';
import { classNames } from '../utils/toClassNames';

import inPopup from './inPopup';

const buttonClassNames = [
  popupSelectors.closeButtonClass,
  `${popupSelectors.closeButtonClass}_parent-corners_straight`,
];

const ImagePopup = ({ card }) => (
  <figure className="popup__figure">
    <button type="button" {...classNames(buttonClassNames)} />
    <img className="popup__image" alt={card.name} src={card.link} />
    <figcaption className="popup__caption">{card.name}</figcaption>
  </figure>
);

export default inPopup(ImagePopup, () => ({
  className: 'popup_type_image',
  id: 'image-viewer',
}));
