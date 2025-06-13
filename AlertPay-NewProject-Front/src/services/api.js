// src/services/api.js
import axios from 'axios';

const api = axios.create({
	baseURL: 'http://localhost:4000',
});

api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('authToken');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export const loginUser = async (credentials) => {
	const response = await api.post('/login', credentials);
	return response.data;
};

export const registerUser = async (userData) => {
	const response = await api.post('/users', userData);
	return response.data;
};

export const getInvoices = async (bankId) => {
	const params = bankId ? { bankId } : {};
	const response = await api.get('/invoices', { params });
	return response.data;
};

export const addInvoice = async (invoiceData) => {
	const response = await api.post('/invoices', invoiceData);
	return response.data;
};

export const updateInvoice = async (id, updateData) => {
	const response = await api.put(`/invoices/${id}`, updateData);
	return response.data;
};

export const deleteInvoice = async (id) => {
	const response = await api.delete(`/invoices/${id}`);
	return response.data;
};

export const getManualInvoices = async () => {
	const response = await api.get('/invoices/manual');
	return response.data;
};

export const bankLogin = async (loginData) => {
	const response = await api.post('/bank-login', loginData);
	return response.data;
};

/**
 * REMOVIDO: Remove a autenticação (token) de um banco específico para o usuário logado.
 * @param {string} bankId - O ID do banco a ser desconectado.
 * @returns {Promise<any>} - A resposta da API.
 */
export const removeBankLogin = async (bankId) => {
	const response = await api.delete(`/bank-rm-login/${bankId}`);
	return response.data;
};

/**
 * ADICIONADO: Busca a lista de bancos aos quais o usuário já está conectado.
 * @returns {Promise<any>} - A resposta da API, esperando uma lista de bancos conectados.
 */
export const getConnectedBanks = async () => {
	// Nota: Esta função assume que você criará um endpoint GET /bank-logins no seu backend.
	const response = await api.get('/bank-logins');
	return response.data;
};
