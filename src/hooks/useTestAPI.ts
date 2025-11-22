import { useEffect } from 'react';
import apiClient from '@/lib/api';

export const useTestAPI = () => {
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔍 [API] Testando conexão com a API...');
        
        // Tenta listar usuários para verificar conexão
        const response = await apiClient.get('/api/users');
        
        console.log('✅ [API] Conexão estabelecida com sucesso!');
        console.log('📊 [API] Resposta:', response.data);
        console.log('📍 [API] URL Base:', apiClient.defaults.baseURL);
        console.log('🔗 [API] Endpoint testado: GET /api/users');
        
      } catch (error: any) {
        console.error('❌ [API] Erro ao conectar com a API');
        console.error('📍 [API] URL:', apiClient.defaults.baseURL);
        console.error('⚠️  [API] Status:', error.response?.status);
        console.error('📝 [API] Mensagem:', error.message);
      }
    };

    testConnection();
  }, []);
};
