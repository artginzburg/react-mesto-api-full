import { apiPath } from '../utils/pkg';

export const api = {
  domain: apiPath,
  endpoints: {
    users: 'users/me',
    cards: 'cards',
    signup: 'signup',
    signin: 'signin',
    signout: 'signout',
  },
};

export const paths = {
  login: '/login',
  register: '/register',
  main: '/',
};

export const pathNames = {
  login: {
    title: 'Вход',
    action: 'Войти',
  },
  register: {
    title: 'Регистрация',
    action: 'Зарегистрироваться',
  },
  quit: {
    action: 'Выйти',
  },
};
