import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Dialog,
} from '@mui/material';
import type { CreateFinanceDTO, Finance } from '../types';
import { FinanceForm } from './FinanceForm';
import { apiService } from '../services/api';

const FinanceListComponent: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: finances = [], isLoading, error } = useQuery({
    queryKey: ['finances'],
    queryFn: () => apiService.getFinances(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateFinanceDTO) => apiService.createFinance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finances'] });
      setOpenDialog(false);
    },
  });

  const confirmMutation = useMutation({
    mutationFn: (id: string) => apiService.confirmFinance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finances'] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => apiService.cancelFinance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finances'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteFinance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finances'] });
    },
  });

  const handleCreateFinance = async (data: CreateFinanceDTO) => {
    await createMutation.mutateAsync(data);
  };

  const handleConfirm = (id: string) => {
    confirmMutation.mutate(id);
  };

  const handleCancel = (id: string) => {
    cancelMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <CircularProgress />;

  const errorMessage = error instanceof Error ? error.message : 'Failed to load finances';

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
      {createMutation.error && <Alert severity="error" sx={{ mb: 2 }}>Falha ao criar finança</Alert>}
      {confirmMutation.error && <Alert severity="error" sx={{ mb: 2 }}>Falha ao confirmar finança</Alert>}
      {cancelMutation.error && <Alert severity="error" sx={{ mb: 2 }}>Falha ao cancelar finança</Alert>}
      {deleteMutation.error && <Alert severity="error" sx={{ mb: 2 }}>Falha ao excluir finança</Alert>}

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Criar Finança
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Descrição</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {finances.map((finance: Finance) => (
              <TableRow key={finance.id}>
                <TableCell>{finance.descricao}</TableCell>
                <TableCell>
                  <Chip
                    label={finance.tipo}
                    color={finance.tipo === 'receita' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>R$ {finance.valor.toFixed(2)}</TableCell>
                <TableCell>{new Date(finance.dataTransacao).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    label={finance.status}
                    color={finance.status === 'confirmada' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {finance.status === 'pendente' && (
                    <>
                      <Button
                        size="small"
                        onClick={() => handleConfirm(finance.id)}
                        disabled={confirmMutation.isPending}
                      >
                        Confirmar
                      </Button>
                      <Button
                        size="small"
                        color="warning"
                        onClick={() => handleCancel(finance.id)}
                        disabled={cancelMutation.isPending}
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(finance.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <FinanceForm
          onSubmit={handleCreateFinance}
          onCancel={() => setOpenDialog(false)}
          apiService={apiService}
          isLoading={createMutation.isPending}
        />
      </Dialog>
    </Box>
  );
};

export const FinanceList = FinanceListComponent;
export default FinanceListComponent;
