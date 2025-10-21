import request from 'supertest';

const BASE_URL = 'http://localhost:3000';

describe('Users E2E Tests', () => {
  let userId: string;
  let userIdForDelete: string;

  describe('POST /api/users - Create User', () => {
    it('should create a new user successfully', async () => {
      const response = await request(BASE_URL)
        .post('/api/users')
        .send({
          nome: 'Test User E2E',
          email: `test-e2e-${Date.now()}@example.com`,
          endereco: {
            rua: 'Rua Teste',
            numero: '123',
            bairro: 'Bairro Teste',
            complemento: 'Apt 101',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '01310-100',
          },
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.nome).toBe('Test User E2E');
      expect(response.body.data.status).toBe('ativo');
      userId = response.body.data.id;
    });

    it('should fail when email already exists', async () => {
      const email = `duplicate-${Date.now()}@example.com`;

      await request(BASE_URL)
        .post('/api/users')
        .send({
          nome: 'User 1',
          email,
          endereco: {
            rua: 'Rua',
            numero: '1',
            bairro: 'Bairro',
            complemento: 'Apt',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '01310-100',
          },
        })
        .expect(201);

      const response = await request(BASE_URL)
        .post('/api/users')
        .send({
          nome: 'User 2',
          email,
          endereco: {
            rua: 'Rua',
            numero: '2',
            bairro: 'Bairro',
            complemento: 'Apt',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '01310-100',
          },
        });

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Email already exists');
    });
  });

  describe('GET /api/users - List Users', () => {
    it('should list all users', async () => {
      const response = await request(BASE_URL)
        .get('/api/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/users/:id - Get User by ID', () => {
    it('should get user by id', async () => {
      const response = await request(BASE_URL)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(userId);
      expect(response.body.data.nome).toBe('Test User E2E');
    });

    it('should return 404 for non-existent user', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(BASE_URL)
        .get(`/api/users/${fakeId}`);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/:id - Update User', () => {
    it('should update user successfully', async () => {
      const response = await request(BASE_URL)
        .put(`/api/users/${userId}`)
        .send({
          nome: 'Updated User E2E',
          email: `updated-${Date.now()}@example.com`,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.nome).toBe('Updated User E2E');
    });
  });

  describe('POST /api/users/:id/deactivate - Deactivate User', () => {
    it('should deactivate user', async () => {
      const response = await request(BASE_URL)
        .post(`/api/users/${userId}/deactivate`)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('inativo');
    });
  });

  describe('POST /api/users/:id/activate - Activate User', () => {
    it('should activate user', async () => {
      const response = await request(BASE_URL)
        .post(`/api/users/${userId}/activate`)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe('ativo');
    });
  });

  describe('DELETE /api/users/:id - Delete User', () => {
    beforeAll(async () => {
      const response = await request(BASE_URL)
        .post('/api/users')
        .send({
          nome: 'User for Delete',
          email: `delete-test-${Date.now()}@example.com`,
          endereco: {
            rua: 'Rua',
            numero: '1',
            bairro: 'Bairro',
            complemento: 'Apt',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '01310-100',
          },
        });
      userIdForDelete = response.body.data.id;
    });

    it('should soft delete user', async () => {
      const response = await request(BASE_URL)
        .delete(`/api/users/${userIdForDelete}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should restore deleted user', async () => {
      const response = await request(BASE_URL)
        .post(`/api/users/${userIdForDelete}/restore`)
        .expect(201);

      expect(response.body.success).toBe(true);
      if (response.body.data) {
        expect(response.body.data.status).toBe('ativo');
      }
    });

    it('should find restored user', async () => {
      const response = await request(BASE_URL)
        .get(`/api/users/${userIdForDelete}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(userIdForDelete);
    });
  });
});
