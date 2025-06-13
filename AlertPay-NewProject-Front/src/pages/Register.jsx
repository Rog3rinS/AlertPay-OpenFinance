// src/pages/Register.jsx
import React, { useState } from 'react';
import { FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaIdCard, FaPhone } from 'react-icons/fa'; // Importar FaPhone
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { registerUser } from '../services/api';

const Register = () => {
  const [cpf, setCpf] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    try {
      const userData = { cpf, name, email, password };
      if (phone) {
        userData.phone = phone;
      }

      const response = await registerUser(userData);
      if (response && (response.cpf || response.email)) {
        alert('Conta criada com sucesso! Você será redirecionado para o login.');
        navigate('/login');
      } else {
        setError(response.error || "Erro desconhecido ao registrar.");
      }
    } catch (err) {
      setError("Falha ao conectar com o servidor ou erro no registro. Verifique a URL do backend e CORS.");
      console.error("Registration error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className='login-page-wrapper'>
      <div className='login-container'>
        <form onSubmit={handleSubmit}>
          <h1>Crie sua Conta</h1>
          <div className='input-field'>
            <input
              type="text"
              placeholder='CPF (apenas números)'
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              maxLength="11"
              required
            />
            <FaIdCard className='icon' />
          </div>
          <div className='input-field'>
            <input
              type="text"
              placeholder='Nome completo'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <FaUser className='icon' />
          </div>
          <div className='input-field'>
            <input
              type="email"
              placeholder='E-mail'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <FaEnvelope className='icon' />
          </div>
          {/* << NOVO CAMPO: Input para o Telefone >> */}
          <div className='input-field'>
            <input
              type="tel" // Tipo 'tel' para números de telefone
              placeholder='Telefone (opcional)'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <FaPhone className='icon' /> {/* Ícone para telefone */}
          </div>
          <div className='input-field'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Senha'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {showPassword ? (
              <FaEyeSlash className='icon password-toggle' onClick={togglePasswordVisibility} />
            ) : (
              <FaEye className='icon password-toggle' onClick={togglePasswordVisibility} />
            )}
            <FaLock className='icon' style={{ zIndex: 1 }} />
          </div>
          <div className='input-field'>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Confirme sua senha'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {showConfirmPassword ? (
              <FaEyeSlash className='icon password-toggle' onClick={toggleConfirmPasswordVisibility} />
            ) : (
              <FaEye className='icon password-toggle' onClick={toggleConfirmPasswordVisibility} />
            )}
            <FaLock className='icon' style={{ zIndex: 1 }} />
          </div>
          {error && <p className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}
          <button type="submit">Registrar</button>
          <div className="signup-link">
            <p>Já tem uma conta? <Link to="/login">Faça Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
