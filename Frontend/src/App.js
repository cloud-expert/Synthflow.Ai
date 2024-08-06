import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';

import { loadUser } from './action/authAction';
import RootRouter from './routes';
import store from './store';
import { AUTH_LOADING } from './action/types';

function App() {

  useEffect(() => {
    store.dispatch({
      type: AUTH_LOADING,
      payload: true
    });
    store.dispatch(loadUser());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Provider store={store}>
      <RootRouter />
      <ToastContainer position='top-center' autoClose={2000} />
    </Provider>
  );
}

export default App;
