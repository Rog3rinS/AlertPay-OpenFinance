import React, { useState, useEffect } from 'react';
import FaturasAPagar from '../components/dashboard/FaturasAPagar';
import { FaPlus, FaFileInvoiceDollar, FaCheckCircle, FaCalendarAlt, FaUniversity as FaBankIcon } from 'react-icons/fa';
import './Dashboard.css';
import FaturasPagas from '../components/dashboard/FaturasPagas';
import CalendarioFaturas from '../components/dashboard/CalendarioFaturas';
import { useNavigate, useLocation } from 'react-router-dom';
import { getInvoices, updateInvoice, getManualInvoices } from '../services/api';

const INITIAL_FILTER_OPTIONS = [
  { id: 'all-banks', name: 'Todos os Bancos' },
  { id: 'manual', name: 'Faturas Manuais' },
];
const ALL_POSSIBLE_BANKS = [
  { id: 'api-mini-bc', name: 'Banco Kroth' },
  { id: 'banco-central', name: 'Banco Kaiser' },
  { id: 'bank-account-api', name: 'Banco Biancon' },
  { id: 'mini-banco-central', name: 'Banco Lima' },
];


function Dashboard({ onLogout }) {
  const [todasAsFaturas, setTodasAsFaturas] = useState([]);
  const [filteredFaturas, setFilteredFaturas] = useState([]);
  const [selectedBankFilter, setSelectedBankFilter] = useState('all-banks');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [dynamicFilterOptions, setDynamicFilterOptions] = useState(INITIAL_FILTER_OPTIONS);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchAndAggregateInvoices = async (showLoadingIndicator = true) => {
    if (showLoadingIndicator) {
      setLoading(true);
    }
    setFetchError('');

    try {
      const bankIdsToFetch = ALL_POSSIBLE_BANKS
        .filter(option => option.id !== 'all-banks' && option.id !== 'manual')
        .map(option => option.id);

      const successfullyFetchedBankIds = new Set();
      let aggregatedInvoices = [];

      const fetchExternalBankPromises = bankIdsToFetch.map(async (bankId) => {
        try {
          const bankInvoices = await getInvoices(bankId);
          if (bankInvoices && bankInvoices.length > 0) {
            successfullyFetchedBankIds.add(bankId);
            return bankInvoices.map(invoice => ({
              id: invoice.id || invoice._id,
              descricao: invoice.description || invoice.descricao,
              valor: invoice.amount || invoice.valor,
              vencimento: invoice.due_date || invoice.dueDate || invoice.vencimento,
              status: invoice.status,
              bankId: bankId,
              origin: bankId,
            }));
          }
          return [];
        } catch (error) {
          console.warn(`Não foi possível buscar faturas do banco ${bankId}:`, error.response?.data?.error || error.message);
          return [];
        }
      });

      const externalBankInvoices = (await Promise.all(fetchExternalBankPromises)).flat();
      // << FIM DA BUSCA DE FATURAS DE BANCOS EXTERNOS >>


      // << INÍCIO DA BUSCA DE FATURAS MANUAIS >>
      let manualInvoices = [];
      try {
        const fetchedManualInvoices = await getManualInvoices();
        if (fetchedManualInvoices && fetchedManualInvoices.length > 0) {
          manualInvoices = fetchedManualInvoices.map(invoice => ({
            id: invoice.id || invoice._id,
            descricao: invoice.description || invoice.descricao,
            valor: invoice.amount || invoice.valor,
            vencimento: invoice.due_date || invoice.dueDate || invoice.vencimento,
            status: invoice.status,
            bankId: 'manual',
            origin: 'Manual',
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar faturas manuais:", error.response?.data?.error || error.message);
      }
      // << FIM DA BUSCA DE FATURAS MANUAIS >>


      // << COMBINA TODAS AS FATURAS >>
      aggregatedInvoices = [...manualInvoices, ...externalBankInvoices];
      setTodasAsFaturas(aggregatedInvoices);
      setFetchError('');

      const newDynamicOptions = [...INITIAL_FILTER_OPTIONS];
      successfullyFetchedBankIds.forEach(bankId => {
        const bankInfo = ALL_POSSIBLE_BANKS.find(bank => bank.id === bankId);
        if (bankInfo) {
          newDynamicOptions.push(bankInfo);
        }
      });
      setDynamicFilterOptions(newDynamicOptions);

      if (!newDynamicOptions.some(option => option.id === selectedBankFilter)) {
        setSelectedBankFilter('all-banks');
      }

    } catch (error) {
      console.error("Erro geral ao buscar todas as faturas:", error);
      setFetchError("Erro ao carregar faturas. Tente novamente.");
      if (error.response && error.response.status === 401) {
        onLogout();
      }
    } finally {
      if (showLoadingIndicator) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Verifica se o estado de navegação indica que uma nova fatura foi adicionada
    if (location.state && location.state.newInvoiceAdded) {
      fetchAndAggregateInvoices(true); // Dispara a busca imediata com indicador de loading
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      fetchAndAggregateInvoices(true); // Se não, faz a busca inicial normal
    }
  }, [onLogout, location.state]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchAndAggregateInvoices(false);
    }, 60000);

    return () => clearInterval(intervalId);
  }, [onLogout]);

  useEffect(() => {
    if (selectedBankFilter === 'all-banks') {
      setFilteredFaturas(todasAsFaturas);
    } else if (selectedBankFilter === 'manual') {
      setFilteredFaturas(todasAsFaturas.filter(fatura => fatura.origin === 'Manual'));
    } else {
      setFilteredFaturas(todasAsFaturas.filter(fatura => fatura.bankId === selectedBankFilter));
    }
  }, [selectedBankFilter, todasAsFaturas]);


  async function marcarComoPaga(faturaId) {
    try {
      // Atualiza localmente (experiência rápida)
      const updatedTodasFaturas = todasAsFaturas.map(fatura =>
        fatura.id === faturaId ? { ...fatura, status: 'Paga' } : fatura
      );
      setTodasAsFaturas(updatedTodasFaturas);

      // Atualiza no backend
      await updateInvoice(faturaId, { status: 'Paga' });

      alert('Fatura marcada como paga com sucesso!');

      // Refetch para garantir sincronização
      fetchAndAggregateInvoices(false);

    } catch (error) {
      console.error("Erro ao marcar fatura como paga:", error);
      alert('Erro ao marcar fatura como paga. Tente novamente.');
      fetchAndAggregateInvoices(true);
      if (error.response && error.response.status === 401) {
        onLogout();
      }
    }
  }

  const faturasAPagar = filteredFaturas.filter(f => f.status !== 'Paga');
  const faturasPagas = filteredFaturas.filter(f => f.status === 'Paga');

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>AlertPay Dashboard</h1>
          </div>
          <div className="header-actions">
            <button className="btn btn-tertiary" onClick={() => navigate('/login-banco')} style={{ marginRight: '10px' }}>
              <FaBankIcon style={{ marginRight: '5px' }} />
              <span>Meus Bancos</span>
            </button>

            <div className="bank-filter-container" style={{ marginRight: '10px' }}>
              <label htmlFor="bankSelect" className="bank-filter-label">Ver:</label>
              <select
                id="bankSelect"
                value={selectedBankFilter}
                onChange={(e) => setSelectedBankFilter(e.target.value)}
                className="custom-select-dashboard"
              >
                {dynamicFilterOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>

            <button className="btn btn-primary" onClick={() => navigate('/adicionar-fatura')}>
              <FaPlus />
              <span>Nova Fatura</span>
            </button>
            <button className="btn btn-secondary" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        {loading && <p style={{ textAlign: 'center', color: 'white' }}>Carregando faturas...</p>}
        {fetchError && <p className="error-message" style={{ textAlign: 'center', color: 'red' }}>{fetchError}</p>}

        {!loading && !fetchError && (
          <div className="dashboard-grid">

            <section className="dashboard-card card-faturas-a-pagar">
              <div className="card-header">
                <FaFileInvoiceDollar className="card-header-icon icon-blue" />
                <h2>Faturas a Pagar</h2>
              </div>
              <div className="card-body">
                {faturasAPagar.length > 0 ? (
                  <FaturasAPagar
                    faturas={faturasAPagar}
                    onMarcarComoPaga={marcarComoPaga}
                  />
                ) : (
                  <p style={{ textAlign: 'center', color: '#ccc' }}>Nenhuma fatura a pagar encontrada.</p>
                )}
              </div>
            </section>

            <section className="dashboard-card card-faturas-pagas">
              <div className="card-header">
                <FaCheckCircle className="card-header-icon icon-green" />
                <h2>Faturas Pagas</h2>
              </div>
              <div className="card-body">
                {faturasPagas.length > 0 ? (
                  <FaturasPagas faturas={faturasPagas} />
                ) : (
                  <p style={{ textAlign: 'center', color: '#ccc' }}>Nenhuma fatura paga encontrada.</p>
                )}
              </div>
            </section>

            <section className="dashboard-card card-calendario">
              <div className="card-header">
                <FaCalendarAlt className="card-header-icon icon-indigo" />
                <h2>Calendário</h2>
              </div>
              <div className="card-body">
                {filteredFaturas.length > 0 ? (
                  <CalendarioFaturas faturas={filteredFaturas} />
                ) : (
                  <p style={{ textAlign: 'center', color: '#ccc' }}>Nenhum evento no calendário para o filtro atual.</p>
                )}
              </div>
            </section>

          </div>
        )}

        {!loading && filteredFaturas.length === 0 && !fetchError && (
          <p style={{ textAlign: 'center', color: 'white', marginTop: '20px' }}>
            Você ainda não possui faturas. Conecte um banco ou adicione uma fatura manual!
          </p>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
