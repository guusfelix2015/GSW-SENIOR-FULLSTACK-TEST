import { Box, AppBar, Toolbar, Typography, Container, CssBaseline, Button } from '@mui/material';
import { Outlet, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const Layout = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Top Finance
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {isAuthenticated && (
              <>
                <Typography
                  component={RouterLink}
                  to="/"
                  sx={{
                    color: 'white',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Home
                </Typography>
                <Typography
                  component={RouterLink}
                  to="/users"
                  sx={{
                    color: 'white',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Usuários
                </Typography>
                <Typography
                  component={RouterLink}
                  to="/finances"
                  sx={{
                    color: 'white',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Finanças
                </Typography>
                <Typography variant="body2" sx={{ color: 'white' }}>
                  {user?.nome}
                </Typography>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                  sx={{ textTransform: 'none' }}
                >
                  Sair
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#f5f5f5',
          textAlign: 'center',
        }}
      >
      </Box>
    </Box>
  );
};

