import { faker } from '@faker-js/faker';


class MockingService {
    async generateProduct() {
        const fake= {        
            title: faker.commerce.productName(),
            price: faker.commerce.price(),
            stock: faker.number.int(1500),
            id: faker.database.mongodbObjectId(),
            thumbnails: faker.image.avatar(),
            description: faker.commerce.productDescription(),
            code: faker.string.uuid(),
        }
        return fake;
    }
}

    export const mockingService = new MockingService();