import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import { PreferencesContext } from '../../context/PreferencesContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { preferences } = useContext(PreferencesContext);

  return (
    <Route
      {...rest}
      render={(props) =>
        !preferences.userName ? (
          <Redirect
            to={{
              pathname: '/',
              //   state: { room: roomName },
            }}
          />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default ProtectedRoute;
