import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import type { CreateFinanceDTO, User } from '../types';

interface ApiServiceType {
  getUsers: () => Promise<User[]>;
  createFinance: (data: CreateFinanceDTO) => Promise<unknown>;
}

interface FinanceFormProps {
  onSubmit: (data: CreateFinanceDTO) => Promise<void>;
  onCancel: () => void;
  apiService: ApiServiceType;
  initialData?: CreateFinanceDTO;
  isLoading?: boolean;
}

export const FinanceForm: React.FC<FinanceFormProps> = ({
  onSubmit,
  onCancel,
  apiService,
  initialData,
  isLoading = false,
}) => {
  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => apiService.getUsers(),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateFinanceDTO>({
    defaultValues: initialData || {
      userId: '',
      tipo: 'receita',
      descricao: '',
      valor: 0,
      dataTransacao: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmitForm = async (data: CreateFinanceDTO) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (loadingUsers) return <CircularProgress />;

  return (
    <Box sx={{ p: 3, minWidth: 400 }}>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Usuário</InputLabel>
          <Controller
            name="userId"
            control={control}
            rules={{ required: 'User is required' }}
            render={({ field }) => (
              <Select
                {...field}
                label="Usuário"
                error={!!errors.userId}
                disabled={isLoading}
              >
                {users.map((user: User) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.nome}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tipo</InputLabel>
          <Controller
            name="tipo"
            control={control}
            render={({ field }) => (
              <Select {...field} label="Tipo" disabled={isLoading}>
                <MenuItem value="receita">Receita</MenuItem>
                <MenuItem value="despesa">Despesa</MenuItem>
              </Select>
            )}
          />
        </FormControl>

        <TextField
          fullWidth
          label="Descrição"
          {...register('descricao', {
            required: 'Descrição é obrigatória',
            minLength: { value: 3, message: 'Descrição deve ter pelo menos 3 caracteres' },
          })}
          error={!!errors.descricao}
          helperText={errors.descricao?.message}
          sx={{ mb: 2 }}
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="Valor"
          type="number"
          inputProps={{ step: '0.01' }}
          {...register('valor', {
            required: 'Valor é obrigatório',
            min: { value: 0.01, message: 'Valor deve ser maior que 0' },
          })}
          error={!!errors.valor}
          helperText={errors.valor?.message}
          sx={{ mb: 2 }}
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="Data"
          type="date"
          {...register('dataTransacao', { required: 'Data é obrigatória' })}
          error={!!errors.dataTransacao}
          helperText={errors.dataTransacao?.message}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          disabled={isLoading}
        />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button type="submit" variant="contained" disabled={isLoading}>
            Criar
          </Button>
          <Button onClick={onCancel} disabled={isLoading}>
            Cancelar
          </Button>
        </Box>
      </form>
    </Box>
  );
};
