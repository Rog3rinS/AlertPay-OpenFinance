// src/pages/LoginBancoPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUniversity, FaLandmark, FaBuilding, FaCity,
  FaEnvelope, FaLock, FaArrowLeft, FaTachometerAlt,
  FaEye, FaEyeSlash, FaTrashAlt
} from 'react-icons/fa';
import './Dashboard.css';
import { bankLogin, getConnectedBanks, removeBankLogin } from '../services/api';

// Mova a lista de todos os bancos para uma constante no topo para fácil referência
const ALL_BANKS_INFO = [
  { name: 'Banco Kroth', id: 'api-mini-bc', icon: FaLandmark, colorClass: 'icon-orange' },
  { name: 'Banco Kaiser', id: 'banco-central', icon: FaBuilding, colorClass: 'icon-red' },
  { name: 'Banco Biancon', id: 'bank-account-api', icon: FaCity, colorClass: 'icon-blue' },
  { name: 'Banco Lima', id: 'mini-banco-central', icon: FaUniversity, colorClass: 'icon-purple' },
];

const LoginBancoPage = () => {
  const navigate = useNavigate();
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [selectedBankName, setSelectedBankName] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Estados para gerenciar a lista de bancos conectados e o carregamento
  const [connectedBanks, setConnectedBanks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar os bancos conectados
  const fetchConnectedBanks = async () => {
    try {
      setLoading(true);
      // A API retorna um array de objetos, ex: [{ bank_id: 'api-mini-bc' }, ...]
      const connectedResult = await getConnectedBanks();

      // Mapeia os IDs retornados pela API para os detalhes completos (nome, ícone, cor)
      const connectedWithDetails = connectedResult.map(b =>
        ALL_BANKS_INFO.find(info => info.id === b.bank_id)
      ).filter(Boolean); // .filter(Boolean) remove qualquer item nulo caso um ID não seja encontrado

      setConnectedBanks(connectedWithDetails);
      setError(''); // Limpa erros antigos se a busca for bem-sucedida
    } catch (err) {
      console.error("Erro ao buscar bancos conectados:", err);
      setError("Não foi possível carregar suas conexões de banco.");
    } finally {
      setLoading(false);
    }
  };

  // Roda a busca de bancos conectados assim que o componente é montado
  useEffect(() => {
    fetchConnectedBanks();
  }, []);

  const handleRemoveBank = async (bankIdToRemove, bankNameToRemove) => {
    // Confirmação com o usuário antes de remover
    if (window.confirm(`Tem certeza que deseja remover a conexão com o ${bankNameToRemove}?`)) {
      try {
        await removeBankLogin(bankIdToRemove);
        alert(`${bankNameToRemove} foi desconectado com sucesso!`);
        // Atualiza a lista de bancos na tela
        fetchConnectedBanks();
      } catch (err) {
        console.error("Erro ao remover conexão do banco:", err);
        setError(err.response?.data?.error || "Falha ao remover a conexão do banco.");
      }
    }
  };

  const handleBankSelect = (bank) => {
    setSelectedBankId(bank.id);
    setSelectedBankName(bank.name);
    setError('');
    setSuccessMessage('');
  };

  const handleBackToSelection = () => {
    setSelectedBankId(null);
    setSelectedBankName(null);
    setEmail('');
    setPassword('');
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    const loginData = { email, password, bankId: selectedBankId };

    try {
      const response = await bankLogin(loginData);
      if (response && response.bankToken) {
        setSuccessMessage(`Login no ${selectedBankName} realizado com sucesso! Atualizando...`);
        // Após conectar, atualiza a lista de bancos e volta para a tela de seleção
        await fetchConnectedBanks();
        setTimeout(() => {
          handleBackToSelection();
        }, 1500);
      } else {
        setError(response.message || "Erro desconhecido ao conectar com o banco.");
      }
    } catch (err) {
      console.error("Erro ao fazer login no banco:", err);
      setError(err.response?.data?.message || "Credenciais inválidas ou erro no servidor do banco.");
    }
  };

  // Filtra a lista de todos os bancos para mostrar apenas os que AINDA NÃO foram conectados
  const availableBanksToConnect = ALL_BANKS_INFO.filter(
    bank => !connectedBanks.some(cb => cb.id === bank.id)
  );

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Gerenciamento de Bancos</h1>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
              <FaTachometerAlt />
              <span>Voltar ao Dashboard</span>
            </button>
          </div>
        </div>
      </header>
      <main className="dashboard-main" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="dashboard-card" style={{ maxWidth: '700px', width: '100%' }}>
          <div className="card-body">

            {!selectedBankId ? (
              // TELA DE SELEÇÃO DE BANCOS
              <div>
                <h2 className="form-title">Conectar Nova Instituição</h2>
                {loading ? (
                  <p className="nenhuma-conexao-msg">Carregando bancos disponíveis...</p>
                ) : availableBanksToConnect.length > 0 ? (
                  <div className="bank-selection-grid">
                    {availableBanksToConnect.map((bank) => (
                      <button key={bank.id} className="bank-card" onClick={() => handleBankSelect(bank)}>
                        <bank.icon className={`bank-card-icon ${bank.colorClass}`} />
                        <span className="bank-card-name">{bank.name}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="nenhuma-conexao-msg">Todos os bancos disponíveis já estão conectados.</p>
                )}

                <div className="connected-banks-section">
                  <h3 className="connected-banks-title">Bancos Já Conectados</h3>
                  {loading ? (
                    <p className="nenhuma-conexao-msg">Carregando conexões...</p>
                  ) : error ? (
                    <p className="error-message" style={{ textAlign: 'center' }}>{error}</p>
                  ) : connectedBanks.length > 0 ? (
                    <ul className="connected-bank-list">
                      {connectedBanks.map((bank) => (
                        <li key={bank.id} className="connected-bank-item">
                          <div className="connected-bank-info">
                            <bank.icon className={`bank-icon-small ${bank.colorClass}`} />
                            <span>{bank.name}</span>
                          </div>
                          <button onClick={() => handleRemoveBank(bank.id, bank.name)} className="remove-bank-btn">
                            <FaTrashAlt />
                            <span>Remover</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="nenhuma-conexao-msg">Nenhum banco conectado no momento.</p>
                  )}
                </div>
              </div>
            ) : (
              // TELA DE FORMULÁRIO DE LOGIN DO BANCO SELECIONADO
              <div>
                <div className="selected-bank-header">
                  <button onClick={handleBackToSelection} className="back-button"> <FaArrowLeft /> </button>
                  <FaUniversity className="bank-icon" />
                  <h2 className="form-title" style={{ marginBottom: 0 }}>Login - {selectedBankName}</h2>
                </div>
                <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">E-mail</label>
                    <div className="input-with-icon">
                      <FaEnvelope />
                      <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">Senha</label>
                    <div className="input-with-icon">
                      <FaLock />
                      <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle-btn">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>
                  {successMessage && <p className="success-message">{successMessage}</p>}
                  {error && <p className="error-message">{error}</p>}
                  <div className="form-actions">
                    <button type="button" onClick={handleBackToSelection} className="btn btn-secondary">Cancelar</button>
                    <button type="submit" className="btn btn-primary">Conectar</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginBancoPage;
