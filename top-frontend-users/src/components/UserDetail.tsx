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
import type { User } from '../types';

interface ApiServiceType {
  getUserById: (id: string) => Promise<User>;
  deactivateUser: (id: string) => Promise<User>;
  activateUser: (id: string) => Promise<User>;
}

interface UserDetailProps {
  userId: string;
  apiService: ApiServiceType;
  onBack?: () => void;
}

export const UserDetail: React.FC<UserDetailProps> = ({
  userId,
  apiService,
  onBack,
}) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => apiService.getUserById(userId),
  });

  const deactivateMutation = useMutation({
    mutationFn: () => apiService.deactivateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const activateMutation = useMutation({
    mutationFn: () => apiService.activateUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleDeactivate = () => {
    deactivateMutation.mutate();
  };

  const handleActivate = () => {
    activateMutation.mutate();
  };

  if (isLoading) return <CircularProgress />;

  if (!user) {
    return <Alert severity="error">Usuário não encontrado</Alert>;
  }

  const errorMessage = error instanceof Error ? error.message : 'Failed to load user';

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
      {deactivateMutation.error && <Alert severity="error" sx={{ mb: 2 }}>Falha ao desativar usuário</Alert>}
      {activateMutation.error && <Alert severity="error" sx={{ mb: 2 }}>Falha ao ativar usuário</Alert>}

      <Card>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              {user.nome}
            </Typography>
            <Chip
              label={user.status}
              color={user.status === 'ativo' ? 'success' : 'default'}
              sx={{ mb: 2 }}
            />
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                E-mail
              </Typography>
              <Typography variant="body1">
                {user.email}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Status
              </Typography>
              <Typography variant="body1">
                {user.status === 'ativo' ? 'Ativo' : 'Inativo'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Criado em
              </Typography>
              <Typography variant="body1">
                {new Date(user.created).toLocaleDateString()}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Atualizado em
              </Typography>
              <Typography variant="body1">
                {new Date(user.updated).toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {user.status === 'ativo' ? (
              <Button
                variant="contained"
                color="warning"
                onClick={handleDeactivate}
                disabled={deactivateMutation.isPending}
              >
                Desativar
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={handleActivate}
                disabled={activateMutation.isPending}
              >
                Ativar
              </Button>
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

export default UserDetail;
