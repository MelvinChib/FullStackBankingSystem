// API Service for MelvinBank Zambia Frontend
// Prefer Vite env (VITE_API_URL), fallback to CRA-style (REACT_APP_API_URL), then default localhost
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta && import.meta.env && import.meta.env.VITE_API_URL)
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
    try {
      const response = await this.apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
      
      if (response.accessToken) {
        localStorage.setItem('authToken', response.accessToken);
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      return response;
    } catch (err) {
      // Optional demo fallback when backend is unavailable
      const enableDemo = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_ENABLE_DEMO)
        || (typeof process !== 'undefined' && process?.env?.VITE_ENABLE_DEMO);

      const isDemoEnabled = enableDemo === true || enableDemo === 'true';
      const demoEmail = import.meta?.env?.VITE_DEMO_EMAIL || process?.env?.VITE_DEMO_EMAIL;
      const demoPassword = import.meta?.env?.VITE_DEMO_PASSWORD || process?.env?.VITE_DEMO_PASSWORD;
      const isDemoCreds = demoEmail && demoPassword && credentials?.email === demoEmail && credentials?.password === demoPassword;

      if (isDemoEnabled && isDemoCreds) {
        const mock = {
          accessToken: `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          user: {
            id: `demo-user-${Date.now()}`,
            name: import.meta?.env?.VITE_DEMO_USER_NAME || process?.env?.VITE_DEMO_USER_NAME || 'Demo User',
            email: credentials?.email,
            roles: ['USER']
          }
        };
        localStorage.setItem('authToken', mock.accessToken);
        localStorage.setItem('user', JSON.stringify(mock.user));
        return mock;
      }

      throw err;
    }
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
    try {
      return await this.apiCall('/accounts');
    } catch (err) {
      const enableDemo = import.meta?.env?.VITE_ENABLE_DEMO === 'true';
      if (enableDemo && this.isAuthenticated()) {
        return [
          {
            id: 1,
            accountNumber: 'SWB1234567890',
            accountType: 'CHECKING',
            accountName: 'Main Checking',
            balance: 5420.50,
            currency: 'USD',
            status: 'ACTIVE'
          },
          {
            id: 2,
            accountNumber: 'SWB0987654321',
            accountType: 'SAVINGS',
            accountName: 'Savings Account',
            balance: 12500.00,
            currency: 'USD',
            status: 'ACTIVE'
          }
        ];
      }
      throw err;
    }
  }

  async getAccountById(accountId) {
    try {
      return await this.apiCall(`/accounts/${accountId}`);
    } catch (err) {
      const enableDemo = import.meta?.env?.VITE_ENABLE_DEMO === 'true';
      if (enableDemo && this.isAuthenticated()) {
        return {
          id: accountId,
          accountNumber: `SWB${accountId}234567890`,
          accountType: 'CHECKING',
          accountName: 'Demo Account',
          balance: 5420.50,
          currency: 'USD',
          status: 'ACTIVE',
          transactions: [
            { id: 1, date: new Date().toISOString(), description: 'Demo Transaction 1', amount: -50.00, type: 'DEBIT' },
            { id: 2, date: new Date().toISOString(), description: 'Demo Transaction 2', amount: 100.00, type: 'CREDIT' }
          ]
        };
      }
      throw err;
    }
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

  // Mobile Money APIs
  async sendMobileMoneyTransfer(payload) {
    try {
      return await this.apiCall('/mobile-money/transfer', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (err) {
      // Optional demo fallback when backend is unavailable
      const enableDemo = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_ENABLE_DEMO)
        || (typeof process !== 'undefined' && process?.env?.VITE_ENABLE_DEMO);
      const isDemoEnabled = enableDemo === true || enableDemo === 'true';
      if (isDemoEnabled) {
        return {
          status: 'success',
          transactionId: `demo-tx-${Math.random().toString(36).slice(2, 10)}`,
          ...payload,
        };
      }
      throw err;
    }
  }

  async buyAirtime(payload) {
    try {
      return await this.apiCall('/mobile-money/airtime', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    } catch (err) {
      const enableDemo = (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_ENABLE_DEMO)
        || (typeof process !== 'undefined' && process?.env?.VITE_ENABLE_DEMO);
      const isDemoEnabled = enableDemo === true || enableDemo === 'true';
      if (isDemoEnabled) {
        return {
          status: 'success',
          topupId: `demo-airtime-${Math.random().toString(36).slice(2, 10)}`,
          ...payload,
        };
      }
      throw err;
    }
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