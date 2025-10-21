import { Finance, FinanceType, FinanceStatus } from './finance.entity';

describe('Finance Entity', () => {
  const mockUserId = 'user-123';

  describe('constructor', () => {
    it('should create a finance with default values', () => {
      const finance = new Finance(
        mockUserId,
        FinanceType.RECEITA,
        'Salário',
        5000,
        'Renda',
      );

      expect(finance.userId).toBe(mockUserId);
      expect(finance.tipo).toBe(FinanceType.RECEITA);
      expect(finance.descricao).toBe('Salário');
      expect(finance.valor).toBe(5000);
      expect(finance.status).toBe(FinanceStatus.PENDENTE);
      expect(finance.isDeleted).toBe(false);
      expect(finance.id).toBeDefined();
      expect(finance.created).toBeDefined();
      expect(finance.updated).toBeDefined();
    });

    it('should create a finance with custom values', () => {
      const customId = 'custom-id';
      const customDate = new Date('2024-01-01');

      const finance = new Finance(
        mockUserId,
        FinanceType.DESPESA,
        'Aluguel',
        1500,
        'Moradia',
        customDate,
        FinanceStatus.CONFIRMADA,
        customId,
        false,
        customDate,
        customDate,
      );

      expect(finance.id).toBe(customId);
      expect(finance.status).toBe(FinanceStatus.CONFIRMADA);
      expect(finance.created).toEqual(customDate);
    });
  });

  describe('confirm', () => {
    it('should confirm a pending transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');

      finance.confirm();

      expect(finance.status).toBe(FinanceStatus.CONFIRMADA);
      expect(finance.dataPagamento).toBeDefined();
    });

    it('should throw error when confirming a deleted transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');
      finance.softDelete();

      expect(() => finance.confirm()).toThrow('Cannot confirm a deleted transaction');
    });

    it('should throw error when confirming a cancelled transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');
      finance.cancel();

      expect(() => finance.confirm()).toThrow('Cannot confirm a cancelled transaction');
    });
  });

  describe('cancel', () => {
    it('should cancel a pending transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');

      finance.cancel();

      expect(finance.status).toBe(FinanceStatus.CANCELADA);
    });

    it('should throw error when cancelling a confirmed transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');
      finance.confirm();

      expect(() => finance.cancel()).toThrow('Cannot cancel a confirmed transaction');
    });

    it('should throw error when cancelling a deleted transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');
      finance.softDelete();

      expect(() => finance.cancel()).toThrow('Cannot cancel a deleted transaction');
    });
  });

  describe('softDelete', () => {
    it('should soft delete a transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');

      finance.softDelete();

      expect(finance.isDeleted).toBe(true);
      expect(finance.deleted).toBeDefined();
    });
  });

  describe('restore', () => {
    it('should restore a deleted transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');
      finance.softDelete();

      finance.restore();

      expect(finance.isDeleted).toBe(false);
      expect(finance.deleted).toBeUndefined();
    });
  });

  describe('updateDescription', () => {
    it('should update transaction description', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');

      finance.updateDescription('Salário Mensal');

      expect(finance.descricao).toBe('Salário Mensal');
    });

    it('should throw error when updating description with empty string', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');

      expect(() => finance.updateDescription('')).toThrow('Description cannot be empty');
    });

    it('should throw error when updating description of deleted transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');
      finance.softDelete();

      expect(() => finance.updateDescription('Nova Descrição')).toThrow(
        'Cannot update description of a deleted transaction',
      );
    });
  });

  describe('updateValue', () => {
    it('should update transaction value', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');

      finance.updateValue(6000);

      expect(finance.valor).toBe(6000);
    });

    it('should throw error when updating value with zero or negative', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');

      expect(() => finance.updateValue(0)).toThrow('Value must be greater than zero');
      expect(() => finance.updateValue(-100)).toThrow('Value must be greater than zero');
    });

    it('should throw error when updating value of confirmed transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');
      finance.confirm();

      expect(() => finance.updateValue(6000)).toThrow(
        'Cannot update value of a confirmed transaction',
      );
    });

    it('should throw error when updating value of deleted transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');
      finance.softDelete();

      expect(() => finance.updateValue(6000)).toThrow(
        'Cannot update value of a deleted transaction',
      );
    });
  });

  describe('updateCategory', () => {
    it('should update transaction category', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');

      finance.updateCategory('Renda Extra');

      expect(finance.categoria).toBe('Renda Extra');
    });

    it('should throw error when updating category with empty string', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');

      expect(() => finance.updateCategory('')).toThrow('Category cannot be empty');
    });

    it('should throw error when updating category of deleted transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');
      finance.softDelete();

      expect(() => finance.updateCategory('Nova Categoria')).toThrow(
        'Cannot update category of a deleted transaction',
      );
    });
  });

  describe('isConfirmed', () => {
    it('should return true for confirmed transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');
      finance.confirm();

      expect(finance.isConfirmed()).toBe(true);
    });

    it('should return false for pending transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');

      expect(finance.isConfirmed()).toBe(false);
    });

    it('should return false for deleted transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');
      finance.confirm();
      finance.softDelete();

      expect(finance.isConfirmed()).toBe(false);
    });
  });

  describe('isCancelled', () => {
    it('should return true for cancelled transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');
      finance.cancel();

      expect(finance.isCancelled()).toBe(true);
    });

    it('should return false for pending transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');

      expect(finance.isCancelled()).toBe(false);
    });
  });

  describe('isDeleted_', () => {
    it('should return false for active transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');

      expect(finance.isDeleted_()).toBe(false);
    });

    it('should return true for deleted transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');
      finance.softDelete();

      expect(finance.isDeleted_()).toBe(true);
    });
  });

  describe('isIncome', () => {
    it('should return true for income transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');

      expect(finance.isIncome()).toBe(true);
    });

    it('should return false for expense transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.DESPESA, 'Aluguel', 1500, 'Moradia');

      expect(finance.isIncome()).toBe(false);
    });
  });

  describe('isExpense', () => {
    it('should return true for expense transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.DESPESA, 'Aluguel', 1500, 'Moradia');

      expect(finance.isExpense()).toBe(true);
    });

    it('should return false for income transaction', () => {
      const finance = new Finance(mockUserId, FinanceType.RECEITA, 'Salário', 5000, 'Renda');

      expect(finance.isExpense()).toBe(false);
    });
  });
});

