import { api } from '../utils/constants';

export default class Api {
  constructor(options = {}) {
    this._baseUrl = options.baseUrl ?? api.domain.origin;
    this._headers = options.headers;
  }

  _handleFetch = (res) => (res.ok ? res.json() : Promise.reject(res.statusText));

  _handleData = (result) => result.data ?? result;

  _customFetch(target, method, body) {
    const options = {
      headers: this._headers ?? {},
      credentials: 'include',
    };

    if (method && method !== 'GET') {
      options.method = method;
      if (method !== 'DELETE') {
        options.headers['Content-Type'] = 'application/json';
      }
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    return fetch(`${this._baseUrl}/${target}`, options)
      .then(this._handleFetch)
      .then(this._handleData);
  }
}
