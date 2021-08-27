import React from 'react';

import { Route, Switch, useHistory } from 'react-router-dom';

import { paths } from '../utils/constants';
import scrollToTop from '../utils/scrollToTop';

import useStateWithLocalStorage from '../hooks/useStateWithLocalStorage';
import useStateWithBase64 from '../hooks/useStateWithBase64';
import useEscapeHandler from '../hooks/useEscapeHandler';

import api from '../api/api';
import auth from '../api/auth';

import { CurrentUserProvider, defaultUserState } from '../contexts/CurrentUserContext';

import Authentication from './Authentication';
import ProtectedRoute from './ProtectedRoute';

import Header from './Header';
import Main from './Main';
import Footer from './Footer';

import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import ImagePopup from './ImagePopup';
import InfoTooltip from './InfoTooltip';

import checkLocalHost from '../utils/checkLocalHost';

checkLocalHost();

function App() {
  const history = useHistory();

  const [currentUser, setCurrentUser] = useStateWithLocalStorage('currentUser', defaultUserState);

  const [loggedIn, setLoggedIn] = useStateWithLocalStorage('loggedIn', false);
  const [email, setEmail] = useStateWithBase64('email', '');

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isConfirmDeletePopupOpen, setIsConfirmDeletePopupOpen] = React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);

  const [isInfoTooltipSuccess, setIsInfoTooltipSuccess] = React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState({});

  const [cards, setCards] = useStateWithLocalStorage('cards', []);

  React.useEffect(() => {
    if (loggedIn) {
      api
        .getUserInfo()
        .then(setCurrentUser)
        .catch((err) => console.log('Couldnt get user info from the server', err));
      api
        .getInitialCards()
        .then(setCards)
        .catch((err) => console.log('Couldnt get initial cards from the server', err));
    }
  }, [loggedIn, setCards, setCurrentUser]);

  async function handleCardLike(card) {
    const oldCards = cards;

    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    const expectedCardLikes = isLiked
      ? card.likes.filter((like) => like._id !== currentUser._id)
      : [...card.likes, currentUser];

    const expectedCard = { ...card, likes: expectedCardLikes };

    setCards(cards.map((c) => (c._id === card._id ? expectedCard : c)));

    try {
      const newCard = await api.changeLikeCardStatus(card._id, !isLiked);
      setCards(cards.map((c) => (c._id === card._id ? newCard : c)));
      return newCard;
    } catch (error) {
      setCards(oldCards);
      console.error(error);
    }
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsConfirmDeletePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsInfoTooltipOpen(false);
  }

  const handleCardDelete = React.useCallback(
    (card) => {
      const oldCards = cards;

      setCards(cards.filter((c) => c._id !== card._id));

      closeAllPopups();

      return api.deleteCard(card._id).catch((error) => {
        setCards(oldCards);
        console.log('Couldnt delete card on the server', error);
      });
    },
    [cards, setCards],
  );

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleConfirmDeleteClick(card) {
    setSelectedCard(card);

    setIsConfirmDeletePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);

    setIsImagePopupOpen(true);
  }

  const handlePopupClick = React.useCallback((e) => {
    e.target === e.currentTarget && closeAllPopups();
  }, []);

  const handleUpdateUser = closeAllPopups;
  const handleUpdateAvatar = closeAllPopups;

  function handleAddPlaceSubmit({ title, link }) {
    const oldCards = cards;

    const expectedCard = {
      isTemporarilyLocal: true,
      name: title,
      link,
    };

    setCards([expectedCard, ...cards]);

    closeAllPopups();

    return api
      .addCard(title, link)
      .then((newCard) => setCards([newCard, ...cards]))
      .catch((err) => {
        setCards(oldCards);
        throw err; // Forwarding error to PopupWithForm
      });
  }

  useEscapeHandler(closeAllPopups);

  const handleLogin = React.useCallback(
    (email) => {
      setEmail(email);
      setLoggedIn(true);
    },
    [setEmail, setLoggedIn],
  );

  const handleTokenCheck = React.useCallback(() => {
    auth
      .getUserInfo()
      .then((res) => {
        if (res) {
          handleLogin(res.email);
          history.replace(paths.main);
        }
      })
      .catch((err) => {
        setLoggedIn(false);

        console.log(err);
      });
  }, [handleLogin, history, setLoggedIn]);

  function handleSubmitRegister(e_, email, password) {
    return auth
      .register(email, password)
      .then(() => {
        history.replace(paths.login);
        setIsInfoTooltipSuccess(true);
      })
      .catch((err) => {
        setIsInfoTooltipSuccess(false);
        console.log(err);
      })
      .finally(() => {
        setIsInfoTooltipOpen(true);
      });
  }

  function handleSubmitLogin(e, email, password) {
    if (!email || !password) {
      return;
    }

    return auth
      .login(email, password)
      .then((data) => {
        if (data) {
          e.target.reset();

          handleLogin(email);
          history.push(paths.main);
        }
      })
      .catch((err) => {
        setIsInfoTooltipOpen(true);
        console.log(err);
      });
  }

  function handleSignOut() {
    auth
      .logout()
      .then(() => {
        setLoggedIn(false);
        history.replace(paths.login);
        scrollToTop();
      })
      .catch((err) => {
        setIsInfoTooltipOpen(true);
        console.log(err);
      });
  }

  React.useEffect(() => {
    handleTokenCheck();
  }, [handleTokenCheck]);

  return (
    <CurrentUserProvider state={currentUser} dispatch={setCurrentUser}>
      <Header credential={email} onSignOut={handleSignOut} loggedIn={loggedIn} />

      <Switch>
        <Route path={[paths.register, paths.login]}>
          <Authentication
            loggedIn={loggedIn}
            handleLogin={handleSubmitLogin}
            handleRegister={handleSubmitRegister}
          />

          <InfoTooltip
            isOpen={isInfoTooltipOpen}
            isSuccess={isInfoTooltipSuccess}
            onClose={handlePopupClick}
          />
        </Route>

        <ProtectedRoute path={paths.main} loggedIn={loggedIn}>
          <Main
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            cards={cards}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleConfirmDeleteClick}
          />

          <EditProfilePopup
            onUpdateUser={handleUpdateUser}
            isOpen={isEditProfilePopupOpen}
            onClose={handlePopupClick}
          />
          <AddPlacePopup
            onAddPlace={handleAddPlaceSubmit}
            isOpen={isAddPlacePopupOpen}
            onClose={handlePopupClick}
          />
          <EditAvatarPopup
            onUpdateAvatar={handleUpdateAvatar}
            isOpen={isEditAvatarPopupOpen}
            onClose={handlePopupClick}
          />
          <ConfirmDeletePopup
            card={selectedCard}
            onCardDelete={handleCardDelete}
            isOpen={isConfirmDeletePopupOpen}
            onClose={handlePopupClick}
          />
          <ImagePopup card={selectedCard} isOpen={isImagePopupOpen} onClose={handlePopupClick} />
        </ProtectedRoute>
      </Switch>

      <Footer />
    </CurrentUserProvider>
  );
}

export default App;
