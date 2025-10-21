import request from 'supertest';

const BASE_URL = 'http://localhost:3000';

describe('Finances E2E Tests', () => {
  let userId: string;
  let financeId: string;
  let financeIdForDelete: string;

  beforeAll(async () => {
    const userResponse = await request(BASE_URL)
      .post('/api/users')
      .send({
        nome: 'Finance Test User',
        email: `finance-test-${Date.now()}@example.com`,
        endereco: {
          rua: 'Rua Teste',
          numero: '123',
          bairro: 'Bairro Teste',
          complemento: 'Apt 101',
          cidade: 'São Paulo',
          estado: 'SP',
          cep: '01310-100',
        },
      });

    userId = userResponse.body.data.id;
  });

  describe('POST /api/finances - Create Finance', () => {
    it('should create a new finance (receita)', async () => {
      const response = await request(BASE_URL)
        .post('/api/finances')
        .send({
          userId,
          tipo: 'receita',
          descricao: 'Salário',
          valor: 5000,
          categoria: 'Salário',
          dataPagamento: '2025-10-20',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.tipo).toBe('receita');
      expect(response.body.data.valor).toBe(5000);
      expect(response.body.data.status).toBe('pendente');
      financeId = response.body.data.id;
    });

    it('should create a new finance (despesa)', async () => {
      const response = await request(BASE_URL)
        .post('/api/finances')
        .send({
          userId,
          tipo: 'despesa',
          descricao: 'Aluguel',
          valor: 1500,
          categoria: 'Moradia',
          dataPagamento: '2025-10-20',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tipo).toBe('despesa');
      expect(response.body.data.valor).toBe(1500);
    });
  });

  describe('GET /api/finances - List Finances', () => {
    it('should list all finances', async () => {
      const response = await request(BASE_URL)
        .get('/api/finances')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /api/finances/user/:userId - Get User Finances', () => {
    it('should get finances by user id', async () => {
      const response = await request(BASE_URL)
        .get(`/api/finances/user/${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/finances/user/:userId/balance - Get User Balance', () => {
    it('should get user balance', async () => {
      const response = await request(BASE_URL)
        .get(`/api/finances/user/${userId}/balance`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.balance).toHaveProperty('receitas');
      expect(response.body.data.balance).toHaveProperty('despesas');
      expect(response.body.data.balance).toHaveProperty('saldo');
    });
  });

  describe('GET /api/finances/:id - Get Finance by ID', () => {
    it('should get finance by id', async () => {
      const response = await request(BASE_URL)
        .get(`/api/finances/${financeId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(financeId);
    });
  });

  describe('PUT /api/finances/:id - Update Finance', () => {
    it('should update finance successfully', async () => {
      const response = await request(BASE_URL)
        .put(`/api/finances/${financeId}`)
        .send({
          descricao: 'Updated Salary',
          valor: 6000,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.descricao).toBe('Updated Salary');
      expect(response.body.data.valor).toBe(6000);
    });
  });

  describe('POST /api/finances/:id/confirm - Confirm Finance', () => {
    it('should confirm finance', async () => {
      const response = await request(BASE_URL)
        .post(`/api/finances/${financeId}/confirm`)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('confirmada');
    });
  });

  describe('DELETE /api/finances/:id - Delete Finance', () => {
    beforeAll(async () => {
      const response = await request(BASE_URL)
        .post('/api/finances')
        .send({
          userId,
          tipo: 'despesa',
          descricao: 'Test Delete',
          valor: 100,
          categoria: 'Test',
          dataPagamento: '2025-10-20',
        });
      financeIdForDelete = response.body.data.id;
    });

    it('should soft delete finance', async () => {
      const response = await request(BASE_URL)
        .delete(`/api/finances/${financeIdForDelete}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should restore deleted finance', async () => {
      const response = await request(BASE_URL)
        .post(`/api/finances/${financeIdForDelete}/restore`)
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should find restored finance', async () => {
      const response = await request(BASE_URL)
        .get(`/api/finances/${financeIdForDelete}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(financeIdForDelete);
    });
  });
});
