const isDefaultLocalhost = window.location.host === 'localhost';

export default function checkLocalHost() {
  return (
    isDefaultLocalhost &&
    (function () {
      const { NODE_ENV, REACT_APP_LOCAL_HOST } = process.env;
      const NODE_ENV_IS_DEV = NODE_ENV === 'development';

      if (NODE_ENV_IS_DEV && REACT_APP_LOCAL_HOST) {
        return (window.location.host = REACT_APP_LOCAL_HOST);
      }
    })()
  );
}
