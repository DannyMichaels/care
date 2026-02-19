import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useStateValue } from '../context/CurrentUserContext';

export default function AuthenticatedRoute({ component: Component, ...rest }) {
  const [{ currentUser }] = useStateValue();
  const token = localStorage.getItem('authToken');

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!token) return <Redirect to="/login" />;
        if (currentUser && !currentUser.email_verified) {
          return <Redirect to={`/verify-email?email=${encodeURIComponent(currentUser.email)}`} />;
        }
        return <Component {...props} />;
      }}
    />
  );
}
