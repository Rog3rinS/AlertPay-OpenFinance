// src/pages/SettingsPage.jsx

import React, { useState, _useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCog, FaTrashAlt, FaBell } from 'react-icons/fa';
import './Dashboard.css';

// Dados mocados para as regras existentes. No futuro, virão de um GET /user-rules
const mockRules = [
  { id: 1, days_before: 5, min_amount: 500, type: 'email' },
  { id: 2, days_before: 2, min_amount: 0, type: 'push' },
];

const SettingsPage = () => {
  const _navigate = useNavigate();
  
  // Estado para a lista de regras
  const [rules, setRules] = useState(mockRules);
  
  // Estados para os campos do novo formulário de regra
  const [daysBefore, setDaysBefore] = useState(3);
  const [minAmount, setMinAmount] = useState(0);
  const [type, setType] = useState('email');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const newRule = {
      days_before: parseInt(daysBefore, 10),
      min_amount: parseFloat(minAmount),
      type,
    };

    try {
      // --- A INTEGRAÇÃO REAL ACONTECE AQUI ---
      // Substitua a URL pela URL real da sua API
      const response = await axios.post('http://localhost:4000/api/user-rules', newRule); 
      
      console.log('Regra criada com sucesso:', response.data);
      
      // Adiciona a nova regra à lista na tela (simulação)
      setRules(currentRules => [...currentRules, { ...newRule, id: Date.now() }]);
      setSuccess('Nova regra de notificação salva com sucesso!');

    } catch (err) {
      console.error('Erro ao criar regra:', err);
      setError(err.response?.data?.message || 'Não foi possível salvar a nova regra.');
    }
  };

  const handleRemoveRule = (ruleId) => {
    // Lógica para remover a regra (chamada DELETE para a API no futuro)
    setRules(currentRules => currentRules.filter(rule => rule.id !== ruleId));
    alert(`Regra ${ruleId} removida (simulação).`);
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1><FaCog /> Configurações</h1>
          </div>
        </div>
      </header>
      <main className="dashboard-main" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="dashboard-card" style={{ maxWidth: '800px', width: '100%' }}>
          <div className="card-header">
            <FaBell className="card-header-icon icon-indigo" />
            <h2>Regras de Notificação</h2>
          </div>
          <div className="card-body">
            {/* Seção para listar as regras existentes */}
            <div className="rules-list">
              {rules.map(rule => (
                <div key={rule.id} className="rule-item">
                  <span>
                    Notificar por <strong>{rule.type}</strong>, <strong>{rule.days_before}</strong> dias antes, para contas acima de <strong>R$ {rule.min_amount.toFixed(2)}</strong>.
                  </span>
                  <button onClick={() => handleRemoveRule(rule.id)} className="remove-rule-btn">
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>

            {/* Seção para adicionar nova regra */}
            <form onSubmit={handleSubmit} className="add-rule-form">
              <h3 className="form-title-small">Adicionar Nova Regra</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="days_before" className="form-label">Notificar com (dias de antecedência)</label>
                  <input type="number" id="days_before" value={daysBefore} onChange={e => setDaysBefore(e.target.value)} className="form-input" min="0" />
                </div>
                <div className="form-group">
                  <label htmlFor="min_amount" className="form-label">Para contas acima de (R$)</label>
                  <input type="number" id="min_amount" value={minAmount} onChange={e => setMinAmount(e.target.value)} className="form-input" min="0" step="0.01" />
                </div>
                <div className="form-group">
                  <label htmlFor="type" className="form-label">Através de</label>
                  <select id="type" value={type} onChange={e => setType(e.target.value)} className="form-select">
                    <option value="email">E-mail</option>
                    <option value="push">Notificação Push</option>
                    <option value="sms">SMS</option>
                  </select>
                </div>
                <div className="form-group-submit">
                  <button type="submit" className="btn btn-primary">Salvar Regra</button>
                </div>
              </div>
              {error && <p className="error-message" style={{textAlign: 'center', marginTop: '1rem'}}>{error}</p>}
              {success && <p className="success-message" style={{textAlign: 'center', marginTop: '1rem'}}>{success}</p>}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;