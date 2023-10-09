import chai from 'chai';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import { log } from 'console';


const expect = chai.expect;
const requester = supertest('http://127.0.0.1:8081');

const mockUser = {
    firstName: 'Maximo',
    lastName: 'Lorenzo',
    email: faker.internet.email(),
    password: '123',
    age: 22,
};

let cookieName
let cookieValue


describe('REGISTER / LOGIN / SESSION   Pruebas para la autenticación ', () => {
    it('Debería registrar al usuario y redireccionar a /products', (done) => {
        requester
            .post('/auth/register')
            .send(mockUser)
            .expect(302)
            .end((err, res) => {
                if (err) return done(err);

                expect(res.header.location).to.equal('/products');
                done();
            });
    });

    it('Debe loggear un user y DEVOLVER UNA COOKIE', async () => {
        const result = await requester.post('/auth/login').send({
            email: mockUser.email,
            password: mockUser.password,
        });

        const cookie = result.headers['set-cookie'][0];
        expect(cookie).to.be.ok;

        cookieName = cookie.split('=')[0];
        cookieValue = cookie.split('=')[1];

        expect(cookieName).to.be.ok.and.eql('coderCookie');
        expect(cookieValue).to.be.ok;
    });


    it('Enviar cookie para ver el contenido del user', async () => {
        const { _body } = await requester.get('/auth/session/current').set('Cookie', [`${cookieName}=${cookieValue}`]);
        expect(_body.email).to.be.eql(mockUser.email);
    });

});

describe('Pruebas para la ruta api/carts/', () => {
    it('Debería obtener un arreglo de carritos', async () => {

        const response = await requester
            .get('/api/carts');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });

    it('Debería crear un nuevo carrito y devolver el ID', async () => {
        const response = await requester
            .post('/api/carts');

        expect(response.status).to.equal(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('id').that.is.a('string');
    });


    it('Debería agregar un producto al carrito y devolver un mensaje si el usuario está autenticado y autorizado', async () => {
        const userCredentials = {
            email: "Isabel.Gottlieb@gmail.com",
            password: "123",
        };

        const loginResponse = await requester
            .post('/auth/login')
            .send(userCredentials);

        expect(loginResponse.status).to.equal(302);


        const cartId = '65245be482188b93d4a06c8c';
        const productId = '64f5223dada87c1b451a52d6';
        const quantityToAdd = 1;

        const response = await requester
            .put(`/api/carts/${cartId}/product/${productId}`)
            .set('Cookie', loginResponse.headers['set-cookie'])
            .send({ quantity: quantityToAdd });

        expect(response.status).to.equal(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('message').that.is.a('string');

    });
});


describe('Pruebas para la ruta api/products/', () => {
    it('Debería obtener un arreglo de productos', async () => {
        const response = await requester
            .get('/api/products');
        expect(response.status).to.equal(200);
        expect(response._body.payload).to.be.an('array');
    });

    it('Debería crear un nuevo producto cuando el usuario está autenticado y autorizado', async () => {

        const userCredentials = {
            email: "Isabel.Gottlieb@gmail.com",
            password: "123",
        };

        const loginResponse = await requester
            .post('/auth/login')
            .send(userCredentials);

        expect(loginResponse.status).to.equal(302);

        const productData = {
            title: 'Producto de prueba',
            description: 'Descripción de prueba',
            code: 'tl0kjjo1',
            price: 10,
            stock: 100,
            status: 'true',
        };

        const response = await requester
            .post('/api/products')
            .set('Cookie', loginResponse.headers['set-cookie'])
            .field('title', productData.title)
            .field('description', productData.description)
            .field('code', productData.code)
            .field('price', productData.price)
            .field('stock', productData.stock)
            .field('status', productData.status)
            .attach('thumbnails', './src/test/house.jpg');


        expect(response.status).to.equal(201);
        expect(response.body).to.be.an('object');
        expect(response.body).to.have.property('msg', 'Product create');
        expect(response.body).to.have.property('data');

        const createdProduct = response.body.data;
        expect(createdProduct).to.have.property('title', productData.title);
        expect(createdProduct).to.have.property('description', productData.description);
        expect(createdProduct).to.have.property('code', productData.code);

    });
});