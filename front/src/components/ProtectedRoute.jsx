import { Route, Redirect } from 'react-router-dom';

import { paths } from '../utils/constants';

const ProtectedRoute = (props) => (
  <Route>{props.loggedIn ? props.children : <Redirect to={paths.login} />}</Route>
);
export default ProtectedRoute;
