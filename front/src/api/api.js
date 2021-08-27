import Api from '../classes/Api';
import { api } from '../utils/constants';

class Features extends Api {
  getUserInfo() {
    return this._customFetch(api.endpoints.users);
  }

  getInitialCards() {
    return this._customFetch(api.endpoints.cards);
  }

  editProfile = ({ name, about }) =>
    this._customFetch(api.endpoints.users, 'PATCH', {
      name,
      about,
    });

  addCard = (name, link) =>
    this._customFetch(api.endpoints.cards, 'POST', {
      name,
      link,
    });

  deleteCard = (cardId) => this._customFetch(`${api.endpoints.cards}/${cardId}`, 'DELETE');

  changeLikeCardStatus = (cardId, status) =>
    this._customFetch(`${api.endpoints.cards}/${cardId}/likes`, status ? 'PUT' : 'DELETE');

  updateAvatar = ({ avatar }) =>
    this._customFetch(`${api.endpoints.users}/avatar`, 'PATCH', {
      avatar,
    });
}

export default new Features();
