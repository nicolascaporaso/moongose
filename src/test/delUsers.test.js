import chai from 'chai';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';

const expect = chai.expect;
const requester = supertest('http://127.0.0.1:8081');

const mockUser = {
    firstName: 'prueba',
    lastName: 'delete',
    email: faker.internet.email(),
    password: '123',
    age: 22,
};

let cookieName;
let cookieValue;

describe('REGISTER / LOGIN / SESSION Pruebas para la autenticación', () => {
    // ... tus pruebas de registro y inicio de sesión aquí ...

    it('Eliminar un usuario', async () => {
        // Supongamos que tienes un usuario que deseas eliminar, puedes obtener su ID o alguna otra forma de identificarlo.
        const userIdToDelete = 'usuario_a_eliminar_id';

        const response = await requester
            .delete(`/api/users/${userIdToDelete}`)
            .set('Cookie', [`${cookieName}=${cookieValue}`]); // Asegúrate de estar autenticado

        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message', 'Usuario eliminado con éxito');
    });
});