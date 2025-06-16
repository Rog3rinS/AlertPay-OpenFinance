import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import './Login.css'; 

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Solicitação de recuperação para o e-mail:", email);
    alert('Se o e-mail estiver cadastrado, um link de recuperação será enviado!');
    navigate('/login'); 
  };

  return (
    <div className='login-page-wrapper'>
      <div className='login-container'>
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold">Recuperar Senha</h1>
            <p className="text-gray-400 mt-2">
              Digite seu e-mail para receber as instruções de como redefinir sua senha.
            </p>
          </div>

          <div className='input-field'>
            <input 
              type="email" 
              placeholder='Digite seu e-mail'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <FaEnvelope className='icon'/>
          </div>

          <button type="submit" className="btn-login mt-4">Enviar Link de Recuperação</button>

          <div className="signup-link">
            <Link to="/login" className="flex items-center justify-center gap-2">
              <FaArrowLeft />
              Voltar para o Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;