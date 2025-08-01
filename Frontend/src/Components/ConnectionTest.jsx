import { useState, useEffect } from 'react';
import axios from '../api/axios';

const ConnectionTest = () => {
  const [backendStatus, setBackendStatus] = useState('Testing...');
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      console.log('Testing connection to:', 'http://localhost:5000/api');
      
      // Test the public sessions endpoint
      const response = await axios.get('/sessions');
      console.log('Response:', response);
      
      setBackendStatus('✅ Connected');
      setApiResponse(response.data);
      setError(null);
    } catch (err) {
      console.error('Connection test failed:', err);
      setBackendStatus('❌ Failed');
      setError(err.message);
      setApiResponse(null);
    }
  };

  const testAuth = async () => {
    try {
      // Test registration
      const testUser = {
        email: `test_${Date.now()}@example.com`,
        password: 'testpassword123'
      };

      const registerResponse = await axios.post('/auth/register', testUser);
      console.log('Register response:', registerResponse);

      // Test login
      const loginResponse = await axios.post('/auth/login', testUser);
      console.log('Login response:', loginResponse);

      if (loginResponse.data.token) {
        setBackendStatus('✅ Connected & Auth Working');
        setApiResponse({
          register: registerResponse.data,
          login: { tokenReceived: true }
        });
      }
    } catch (err) {
      console.error('Auth test failed:', err);
      setError(err.response?.data?.msg || err.message);
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f5f5f5', 
      margin: '20px', 
      borderRadius: '8px',
      border: '2px solid #ddd'
    }}>
      <h2 style={{ marginTop: 0, color: '#333' }}>🔧 Backend Connection Test</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <strong>Backend Status:</strong> {backendStatus}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <strong>API Base URL:</strong> {axios.defaults.baseURL || 'http://localhost:5000/api'}
      </div>

      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {apiResponse && (
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          <strong>API Response:</strong>
          <pre style={{ fontSize: '12px', overflow: 'auto' }}>
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={testConnection}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Connection Again
        </button>
        
        <button 
          onClick={testAuth}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test Auth Endpoints
        </button>
      </div>
    </div>
  );
};

export default ConnectionTest;
