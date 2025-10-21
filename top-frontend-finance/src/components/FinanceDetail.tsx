import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import type { Finance } from '../types';

interface ApiServiceType {
  getFinanceById: (id: string) => Promise<Finance>;
  confirmFinance: (id: string) => Promise<Finance>;
  cancelFinance: (id: string) => Promise<Finance>;
}

interface FinanceDetailProps {
  financeId: string;
  apiService: ApiServiceType;
  onBack?: () => void;
}

export const FinanceDetail: React.FC<FinanceDetailProps> = ({
  financeId,
  apiService,
  onBack,
}) => {
  const queryClient = useQueryClient();

  const { data: finance, isLoading, error } = useQuery({
    queryKey: ['finance', financeId],
    queryFn: () => apiService.getFinanceById(financeId),
  });

  const confirmMutation = useMutation({
    mutationFn: () => apiService.confirmFinance(financeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', financeId] });
      queryClient.invalidateQueries({ queryKey: ['finances'] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => apiService.cancelFinance(financeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finance', financeId] });
      queryClient.invalidateQueries({ queryKey: ['finances'] });
    },
  });

  const handleConfirm = () => {
    confirmMutation.mutate();
  };

  const handleCancel = () => {
    cancelMutation.mutate();
  };

  if (isLoading) return <CircularProgress />;

  if (!finance) {
    return <Alert severity="error">Finança não encontrada</Alert>;
  }

  const errorMessage = error instanceof Error ? error.message : 'Failed to load finance';

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
      {confirmMutation.error && <Alert severity="error" sx={{ mb: 2 }}>Falha ao confirmar finança</Alert>}
      {cancelMutation.error && <Alert severity="error" sx={{ mb: 2 }}>Falha ao cancelar finança</Alert>}

      <Card>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              {finance.descricao}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip
                label={finance.tipo}
                color={finance.tipo === 'receita' ? 'success' : 'error'}
              />
              <Chip
                label={finance.status}
                color={finance.status === 'confirmada' ? 'success' : 'default'}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Valor
              </Typography>
              <Typography variant="body1">
                R$ {finance.valor.toFixed(2)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Data
              </Typography>
              <Typography variant="body1">
                {new Date(finance.dataTransacao).toLocaleDateString()}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Status
              </Typography>
              <Typography variant="body1">
                {finance.status === 'confirmada' ? 'Confirmada' : finance.status === 'cancelada' ? 'Cancelada' : 'Pendente'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                ID do Usuário
              </Typography>
              <Typography variant="body1">
                {finance.userId}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Criada em
              </Typography>
              <Typography variant="body1">
                {new Date(finance.created).toLocaleDateString()}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Atualizada em
              </Typography>
              <Typography variant="body1">
                {new Date(finance.updated).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {finance.status === 'pendente' && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleConfirm}
                  disabled={confirmMutation.isPending}
                >
                  Confirmar
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                >
                  Cancelar
                </Button>
              </>
            )}
            {onBack && (
              <Button variant="outlined" onClick={onBack}>
                Voltar
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FinanceDetail;
