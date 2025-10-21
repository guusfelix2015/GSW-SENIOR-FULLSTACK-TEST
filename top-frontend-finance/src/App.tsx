import { Box, Typography } from '@mui/material';

function App() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Frontend Financeiro Principal (Microfrontend Remoto)
      </Typography>
      <Typography variant="body1" color="textSecondary">
        Este é um microfrontend remoto que deve ser carregado pela aplicação hospedeira.
        Acesse-o através do host em http://localhost:5173/finances
      </Typography>
    </Box>
  );
}

export default App;