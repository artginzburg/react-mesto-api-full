import { memo } from 'react';

import { pathNames } from '../utils/constants';

import LoginOrRegister from './LoginOrRegister';

const defaultProps = {
  passwordAutocomplete: 'current-password',
  title: pathNames.login.title,
  buttonTitle: pathNames.login.action,
  buttonSavingTitle: pathNames.login.title,
};

const Login = memo((props) => <LoginOrRegister {...props} {...defaultProps} />);

export default Login;
