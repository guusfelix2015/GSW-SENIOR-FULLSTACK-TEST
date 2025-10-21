import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, TextField, Button } from '@mui/material';
import type { CreateUserDTO } from '../types';

interface UserFormProps {
  onSubmit: (data: CreateUserDTO) => Promise<void>;
  onCancel: () => void;
  initialData?: CreateUserDTO;
  isLoading?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserDTO>({
    defaultValues: initialData || {
      nome: '',
      email: '',
      endereco: {
        rua: '',
        numero: '',
        bairro: '',
        complemento: '',
        cidade: '',
        estado: '',
        cep: '',
      }
    },
  });

  const onSubmitForm = async (data: CreateUserDTO) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Box sx={{ p: 3, minWidth: 400, maxHeight: '80vh', overflowY: 'auto' }}>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <TextField
          fullWidth
          label="Nome"
          {...register('nome', {
            required: 'Nome é obrigatório',
            minLength: { value: 2, message: 'Nome deve ter pelo menos 2 caracteres' },
          })}
          error={!!errors.nome}
          helperText={errors.nome?.message}
          sx={{ mb: 2 }}
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="E-mail"
          type="email"
          {...register('email', {
            required: 'E-mail é obrigatório',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'E-mail inválido',
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{ mb: 2 }}
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="Rua"
          {...register('endereco.rua', {
            required: 'Rua é obrigatória',
          })}
          error={!!errors.endereco?.rua}
          helperText={errors.endereco?.rua?.message}
          sx={{ mb: 2 }}
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="Número"
          {...register('endereco.numero', {
            required: 'Número é obrigatório',
          })}
          error={!!errors.endereco?.numero}
          helperText={errors.endereco?.numero?.message}
          sx={{ mb: 2 }}
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="Bairro"
          {...register('endereco.bairro', {
            required: 'Bairro é obrigatório',
          })}
          error={!!errors.endereco?.bairro}
          helperText={errors.endereco?.bairro?.message}
          sx={{ mb: 2 }}
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="Complemento"
          {...register('endereco.complemento')}
          error={!!errors.endereco?.complemento}
          helperText={errors.endereco?.complemento?.message}
          sx={{ mb: 2 }}
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="Cidade"
          {...register('endereco.cidade', {
            required: 'Cidade é obrigatória',
          })}
          error={!!errors.endereco?.cidade}
          helperText={errors.endereco?.cidade?.message}
          sx={{ mb: 2 }}
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="Estado"
          {...register('endereco.estado', {
            required: 'Estado é obrigatório',
            maxLength: { value: 2, message: 'Estado deve ter 2 caracteres' },
          })}
          error={!!errors.endereco?.estado}
          helperText={errors.endereco?.estado?.message}
          sx={{ mb: 2 }}
          disabled={isLoading}
        />

        <TextField
          fullWidth
          label="CEP"
          {...register('endereco.cep', {
            required: 'CEP é obrigatório',
          })}
          error={!!errors.endereco?.cep}
          helperText={errors.endereco?.cep?.message}
          sx={{ mb: 2 }}
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
