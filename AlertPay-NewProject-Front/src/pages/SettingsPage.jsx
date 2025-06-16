

import React, { useState, useEffect } from 'react';
import { FaCog, FaTrashAlt, FaBell } from 'react-icons/fa';
import './Dashboard.css';
// Importa as funções da sua API
import { getUserNotificationRules, addUserNotificationRule, deleteUserNotificationRule } from '../services/api';

const SettingsPage = () => {
  // Estado para a lista de regras, inicializado como um array vazio
  const [rules, setRules] = useState([]);

  // Estados para os campos do formulário de nova regra
  const [daysBefore, setDaysBefore] = useState(3);
  const [minAmount, setMinAmount] = useState(0);
  const [type, setType] = useState('email');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Função para buscar as regras da API e atualizar o estado
  const fetchRules = async () => {
    try {
      const fetchedRules = await getUserNotificationRules();
      setRules(fetchedRules);
    } catch (err) {
      console.error('Erro ao buscar regras:', err);
      setError('Não foi possível carregar as regras existentes.');
    }
  };

  // useEffect para buscar os dados da API quando o componente é montado
  useEffect(() => {
    fetchRules();
  }, []);

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
      // Chama a função da API para adicionar uma nova regra
      await addUserNotificationRule(newRule);

      setSuccess('Nova regra de notificação salva com sucesso!');

      // Limpa o formulário
      setDaysBefore(3);
      setMinAmount(0);
      setType('email');

      // Atualiza a lista de regras para exibir a nova regra
      fetchRules();

    } catch (err) {
      console.error('Erro ao criar regra:', err);
      setError(err.response?.data?.error || 'Não foi possível salvar a nova regra.');
    }
  };

  const handleRemoveRule = async (ruleId) => {
    // Confirmação antes de remover
    if (window.confirm('Tem certeza que deseja remover esta regra?')) {
      try {
        // Chama a função da API para deletar a regra
        await deleteUserNotificationRule(ruleId);
        setSuccess('Regra removida com sucesso.');
        // Atualiza a lista de regras na tela
        fetchRules();
      } catch (err) {
        console.error('Erro ao remover regra:', err);
        setError(err.response?.data?.error || 'Não foi possível remover a regra.');
      }
    }
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
              {rules.length > 0 ? (
                rules.map(rule => (
                  <div key={rule.id} className="rule-item">
                    <span>
                      Notificar por <strong>{rule.type}</strong>, <strong>{rule.days_before}</strong> dias antes, para contas acima de <strong>R$ {rule.min_amount.toFixed(2)}</strong>.
                    </span>
                    <button onClick={() => handleRemoveRule(rule.id)} className="remove-rule-btn">
                      <FaTrashAlt />
                    </button>
                  </div>
                ))
              ) : (
                <p>Nenhuma regra de notificação cadastrada.</p>
              )}
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
              {error && <p className="error-message" style={{ textAlign: 'center', marginTop: '1rem' }}>{error}</p>}
              {success && <p className="success-message" style={{ textAlign: 'center', marginTop: '1rem' }}>{success}</p>}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
