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
import type { CreateUserDTO, User } from '../types';
import { UserForm } from './UserForm';
import { apiService } from '../services/api';

const UserListComponent: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.getUsers(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateUserDTO) => apiService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpenDialog(false);
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => apiService.deactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => apiService.activateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleCreateUser = async (data: CreateUserDTO) => {
    await createMutation.mutateAsync(data);
  };

  const handleDeactivate = (id: string) => {
    deactivateMutation.mutate(id);
  };

  const handleActivate = (id: string) => {
    activateMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error instanceof Error ? error.message : 'Erro ao carregar usuários'}
        </Alert>
      )}
      {createMutation.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {createMutation.error instanceof Error ? createMutation.error.message : 'Falha ao criar usuário'}
        </Alert>
      )}
      {deactivateMutation.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {deactivateMutation.error instanceof Error ? deactivateMutation.error.message : 'Falha ao desativar usuário'}
        </Alert>
      )}
      {activateMutation.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {activateMutation.error instanceof Error ? activateMutation.error.message : 'Falha ao ativar usuário'}
        </Alert>
      )}
      {deleteMutation.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {deleteMutation.error instanceof Error ? deleteMutation.error.message : 'Falha ao excluir usuário'}
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
            {users.map((user: User) => (
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
                      disabled={deactivateMutation.isPending}
                    >
                      Desativar
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      onClick={() => handleActivate(user.id)}
                      disabled={activateMutation.isPending}
                    >
                      Ativar
                    </Button>
                  )}
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(user.id)}
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
        <UserForm
          onSubmit={handleCreateUser}
          onCancel={() => setOpenDialog(false)}
          isLoading={createMutation.isPending}
        />
      </Dialog>
    </Box>
  );
};

export const UserList = UserListComponent;
export default UserListComponent;
