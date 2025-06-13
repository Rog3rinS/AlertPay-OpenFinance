// src/pages/AdicionarFaturaPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { addInvoice } from '../services/api';

const AdicionarFaturaPage = () => {
  const navigate = useNavigate();
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const novaFatura = {
      description: descricao,
      amount: parseFloat(valor),
      due_date: vencimento,
      origin: "Manual",
    };

    try {
      const response = await addInvoice(novaFatura);
      if (response && response.id) {
        alert('Fatura criada com sucesso!');
        navigate('/dashboard', { state: { newInvoiceAdded: true } });
      } else {
        setError(response.error || "Erro desconhecido ao adicionar fatura.");
      }
    } catch (err) {
      setError("Falha ao conectar com o servidor ou erro ao adicionar fatura.");
      console.error("Add invoice error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      }
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Adicionar Nova Fatura</h1>
          </div>
        </div>
      </header>
      <main className="dashboard-main" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="dashboard-card" style={{ maxWidth: '600px', width: '100%' }}>
          <div className="card-body">
            <form onSubmit={handleSubmit}>

              <div className="form-group">
                <label htmlFor="descricao" className="form-label">Descrição</label>
                <input
                  type="text"
                  id="descricao"
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="form-input"
                  placeholder="Ex: Fatura do Cartão de Crédito"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="valor" className="form-label">Valor (R$)</label>
                <input
                  type="number"
                  id="valor"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="form-input"
                  placeholder="150.75"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="vencimento" className="form-label">Data de Vencimento</label>
                <input
                  type="date"
                  id="vencimento"
                  value={vencimento}
                  onChange={(e) => setVencimento(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              {error && <p className="error-message" style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Salvar Fatura
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdicionarFaturaPage;
