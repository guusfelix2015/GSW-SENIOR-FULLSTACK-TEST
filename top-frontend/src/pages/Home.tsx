import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4 }}>
        Bem-vindo ao Top Finance
      </Typography>

      <Typography variant="body1" paragraph sx={{ mb: 4, fontSize: '1.1rem' }}>
        Gerencie seus usuários e finanças de forma eficiente com nossa plataforma completa.
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}>
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Gerenciamento de Usuários
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Crie, atualize e gerencie contas de usuário. Ative ou desative usuários conforme necessário.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/users')}
              >
                Ir para Usuários
              </Button>
            </CardContent>
          </Card>
        </Box>

        <Box>
          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Gerenciamento de Finanças
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Acompanhe receitas e despesas. Confirme ou cancele transações e visualize saldos.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/finances')}
              >
                Ir para Finanças
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recursos
          </Typography>
          <ul>
            <li>Operações CRUD completas para usuários e finanças</li>
            <li>Sincronização de dados em tempo real</li>
            <li>Acompanhamento de saldo de usuário</li>
            <li>Gerenciamento de status de transação</li>
            <li>Design responsivo com Material-UI</li>
          </ul>
        </CardContent>
      </Card>
    </Box>
  );
};

