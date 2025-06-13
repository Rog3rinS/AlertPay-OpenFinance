import { FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import StoreContext from '../Store/context';
import './Login.css';
import { loginUser } from '../services/api';

function initialState() {
  return { email: '', password: '' };
}

const Login = () => {
  const [values, setValues] = useState(initialState);
  const { setToken } = useContext(StoreContext);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function onChange(event) {
    const { value, name } = event.target;
    setValues({ ...values, [name]: value });
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    try {
      const response = await loginUser(values);
      if (response && response.token) {
        setToken(response.token);
        localStorage.setItem('authToken', response.token);
        navigate('/dashboard');
      } else {
        setError(response.error || "Erro desconhecido ao logar.");
      }
    } catch (err) {
      setError("Falha ao conectar com o servidor ou credenciais inválidas.");
      console.error("Login error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      }
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page-wrapper">
      <div className='login-container'>
        <form onSubmit={onSubmit}>
          <h1>Acesse o AlertPay</h1>
          <div className='input-field'>
            <input type="email" placeholder='E-mail' name="email" onChange={onChange} value={values.email} />
            <FaUser className='icon' />
          </div>
          <div className='input-field'>
            {/* Usar o tipo de input baseado no estado showPassword */}
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Senha'
              name="password"
              onChange={onChange}
              value={values.password}
            />
            {/* Ícone de olho que alterna a visibilidade */}
            {showPassword ? (
              <FaEyeSlash className='icon password-toggle' onClick={togglePasswordVisibility} />
            ) : (
              <FaEye className='icon password-toggle' onClick={togglePasswordVisibility} />
            )}
            <FaLock className='icon' style={{ zIndex: 1 }} /> {/* Garante que o cadeado esteja por cima do olho se houver sobreposição */}
          </div>
          {error && <p className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}
          <div className="recall-forget">
            <label><input type="checkbox" />Lembre de mim</label>
            <a href="#">Esqueci a senha</a>
          </div>
          <button type="submit">Entrar</button>
          <div className="signup-link">
            <p>Não tem uma conta? <Link to="/register">Registrar</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
