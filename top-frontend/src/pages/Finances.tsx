import { useState } from 'react';
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
  Dialog,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Chip,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateFinanceDTO, Finance } from '../types';
import { apiService } from '../services/api';

export const Finances = () => {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateFinanceDTO>({
    userId: '',
    tipo: 'receita',
    descricao: '',
    valor: 0,
    dataTransacao: new Date().toISOString().split('T')[0],
  });

  const {
    data: finances = [],
    isLoading: financesLoading,
    error: financesError,
  } = useQuery({
    queryKey: ['finances'],
    queryFn: () => apiService.getFinances(),
  });

  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.getUsers(),
  });

  const createFinanceMutation = useMutation({
    mutationFn: (data: CreateFinanceDTO) => apiService.createFinance(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finances'] });
      setFormData({
        userId: '',
        tipo: 'receita',
        descricao: '',
        valor: 0,
        dataTransacao: new Date().toISOString().split('T')[0],
      });
      setOpenDialog(false);
      setMutationError(null);
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create finance';
      setMutationError(errorMessage);
    },
  });

  const confirmFinanceMutation = useMutation({
    mutationFn: (id: string) => apiService.confirmFinance(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['finances'] });

      const previousData = queryClient.getQueryData(['finances']);

      queryClient.setQueryData(['finances'], (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.map((finance) =>
          (finance as Finance).id === id ? { ...finance as Finance, status: 'confirmado' } : finance
        );
      });

      return { previousData };
    },
    onSuccess: () => {
      setMutationError(null);
    },
    onError: (error, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['finances'], context.previousData);
      }
      const errorMessage = error instanceof Error ? error.message : 'Failed to confirm finance';
      setMutationError(errorMessage);
    },
  });

  const cancelFinanceMutation = useMutation({
    mutationFn: (id: string) => apiService.cancelFinance(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['finances'] });

      const previousData = queryClient.getQueryData(['finances']);

      queryClient.setQueryData(['finances'], (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.map((finance) =>
          (finance as Finance).id === id ? { ...finance as Finance, status: 'cancelado' } : finance
        );
      });

      return { previousData };
    },
    onSuccess: () => {
      setMutationError(null);
    },
    onError: (error, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['finances'], context.previousData);
      }
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel finance';
      setMutationError(errorMessage);
    },
  });

  const deleteFinanceMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteFinance(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['finances'] });

      const previousData = queryClient.getQueryData(['finances']);

      queryClient.setQueryData(['finances'], (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.filter((finance) => (finance as Finance).id !== id);
      });

      return { previousData };
    },
    onSuccess: () => {
      setMutationError(null);
    },
    onError: (error, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['finances'], context.previousData);
      }
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete finance';
      setMutationError(errorMessage);
    },
  });

  const handleCreateFinance = () => {
    createFinanceMutation.mutate(formData);
  };

  const handleConfirm = (id: string) => {
    confirmFinanceMutation.mutate(id);
  };

  const handleCancel = (id: string) => {
    cancelFinanceMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteFinanceMutation.mutate(id);
  };

  const getUserName = (userId: string) => {
    return users.find((u) => u.id === userId)?.nome || 'Unknown';
  };

  const isLoading = financesLoading || usersLoading;
  const error = financesError || usersError || mutationError;

  if (isLoading) return <CircularProgress />;

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error instanceof Error ? error.message : String(error)}</Alert>}

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Criar Finança
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Usuário</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell align="right">Valor</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {finances.map((finance) => (
              <TableRow key={finance.id}>
                <TableCell>{getUserName(finance.userId)}</TableCell>
                <TableCell>
                  <Chip
                    label={finance.tipo}
                    color={finance.tipo === 'receita' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{finance.descricao}</TableCell>
                <TableCell align="right">
                  {finance.tipo === 'receita' ? '+' : '-'} R$ {finance.valor.toFixed(2)}
                </TableCell>
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
                      >
                        Confirmar
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleCancel(finance.id)}
                      >
                        Cancelar
                      </Button>
                    </>
                  )}
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(finance.id)}
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
        <Box sx={{ p: 3, minWidth: 400 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Usuário</InputLabel>
            <Select
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              label="Usuário"
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'receita' | 'despesa' })}
              label="Tipo"
            >
              <MenuItem value="receita">Receita</MenuItem>
              <MenuItem value="despesa">Despesa</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Descrição"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Valor"
            type="number"
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) || 0 })}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Data"
            type="date"
            value={formData.dataTransacao}
            onChange={(e) => setFormData({ ...formData, dataTransacao: e.target.value })}
            slotProps={{ inputLabel: { shrink: true } }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleCreateFinance}>
              Criar
            </Button>
            <Button onClick={() => setOpenDialog(false)}>
              Cancelar
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

