import * as Knex from 'knex';
import { v4 as uuidv4 } from 'uuid';
import { Finance, FinanceType, FinanceStatus } from '../src/domain/entities/finance.entity';
import { FinanceRepository } from '../src/infrastructure/repositories/finance.repository';

describe('FinanceRepository Integration Tests', () => {
  let knex: Knex.Knex;
  let financeRepository: FinanceRepository;
  const mockUserId = uuidv4();

  beforeAll(async () => {
    knex = Knex.default({
      client: 'postgresql',
      connection: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5433'),
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'finance_db',
      },
    });

    financeRepository = new FinanceRepository(knex);

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
    await knex('finances').del();
  });

  describe('create', () => {
    it('should create a finance transaction in the database', async () => {
      const finance = new Finance(
        mockUserId,
        FinanceType.RECEITA,
        'Salário',
        5000,
        'Renda',
      );

      const createdFinance = await financeRepository.create(finance);

      expect(createdFinance).toBeDefined();
      expect(createdFinance.id).toBe(finance.id);
      expect(createdFinance.descricao).toBe('Salário');
      expect(createdFinance.valor).toBe(5000);
    });

    it('should persist finance data in the database', async () => {
      const finance = new Finance(
        mockUserId,
        FinanceType.DESPESA,
        'Aluguel',
        1500,
        'Moradia',
      );

      await financeRepository.create(finance);

      const foundFinance = await financeRepository.findById(finance.id);

      expect(foundFinance).toBeDefined();
      expect(foundFinance?.descricao).toBe('Aluguel');
      expect(foundFinance?.valor).toBe(1500);
    });
  });

  describe('findById', () => {
    it('should find a finance by ID', async () => {
      const finance = new Finance(
        mockUserId,
        FinanceType.RECEITA,
        'Salário',
        5000,
        'Renda',
      );
      await financeRepository.create(finance);

      const foundFinance = await financeRepository.findById(finance.id);

      expect(foundFinance).toBeDefined();
      expect(foundFinance?.id).toBe(finance.id);
      expect(foundFinance?.descricao).toBe('Salário');
    });

    it('should return null when finance not found', async () => {
      const nonExistentId = uuidv4();
      const foundFinance = await financeRepository.findById(nonExistentId);

      expect(foundFinance).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should find all finances for a user', async () => {
      const finance1 = new Finance(
        mockUserId,
        FinanceType.RECEITA,
        'Salário',
        5000,
        'Renda',
      );
      const finance2 = new Finance(
        mockUserId,
        FinanceType.DESPESA,
        'Aluguel',
        1500,
        'Moradia',
      );

      await financeRepository.create(finance1);
      await financeRepository.create(finance2);

      const finances = await financeRepository.findByUserId(mockUserId);

      expect(finances).toHaveLength(2);
    });

    it('should support pagination', async () => {
      for (let i = 0; i < 5; i++) {
        const finance = new Finance(
          mockUserId,
          FinanceType.RECEITA,
          `Receita ${i}`,
          1000 * (i + 1),
          'Renda',
        );
        await financeRepository.create(finance);
      }

      const page1 = await financeRepository.findByUserId(mockUserId, 0, 2);
      const page2 = await financeRepository.findByUserId(mockUserId, 2, 2);

      expect(page1).toHaveLength(2);
      expect(page2).toHaveLength(2);
    });
  });

  describe('findAll', () => {
    it('should find all finances', async () => {
      const finance1 = new Finance(
        mockUserId,
        FinanceType.RECEITA,
        'Salário',
        5000,
        'Renda',
      );
      const finance2 = new Finance(
        uuidv4(),
        FinanceType.DESPESA,
        'Aluguel',
        1500,
        'Moradia',
      );

      await financeRepository.create(finance1);
      await financeRepository.create(finance2);

      const finances = await financeRepository.findAll();

      expect(finances).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('should update a finance transaction', async () => {
      const finance = new Finance(
        mockUserId,
        FinanceType.RECEITA,
        'Salário',
        5000,
        'Renda',
      );
      await financeRepository.create(finance);

      finance.updateDescription('Salário Mensal');
      const updatedFinance = await financeRepository.update(finance.id, finance);

      expect(updatedFinance.descricao).toBe('Salário Mensal');
    });

    it('should persist updated data in the database', async () => {
      const finance = new Finance(
        mockUserId,
        FinanceType.RECEITA,
        'Salário',
        5000,
        'Renda',
      );
      await financeRepository.create(finance);

      finance.updateValue(6000);
      await financeRepository.update(finance.id, finance);

      const foundFinance = await financeRepository.findById(finance.id);
      expect(foundFinance?.valor).toBe(6000);
    });
  });

  describe('delete', () => {
    it('should soft delete a finance transaction', async () => {
      const finance = new Finance(
        mockUserId,
        FinanceType.RECEITA,
        'Salário',
        5000,
        'Renda',
      );
      await financeRepository.create(finance);

      await financeRepository.delete(finance.id);

      const foundFinance = await financeRepository.findById(finance.id);
      expect(foundFinance?.isDeleted).toBe(true);
    });

    it('should not return deleted finances in findAll', async () => {
      const finance1 = new Finance(
        mockUserId,
        FinanceType.RECEITA,
        'Salário',
        5000,
        'Renda',
      );
      const finance2 = new Finance(
        mockUserId,
        FinanceType.DESPESA,
        'Aluguel',
        1500,
        'Moradia',
      );

      await financeRepository.create(finance1);
      await financeRepository.create(finance2);
      await financeRepository.delete(finance1.id);

      const finances = await financeRepository.findAll();

      expect(finances).toHaveLength(1);
      expect(finances[0].id).toBe(finance2.id);
    });
  });

  describe('restore', () => {
    it('should restore a deleted finance transaction', async () => {
      const finance = new Finance(
        mockUserId,
        FinanceType.RECEITA,
        'Salário',
        5000,
        'Renda',
      );
      await financeRepository.create(finance);
      await financeRepository.delete(finance.id);

      await financeRepository.restore(finance.id);

      const foundFinance = await financeRepository.findById(finance.id);
      expect(foundFinance?.isDeleted).toBe(false);
    });
  });

  describe('count', () => {
    it('should count active finances', async () => {
      const finance1 = new Finance(
        mockUserId,
        FinanceType.RECEITA,
        'Salário',
        5000,
        'Renda',
      );
      const finance2 = new Finance(
        mockUserId,
        FinanceType.DESPESA,
        'Aluguel',
        1500,
        'Moradia',
      );

      await financeRepository.create(finance1);
      await financeRepository.create(finance2);

      const count = await financeRepository.count();

      expect(count).toBe(2);
    });

    it('should not count deleted finances', async () => {
      const finance1 = new Finance(
        mockUserId,
        FinanceType.RECEITA,
        'Salário',
        5000,
        'Renda',
      );
      const finance2 = new Finance(
        mockUserId,
        FinanceType.DESPESA,
        'Aluguel',
        1500,
        'Moradia',
      );

      await financeRepository.create(finance1);
      await financeRepository.create(finance2);
      await financeRepository.delete(finance1.id);

      const count = await financeRepository.count();

      expect(count).toBe(1);
    });
  });

  describe('countByUserId', () => {
    it('should count finances for a specific user', async () => {
      const finance1 = new Finance(
        mockUserId,
        FinanceType.RECEITA,
        'Salário',
        5000,
        'Renda',
      );
      const finance2 = new Finance(
        uuidv4(),
        FinanceType.DESPESA,
        'Aluguel',
        1500,
        'Moradia',
      );

      await financeRepository.create(finance1);
      await financeRepository.create(finance2);

      const count = await financeRepository.countByUserId(mockUserId);

      expect(count).toBe(1);
    });
  });

  describe('sumByUserId', () => {
    it('should sum confirmed income for a user', async () => {
      const finance1 = new Finance(
        mockUserId,
        FinanceType.RECEITA,
        'Salário',
        5000,
        'Renda',
      );
      finance1.confirm();

      const finance2 = new Finance(
        mockUserId,
        FinanceType.RECEITA,
        'Bônus',
        1000,
        'Renda',
      );
      finance2.confirm();

      await financeRepository.create(finance1);
      await financeRepository.create(finance2);

      const sum = await financeRepository.sumByUserId(mockUserId, 'receita');

      expect(sum).toBe(6000);
    });

    it('should sum confirmed expenses for a user', async () => {
      const finance1 = new Finance(
        mockUserId,
        FinanceType.DESPESA,
        'Aluguel',
        1500,
        'Moradia',
      );
      finance1.confirm();

      const finance2 = new Finance(
        mockUserId,
        FinanceType.DESPESA,
        'Alimentação',
        500,
        'Alimentação',
      );
      finance2.confirm();

      await financeRepository.create(finance1);
      await financeRepository.create(finance2);

      const sum = await financeRepository.sumByUserId(mockUserId, 'despesa');

      expect(sum).toBe(2000);
    });

    it('should not sum pending transactions', async () => {
      const finance = new Finance(
        mockUserId,
        FinanceType.RECEITA,
        'Salário',
        5000,
        'Renda',
      );

      await financeRepository.create(finance);

      const sum = await financeRepository.sumByUserId(mockUserId, 'receita');

      expect(sum).toBe(0);
    });
  });
});

