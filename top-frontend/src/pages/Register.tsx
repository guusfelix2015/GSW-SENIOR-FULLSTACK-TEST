import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import {
  Container,
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import { useAuthStore } from '../stores/authStore';

interface RegisterFormData {
  nome: string;
  email: string;
  password: string;
  confirmPassword: string;
  rua: string;
  numero: string;
  bairro: string;
  complemento?: string;
  cidade: string;
  estado: string;
  cep: string;
}

export function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  const { register: registerUser } = useAuthStore();
  const password = watch('password');

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) =>
      registerUser(data.nome, data.email, data.password, {
        rua: data.rua,
        numero: data.numero,
        bairro: data.bairro,
        complemento: data.complemento,
        cidade: data.cidade,
        estado: data.estado,
        cep: data.cep,
      }),
    onSuccess: () => {
      navigate('/');
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, textAlign: 'center' }}>
            Cadastro
          </Typography>

          {registerMutation.error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {registerMutation.error instanceof Error ? registerMutation.error.message : 'Registration failed'}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Nome Completo"
                {...register('nome', { required: 'Name is required' })}
                error={!!errors.nome}
                helperText={errors.nome?.message}
                disabled={registerMutation.isPending}
              />

              <TextField
                label="Email"
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={registerMutation.isPending}
              />

              <TextField
                label="Senha"
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Min 6 characters' },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={registerMutation.isPending}
              />

              <TextField
                label="Confirmar Senha"
                type="password"
                {...register('confirmPassword', {
                  required: 'Confirm password',
                  validate: (value) => value === password || 'Passwords do not match',
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                disabled={registerMutation.isPending}
              />

              <TextField
                label="Rua"
                sx={{ gridColumn: { xs: 'auto', sm: 'span 2' } }}
                {...register('rua', { required: 'Street is required' })}
                error={!!errors.rua}
                helperText={errors.rua?.message}
                disabled={registerMutation.isPending}
              />

              <TextField
                label="Número"
                {...register('numero', { required: 'Number is required' })}
                error={!!errors.numero}
                helperText={errors.numero?.message}
                disabled={registerMutation.isPending}
              />

              <TextField
                label="Bairro"
                {...register('bairro', { required: 'Neighborhood is required' })}
                error={!!errors.bairro}
                helperText={errors.bairro?.message}
                disabled={registerMutation.isPending}
              />

              <TextField
                label="Complemento (opcional)"
                {...register('complemento')}
                disabled={registerMutation.isPending}
              />

              <TextField
                label="Cidade"
                {...register('cidade', { required: 'City is required' })}
                error={!!errors.cidade}
                helperText={errors.cidade?.message}
                disabled={registerMutation.isPending}
              />

              <TextField
                label="Estado"
                {...register('estado', { required: 'State is required' })}
                error={!!errors.estado}
                helperText={errors.estado?.message}
                disabled={registerMutation.isPending}
              />

              <TextField
                label="CEP"
                {...register('cep', { required: 'ZIP code is required' })}
                error={!!errors.cep}
                helperText={errors.cep?.message}
                disabled={registerMutation.isPending}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={registerMutation.isPending}
                sx={{ gridColumn: { xs: 'auto', sm: 'span 2' } }}
              >
                {registerMutation.isPending ? <CircularProgress size={24} /> : 'Cadastrar'}
              </Button>
            </Box>
          </form>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Já tem uma conta?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
                sx={{ cursor: 'pointer' }}
              >
                Faça login aqui
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
