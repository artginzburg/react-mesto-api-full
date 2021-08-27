import { memo } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { paths } from '../utils/constants';

import { parseFixedLocalBase64Value } from '../hooks/useStateWithBase64';
import useValidatedForm from '../hooks/useValidatedForm';

import Login from './Login';
import Register from './Register';

const Authentication = memo((props) => {
  const form = useValidatedForm({
    email: parseFixedLocalBase64Value('email') ?? '',
    password: '',
  });

  return props.loggedIn ? (
    <Redirect to={paths.main} />
  ) : (
    <>
      <Route path={paths.login}>
        <Login handleSubmit={props.handleLogin} form={form} />
      </Route>
      <Route path={paths.register}>
        <Register handleSubmit={props.handleRegister} form={form} />
      </Route>
    </>
  );
});

export default Authentication;
