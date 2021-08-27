import { memo, useMemo } from 'react';

import { useCurrentUser } from '../contexts/CurrentUserContext';

import Card from './Card';

const MAXIMUM_CARDS_QUANTITY = 30;

const defaultCard = {
  isTemporarilyLocal: true,
  name: 'Загрузка...',
};

const defaultCards = [];
for (let i = 0; i < MAXIMUM_CARDS_QUANTITY; i++) {
  defaultCards.push(defaultCard);
}

const Main = memo(props => {
  const currentUser = useCurrentUser();

  const cards = useMemo(() => (props.cards.length ? props.cards : defaultCards), [props.cards]);

  return (
    <main className="content">
      <section className="profile">
        <button onClick={props.onEditAvatar} type="button" className="profile__avatar-container">
          <img alt="Аватар" className="profile__avatar" src={currentUser.avatar} />
        </button>
        <div className="profile__info">
          <h1 className="profile__name">{currentUser.name}</h1>
          <p className="profile__description">{currentUser.about}</p>
          <button onClick={props.onEditProfile} type="button" className="profile__edit-button" />
        </div>
        <button onClick={props.onAddPlace} type="button" className="profile__add-button" />
      </section>

      <section className="elements">
        <ul className="elements__list">
          {cards.map(card => (
            <Card
              key={card._id ?? Math.random()}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
              card={card}
            />
          ))}
        </ul>
      </section>
    </main>
  );
});

export default Main;
