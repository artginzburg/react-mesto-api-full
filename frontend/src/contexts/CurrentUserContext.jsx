import React from 'react';

import api from '../api/api';

const defaultUserState = {
  name: 'Неизвестный',
  about: 'Потеряно соединение с сервером',
};

const CurrentUserContext = React.createContext();
const CurrentUserDispatchContext = React.createContext();

function CurrentUserProvider({ state, dispatch, children }) {
  return (
    <CurrentUserContext.Provider value={state}>
      <CurrentUserDispatchContext.Provider value={dispatch}>
        {children}
      </CurrentUserDispatchContext.Provider>
    </CurrentUserContext.Provider>
  );
}

function useCurrentUser() {
  const context = React.useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider');
  }
  return context;
}

function useCurrentUserDispatcher() {
  const context = React.useContext(CurrentUserDispatchContext);
  if (context === undefined) {
    throw new Error('useCurrentUserDispatcher must be used within a CurrentUserProvider');
  }
  return context;
}

function objectsAreEqual(first, second) {
  return JSON.stringify(first) === JSON.stringify(second);
}

async function sendApiUpdate(dispatch, user, updates, func) {
  const expectedUser = { ...user, ...updates };
  dispatch(expectedUser);

  try {
    const updatedUser = await api[func](updates);
    if (!objectsAreEqual(expectedUser, updatedUser)) {
      dispatch(updatedUser);
    }
    return updatedUser;
  } catch (error) {
    dispatch(user);
    console.log('Couldnt update user information on the server', error);
    throw error; // Forwarding error
  }
}

export {
  defaultUserState,
  CurrentUserProvider,
  useCurrentUser,
  useCurrentUserDispatcher,
  sendApiUpdate,
};
