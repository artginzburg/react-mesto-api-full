import { memo } from 'react';

import { useCurrentUser } from '../contexts/CurrentUserContext';

const Card = memo(({ card, ...props }) => {
  card.likes = card.likes ?? [];

  const currentUser = useCurrentUser();

  if (card.isTemporarilyLocal) {
    card.owner = currentUser;
  }

  const isOwn = card.owner._id
    ? card.owner._id === currentUser._id
    : card.owner === currentUser._id;

  const isLiked = card.likes.some((i) => i._id === currentUser._id);

  function handleImageClick() {
    props.onCardClick(card);
  }

  function handleLikeClick() {
    if (card.isTemporarilyLocal) return;
    props.onCardLike(card);
  }

  function handleDeleteClick() {
    if (card.isTemporarilyLocal) return;
    props.onCardDelete(card);
  }

  return (
    <li className="element">
      <img onClick={handleImageClick} className="element__image" alt={card.name} src={card.link} />
      {isOwn && (
        <button onClick={handleDeleteClick} type="reset" className="element__trash-button" />
      )}
      <div className="element__container">
        <h2 className="element__title">{card.name}</h2>
        <div className="element__likes">
          <input
            checked={isLiked}
            type="checkbox"
            onChange={handleLikeClick}
            className="element__like-button"
          />
          <p className="element__like-counter">{card.likes.length}</p>
        </div>
      </div>
    </li>
  );
});

export default Card;
