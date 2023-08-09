import { mockingService } from "../services/mocking.service.js";

class MockingController {
    async get(req, res) {
        let products=[];
        try {
            for (let i = 0; i < 100; i++) {
                const product = await mockingService.generateProduct();
                products.push(product);
            }
            res.send({ status: "success", payload: products });

        } catch (e) {
            console.log(e);
            return res.status(500).json({
                status: "error",
                msg: "something went wrong :(",
                data: {},
            });
        }
    }
}

export const mockingController = new MockingController();