import { Suspense, lazy } from 'react';
import { CircularProgress, Box, Alert } from '@mui/material';

const RemoteFinanceList = lazy(() =>
  import('topFrontendFinance/FinanceList').catch((err) => {
    console.error('Failed to load RemoteFinanceList:', err);
    return {
      default: () => (
        <Alert severity="error">
          Falha ao carregar módulo de Finanças. Verifique se top-frontend-finance está em execução na porta 5175.
        </Alert>
      ),
    };
  })
);

export const FinanceListWrapper = () => {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      }
    >
      <RemoteFinanceList />
    </Suspense>
  );
};

