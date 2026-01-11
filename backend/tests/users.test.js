import request from 'supertest';
import app from './test-setup.js';

describe('POST /users', () => {
    test('should create a user with valid data', async () => {
        const userData = { name: 'daviddd' };

        const response = await request(app)
            .post('/users')
            .send(userData)
            .set('Content-Type', 'application/json')
            .expect(200);

        expect(response.body).toEqual({
            message: 'Utilisateur créé',
            user: userData
        });
    });

    test('should return 400 error when no data is sent', async () => {
        const response = await request(app)
            .post('/users')
            .send({})
            .set('Content-Type', 'application/json')
            .expect(400);

        expect(response.body).toEqual({
            error: 'Nom invalide'
        });
    });

    test('should return 400 error when name is invalid', async () => {
        const response = await request(app)
            .post('/users')
            .send({ name: 123 })
            .set('Content-Type', 'application/json')
            .expect(400);

        expect(response.body).toEqual({
            error: 'Nom invalide'
        });
    });

    test('should return 400 error when name is missing', async () => {
        const response = await request(app)
            .post('/users')
            .send({ email: 'test@example.com' })
            .set('Content-Type', 'application/json')
            .expect(400);

        expect(response.body).toEqual({
            error: 'Nom invalide'
        });
    });
});
