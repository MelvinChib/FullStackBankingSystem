// API Service for MelvinBank Zambia Frontend
// Prefer Vite env (VITE_API_URL), fallback to CRA-style (REACT_APP_API_URL), then default localhost
const API_BASE_URL = (typeof import !== 'undefined' && import.meta && import.meta.env && import.meta.env.VITE_API_URL)
  || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL)
  || 'http://localhost:8080/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication APIs
  async register(userData) {
    return this.apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials) {
    const response = await this.apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response.accessToken) {
      localStorage.setItem('authToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.apiCall('/auth/me');
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  // Account Management APIs
  async createAccount(accountData) {
    return this.apiCall('/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData)
    });
  }

  async getUserAccounts() {
    return this.apiCall('/accounts');
  }

  async getAccountById(accountId) {
    return this.apiCall(`/accounts/${accountId}`);
  }

  async updateAccount(accountId, accountData) {
    return this.apiCall(`/accounts/${accountId}`, {
      method: 'PUT',
      body: JSON.stringify(accountData)
    });
  }

  async deleteAccount(accountId) {
    return this.apiCall(`/accounts/${accountId}`, {
      method: 'DELETE'
    });
  }

  // Statement Export APIs
  async exportStatementPDF(accountId, fromDate, toDate) {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    
    const response = await fetch(`${this.baseURL}/accounts/${accountId}/statement/pdf?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    });
    
    if (!response.ok) {
      throw new Error('Failed to export PDF statement');
    }
    
    return response.blob();
  }

  async exportStatementCSV(accountId, fromDate, toDate) {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    
    const response = await fetch(`${this.baseURL}/accounts/${accountId}/statement/csv?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    });
    
    if (!response.ok) {
      throw new Error('Failed to export CSV statement');
    }
    
    return response.text();
  }

  async exportStatementText(accountId, fromDate, toDate) {
    const params = new URLSearchParams();
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    
    const response = await fetch(`${this.baseURL}/accounts/${accountId}/statement/text?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    });
    
    if (!response.ok) {
      throw new Error('Failed to export Text statement');
    }
    
    return response.text();
  }

  // Customer Support APIs
  async sendSupportMessage(messageData) {
    return this.apiCall('/customer-support/chat', {
      method: 'POST',
      body: JSON.stringify(messageData)
    });
  }

  async getSupportCategories() {
    return this.apiCall('/customer-support/categories');
  }

  async getQuickHelpTopics() {
    return this.apiCall('/customer-support/quick-help');
  }

  // Utility methods
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  getCurrentUserData() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  // Download helper for file exports
  downloadFile(content, filename, contentType = 'application/octet-stream') {
    const blob = content instanceof Blob ? content : new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export default new ApiService();
export { API_BASE_URL };