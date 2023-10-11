import { UserModel } from './models/user.model.js'; // Asegúrate de que la ruta sea correcta

class UserManager {
    // Método para buscar un usuario por correo electrónico
    async findOneByEmail(emailString) {
        const email = emailString.email
        try {
            const user = await UserModel.findOne({ email });
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(userId) {
        try {
            const user = await UserModel.findById(userId);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getAllUsers() {
        try {
            const users = await UserModel.find().sort({ username: 1 });
            return users;
        } catch (error) {
            throw error;
        }
    }
}

export default new UserManager();

