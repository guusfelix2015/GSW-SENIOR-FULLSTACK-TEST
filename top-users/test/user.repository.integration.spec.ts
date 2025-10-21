import * as Knex from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../src/domain/entities/user.entity';
import { UserRepository } from '../src/infrastructure/repositories/user.repository';

describe('UserRepository Integration Tests', () => {
  let knex: Knex.Knex;
  let userRepository: UserRepository;

  const mockAddress = {
    rua: 'Rua Teste',
    numero: '123',
    bairro: 'Bairro Teste',
    complemento: 'Apto 101',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
  };

  beforeAll(async () => {
    knex = Knex.default({
      client: 'postgresql',
      connection: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'users_db',
      },
    });

    userRepository = new UserRepository(knex);

    try {
      await knex.migrate.rollback(undefined, true);
      console.log('✅ Rollback completed');
    } catch (error) {
      console.log('⚠️ Rollback skipped (no migrations to rollback)');
    }

    try {
      await knex.migrate.latest();
      console.log('✅ Migrations completed');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  });

  afterAll(async () => {
    try {
      await knex.migrate.rollback();
      console.log('✅ Rollback completed');
    } catch (error) {
      console.error('❌ Rollback failed:', error);
    }

    await knex.destroy();
  });

  afterEach(async () => {
    await knex('users').del();
  });

  describe('create', () => {
    it('should create a user in the database', async () => {
      const user = new User('João Silva', 'joao@example.com', mockAddress);

      const createdUser = await userRepository.create(user);

      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBe(user.id);
      expect(createdUser.nome).toBe('João Silva');
      expect(createdUser.email).toBe('joao@example.com');
    });

    it('should persist user data in the database', async () => {
      const user = new User('Maria Silva', 'maria@example.com', mockAddress);

      await userRepository.create(user);

      const foundUser = await userRepository.findById(user.id);

      expect(foundUser).toBeDefined();
      expect(foundUser?.nome).toBe('Maria Silva');
      expect(foundUser?.email).toBe('maria@example.com');
    });
  });

  describe('findById', () => {
    it('should find a user by ID', async () => {
      const user = new User('João Silva', 'joao@example.com', mockAddress);
      await userRepository.create(user);

      const foundUser = await userRepository.findById(user.id);

      expect(foundUser).toBeDefined();
      expect(foundUser?.id).toBe(user.id);
      expect(foundUser?.nome).toBe('João Silva');
    });

    it('should return null when user not found', async () => {
      const nonExistentId = uuidv4();
      const foundUser = await userRepository.findById(nonExistentId);

      expect(foundUser).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const user = new User('João Silva', 'joao@example.com', mockAddress);
      await userRepository.create(user);

      const foundUser = await userRepository.findByEmail('joao@example.com');

      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe('joao@example.com');
    });

    it('should return null when email not found', async () => {
      const foundUser = await userRepository.findByEmail('nonexistent@example.com');

      expect(foundUser).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should find all users', async () => {
      const user1 = new User('João Silva', 'joao@example.com', mockAddress);
      const user2 = new User('Maria Silva', 'maria@example.com', mockAddress);

      await userRepository.create(user1);
      await userRepository.create(user2);

      const users = await userRepository.findAll();

      expect(users).toHaveLength(2);
    });

    it('should support pagination', async () => {
      const users = [];
      for (let i = 0; i < 5; i++) {
        const user = new User(`User ${i}`, `user${i}@example.com`, mockAddress);
        users.push(await userRepository.create(user));
      }

      const page1 = await userRepository.findAll(0, 2);
      const page2 = await userRepository.findAll(2, 2);

      expect(page1).toHaveLength(2);
      expect(page2).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = new User('João Silva', 'joao@example.com', mockAddress);
      await userRepository.create(user);

      user.updateName('João Silva Updated');
      const updatedUser = await userRepository.update(user.id, user);

      expect(updatedUser.nome).toBe('João Silva Updated');
    });

    it('should persist updated data in the database', async () => {
      const user = new User('João Silva', 'joao@example.com', mockAddress);
      await userRepository.create(user);

      user.updateName('João Silva Updated');
      await userRepository.update(user.id, user);

      const foundUser = await userRepository.findById(user.id);
      expect(foundUser?.nome).toBe('João Silva Updated');
    });
  });

  describe('delete', () => {
    it('should soft delete a user', async () => {
      const user = new User('João Silva', 'joao@example.com', mockAddress);
      await userRepository.create(user);

      await userRepository.delete(user.id);

      const foundUser = await userRepository.findById(user.id);
      expect(foundUser?.isDeleted).toBe(true);
    });

    it('should not return deleted users in findAll', async () => {
      const user1 = new User('João Silva', 'joao@example.com', mockAddress);
      const user2 = new User('Maria Silva', 'maria@example.com', mockAddress);

      await userRepository.create(user1);
      await userRepository.create(user2);
      await userRepository.delete(user1.id);

      const users = await userRepository.findAll();

      expect(users).toHaveLength(1);
      expect(users[0].id).toBe(user2.id);
    });
  });

  describe('restore', () => {
    it('should restore a deleted user', async () => {
      const user = new User('João Silva', 'joao@example.com', mockAddress);
      await userRepository.create(user);
      await userRepository.delete(user.id);

      await userRepository.restore(user.id);

      const foundUser = await userRepository.findById(user.id);
      expect(foundUser?.isDeleted).toBe(false);
    });
  });

  describe('count', () => {
    it('should count active users', async () => {
      const user1 = new User('João Silva', 'joao@example.com', mockAddress);
      const user2 = new User('Maria Silva', 'maria@example.com', mockAddress);

      await userRepository.create(user1);
      await userRepository.create(user2);

      const count = await userRepository.count();

      expect(count).toBe(2);
    });

    it('should not count deleted users', async () => {
      const user1 = new User('João Silva', 'joao@example.com', mockAddress);
      const user2 = new User('Maria Silva', 'maria@example.com', mockAddress);

      await userRepository.create(user1);
      await userRepository.create(user2);
      await userRepository.delete(user1.id);

      const count = await userRepository.count();

      expect(count).toBe(1);
    });
  });

  describe('emailExists', () => {
    it('should return true if email exists', async () => {
      const user = new User('João Silva', 'joao@example.com', mockAddress);
      await userRepository.create(user);

      const exists = await userRepository.emailExists('joao@example.com');

      expect(exists).toBe(true);
    });

    it('should return false if email does not exist', async () => {
      const exists = await userRepository.emailExists('nonexistent@example.com');

      expect(exists).toBe(false);
    });

    it('should exclude a specific user when checking email', async () => {
      const user = new User('João Silva', 'joao@example.com', mockAddress);
      await userRepository.create(user);

      const exists = await userRepository.emailExists('joao@example.com', user.id);

      expect(exists).toBe(false);
    });
  });
});

