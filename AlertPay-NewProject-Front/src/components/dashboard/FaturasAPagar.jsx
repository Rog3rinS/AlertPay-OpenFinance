
import React from 'react';
import { FaExclamationCircle, FaCheck } from 'react-icons/fa';

function FaturasAPagar({ faturas, onMarcarComoPaga }) {

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  const formatarValor = (valor) => {
    return valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
  }

  return (
    <div className="faturas-list">
      {/* Adicionamos uma mensagem para quando a lista estiver vazia */}
      {faturas.length === 0 && (
        <p className="nenhuma-fatura-msg">Nenhuma fatura a pagar no momento. Ótimo trabalho!</p>
      )}

      {faturas.map((fatura) => (
        <div key={fatura.id} className="fatura-item">

          <div className="fatura-info">
            <p className="fatura-descricao">{fatura.descricao}</p>
            <p className="fatura-vencimento">
              Vencimento: {formatarData(fatura.vencimento)}
            </p>
          </div>

          <div className="fatura-details">
            {fatura.status === 'Atrasada' && (
              <div className="fatura-status status-atrasada">
                <FaExclamationCircle />
                <span>{fatura.status}</span>
              </div>
            )}

            <p className="fatura-valor">{formatarValor(fatura.valor)}</p>

            {/* 3. BOTÃO MODIFICADO: Ícone de Check e o onClick que chama a função do pai */}
            <button
              className="fatura-actions-btn btn-pagar"
              title="Marcar como Paga"
              onClick={() => onMarcarComoPaga(fatura.id)}
            >
              <FaCheck />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FaturasAPagar;
