// Arquivo: src/components/dashboard/FaturasPagas.jsx

import React from 'react';
import { FaCheckCircle, FaEllipsisV } from 'react-icons/fa';

function FaturasPagas({ faturas }) {
  const formatarValor = (valor) => {
    return valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
  }

  return (
    <div className="faturas-list">
      {faturas.length === 0 && (
        <p className="nenhuma-fatura-msg">Nenhuma fatura paga encontrada.</p>
      )}

      {faturas.map((fatura) => (
        <div key={fatura.id} className="fatura-item fatura-paga-item">

          {/* << MODIFICAÇÃO: Linha Superior (APENAS Descrição) >> */}
          <div className="fatura-item-top-row">
            <div className="fatura-info">
              <p className="fatura-descricao fatura-descricao-paga">{fatura.descricao}</p>
            </div>
            {/* O valor foi movido para a linha de baixo */}
          </div>

          {/* << MODIFICAÇÃO: Linha Inferior (Valor e Botão Paga) >> */}
          <div className="fatura-item-bottom-row">
            <p className="fatura-valor">{formatarValor(fatura.valor)}</p> {/* << VALOR AQUI >> */}
            <button
              className="fatura-actions-btn status-paga-btn"
              title="Fatura Paga"
              disabled
            >
              <FaCheckCircle />
              <span>Paga</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FaturasPagas;
