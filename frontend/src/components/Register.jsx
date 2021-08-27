import { memo } from 'react';
import { Link } from 'react-router-dom';

import { paths, pathNames } from '../utils/constants';

import LoginOrRegister from './LoginOrRegister';

const defaultProps = {
  passwordAutocomplete: 'new-password',
  title: pathNames.register.title,
  buttonTitle: pathNames.register.action,
  buttonSavingTitle: pathNames.register.title,
};

const Register = memo((props) => (
  <LoginOrRegister {...props} {...defaultProps}>
    <div className="auth__signin">
      Уже зарегистрированы?{' '}
      <Link to={paths.login} className="auth__login-link">
        {pathNames.login.action}
      </Link>
    </div>
  </LoginOrRegister>
));

export default Register;
