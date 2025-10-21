import { User, UserStatus } from './user.entity';

describe('User Entity', () => {
  const mockAddress = {
    rua: 'Rua Teste',
    numero: '123',
    bairro: 'Bairro Teste',
    complemento: 'Apto 101',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
  };

  describe('constructor', () => {
    it('should create a user with default values', () => {
      const user = new User('João Silva', 'joao@example.com', mockAddress);

      expect(user.nome).toBe('João Silva');
      expect(user.email).toBe('joao@example.com');
      expect(user.status).toBe(UserStatus.ATIVO);
      expect(user.isDeleted).toBe(false);
      expect(user.id).toBeDefined();
      expect(user.created).toBeDefined();
      expect(user.updated).toBeDefined();
    });

    it('should create a user with custom values', () => {
      const customId = 'custom-id';
      const customDate = new Date('2024-01-01');

      const user = new User(
        'Maria Silva',
        'maria@example.com',
        mockAddress,
        'hashed-password',
        UserStatus.INATIVO,
        customId,
        false,
        customDate,
        customDate,
      );

      expect(user.id).toBe(customId);
      expect(user.status).toBe(UserStatus.INATIVO);
      expect(user.created).toEqual(customDate);
    });
  });

  describe('activate', () => {
    it('should activate an inactive user', () => {
      const user = new User('João', 'joao@example.com', mockAddress, UserStatus.INATIVO);

      user.activate();

      expect(user.status).toBe(UserStatus.ATIVO);
    });

    it('should throw error when activating a deleted user', () => {
      const user = new User('João', 'joao@example.com', mockAddress);
      user.softDelete();

      expect(() => user.activate()).toThrow('Cannot activate a deleted user');
    });
  });

  describe('deactivate', () => {
    it('should deactivate an active user', () => {
      const user = new User('João', 'joao@example.com', mockAddress);

      user.deactivate();

      expect(user.status).toBe(UserStatus.INATIVO);
    });

    it('should throw error when deactivating a deleted user', () => {
      const user = new User('João', 'joao@example.com', mockAddress);
      user.softDelete();

      expect(() => user.deactivate()).toThrow('Cannot deactivate a deleted user');
    });
  });

  describe('softDelete', () => {
    it('should soft delete a user', () => {
      const user = new User('João', 'joao@example.com', mockAddress);

      user.softDelete();

      expect(user.isDeleted).toBe(true);
      expect(user.deleted).toBeDefined();
    });
  });

  describe('restore', () => {
    it('should restore a deleted user', () => {
      const user = new User('João', 'joao@example.com', mockAddress);
      user.softDelete();

      user.restore();

      expect(user.isDeleted).toBe(false);
      expect(user.deleted).toBeUndefined();
    });
  });

  describe('updateAddress', () => {
    it('should update user address', () => {
      const user = new User('João', 'joao@example.com', mockAddress);
      const newAddress = { ...mockAddress, rua: 'Nova Rua' };

      user.updateAddress(newAddress);

      expect(user.endereco.rua).toBe('Nova Rua');
    });

    it('should throw error when updating address of deleted user', () => {
      const user = new User('João', 'joao@example.com', mockAddress);
      user.softDelete();

      expect(() => user.updateAddress(mockAddress)).toThrow(
        'Cannot update address of a deleted user',
      );
    });
  });

  describe('updateName', () => {
    it('should update user name', () => {
      const user = new User('João', 'joao@example.com', mockAddress);

      user.updateName('Maria');

      expect(user.nome).toBe('Maria');
    });

    it('should throw error when updating name with empty string', () => {
      const user = new User('João', 'joao@example.com', mockAddress);

      expect(() => user.updateName('')).toThrow('Name cannot be empty');
    });

    it('should throw error when updating name of deleted user', () => {
      const user = new User('João', 'joao@example.com', mockAddress);
      user.softDelete();

      expect(() => user.updateName('Maria')).toThrow(
        'Cannot update name of a deleted user',
      );
    });
  });

  describe('isActive', () => {
    it('should return true for active user', () => {
      const user = new User('João', 'joao@example.com', mockAddress);

      expect(user.isActive()).toBe(true);
    });

    it('should return false for inactive user', () => {
      const user = new User('João', 'joao@example.com', mockAddress, UserStatus.INATIVO);

      expect(user.isActive()).toBe(false);
    });

    it('should return false for deleted user', () => {
      const user = new User('João', 'joao@example.com', mockAddress);
      user.softDelete();

      expect(user.isActive()).toBe(false);
    });
  });

  describe('isDeleted_', () => {
    it('should return false for active user', () => {
      const user = new User('João', 'joao@example.com', mockAddress);

      expect(user.isDeleted_()).toBe(false);
    });

    it('should return true for deleted user', () => {
      const user = new User('João', 'joao@example.com', mockAddress);
      user.softDelete();

      expect(user.isDeleted_()).toBe(true);
    });
  });
});

