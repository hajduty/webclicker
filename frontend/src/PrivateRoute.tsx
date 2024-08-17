import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';

interface PrivateRouteProps {
  element: React.ReactElement;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { authenticated } = useAuth();

  return authenticated ? element : <Navigate to="/" />;
};

export default PrivateRoute;
