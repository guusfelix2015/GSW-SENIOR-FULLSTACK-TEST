import React, { useState } from 'react';
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
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, CreateUserDTO } from '../types';
import { apiService } from '../services/api';

type UserStatus = 'ativo' | 'inativo';

export const Users: React.FC = () => {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<CreateUserDTO>({ nome: '', email: '' });
  const [mutationError, setMutationError] = useState<string | null>(null);

  const { data: users = [], isLoading, error: queryError } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.getUsers(),
  });

  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserDTO) => apiService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setFormData({ nome: '', email: '' });
      setOpenDialog(false);
      setMutationError(null);
    },
    onError: (error) => {
      setMutationError(error instanceof Error ? error.message : 'Failed to create user');
    },
  });

  const deactivateUserMutation = useMutation({
    mutationFn: (id: string) => apiService.deactivateUser(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });

      const previousData = queryClient.getQueryData(['users']);

      queryClient.setQueryData(['users'], (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.map((user) =>
          (user as User).id === id ? { ...user as User, status: 'inativo' as UserStatus } : user
        );
      });

      return { previousData };
    },
    onSuccess: () => {
      setMutationError(null);
    },
    onError: (error, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['users'], context.previousData);
      }
      setMutationError(error instanceof Error ? error.message : 'Failed to deactivate user');
    },
  });

  const activateUserMutation = useMutation({
    mutationFn: (id: string) => apiService.activateUser(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });

      const previousData = queryClient.getQueryData(['users']);

      queryClient.setQueryData(['users'], (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.map((user) =>
          (user as User).id === id ? { ...user as User, status: 'ativo' as UserStatus } : user
        );
      });

      return { previousData };
    },
    onSuccess: () => {
      setMutationError(null);
    },
    onError: (error, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['users'], context.previousData);
      }
      setMutationError(error instanceof Error ? error.message : 'Failed to activate user');
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteUser(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });

      const previousData = queryClient.getQueryData(['users']);

      queryClient.setQueryData(['users'], (old: unknown) => {
        if (!Array.isArray(old)) return old;
        return old.filter((user) => (user as User).id !== id);
      });

      return { previousData };
    },
    onSuccess: () => {
      setMutationError(null);
    },
    onError: (error, _id, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['users'], context.previousData);
      }
      setMutationError(error instanceof Error ? error.message : 'Failed to delete user');
    },
  });

  const handleCreateUser = () => {
    createUserMutation.mutate(formData);
  };

  const handleDeactivate = (id: string) => {
    deactivateUserMutation.mutate(id);
  };

  const handleActivate = (id: string) => {
    activateUserMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteUserMutation.mutate(id);
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box>
      {(queryError || mutationError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {queryError instanceof Error
            ? queryError.message
            : (typeof mutationError === 'string' ? mutationError : 'Erro desconhecido')}
        </Alert>
      )}

      <Box sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Criar Usuário
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell>Nome</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.nome}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Chip
                    label={user.status}
                    color={user.status === 'ativo' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {user.status === 'ativo' ? (
                    <Button
                      size="small"
                      onClick={() => handleDeactivate(user.id)}
                    >
                      Desativar
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      onClick={() => handleActivate(user.id)}
                    >
                      Ativar
                    </Button>
                  )}
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(user.id)}
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
        <Box sx={{ p: 3, minWidth: 300 }}>
          <TextField
            fullWidth
            label="Nome"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="E-mail"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleCreateUser}>
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

