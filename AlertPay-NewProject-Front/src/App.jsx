import { useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import StoreContext from './Store/context';
import ProtectedRoute from './components/ProtectedRoutes';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import AdicionarFaturaPage from './pages/AdicionarFaturasPage';
import LoginBancoPage from './pages/LoginBancoPage';
//import './App.css'; 

function App() {

  const { setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  function handleLogout() {
    setToken(null);
    navigate('/login');
  }

  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Login />} />

      {/* Rotas Protegidas aninhadas dentro do ProtectedRoute */}
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={<Dashboard onLogout={handleLogout} />}
        />
        <Route
          path="/adicionar-fatura"
          element={<AdicionarFaturaPage />}
        />
        <Route
          path="/login-banco"
          element={<LoginBancoPage />}
        />
      </Route>
    </Routes>
  );
}

export default App;
