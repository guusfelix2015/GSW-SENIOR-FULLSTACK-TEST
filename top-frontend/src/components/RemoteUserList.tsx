import { Suspense, lazy } from 'react';
import { CircularProgress, Box, Alert } from '@mui/material';

const RemoteUserList = lazy(() =>
  import('topFrontendUsers/UserList').catch((err) => {
    console.error('Failed to load RemoteUserList:', err);
    return {
      default: () => (
        <Alert severity="error">
          Falha ao carregar módulo de Usuários. Verifique se top-frontend-users está em execução na porta 5174.
        </Alert>
      ),
    };
  })
);

export const UserListWrapper = () => {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      }
    >
      <RemoteUserList />
    </Suspense>
  );
};

