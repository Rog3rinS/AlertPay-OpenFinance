// Dentro de src/components/ProtectedRoute.jsx

import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import StoreContext from '../Store/context'; // <-- VERIFIQUE SE ESTE CAMINHO ESTÁ CORRETO

const ProtectedRoute = () => {
  const { token } = useContext(StoreContext);
  const location = useLocation();

  console.log('%cPROTECTED ROUTE: Verificando acesso. Token atual:', 'color: orange; font-weight: bold;', token);

  if (!token) {
    // Se não há token, redireciona o usuário para a página de login.
    // O 'state' guarda a página que o usuário tentou acessar, para que
    // possamos redirecioná-lo de volta para lá após o login.
     console.log('%cPROTECTED ROUTE: Acesso NEGADO. Redirecionando para /login.', 'color: red;');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se há um token, <Outlet /> renderiza a rota filha que está sendo
  // protegida (no seu caso, o componente Dashboard).
  console.log('%cPROTECTED ROUTE: Acesso PERMITIDO.', 'color: green;');
  return <Outlet />;
};

export default ProtectedRoute;