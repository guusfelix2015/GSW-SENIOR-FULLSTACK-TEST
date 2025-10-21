import { Box, Typography } from '@mui/material';

function App() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Top Frontend Users (Remote Microfrontend)
      </Typography>
      <Typography variant="body1" color="textSecondary">
        This is a remote microfrontend that should be loaded by the host application.
        Access it through the host at http://localhost:5173/users
      </Typography>
    </Box>
  );
}

export default App;
