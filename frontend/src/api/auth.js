import Api from '../classes/Api';
import { api } from '../utils/constants';

class Auth extends Api {
  register(email, password) {
    return this._customFetch(api.endpoints.signup, 'POST', { password, email });
  }

  login(email, password) {
    return this._customFetch(api.endpoints.signin, 'POST', { password, email });
  }

  logout() {
    return this._customFetch(api.endpoints.signout, 'DELETE');
  }

  getUserInfo() {
    return this._customFetch(api.endpoints.users);
  }
}

export default new Auth();
