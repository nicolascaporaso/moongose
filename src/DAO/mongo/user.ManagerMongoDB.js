import { UserModel } from './models/user.model.js'; // Asegúrate de que la ruta sea correcta

class UserManager {

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

    async updateUser(user, newData) {
        try {
            await UserModel.findByIdAndUpdate(user, newData);
            return user;
        } catch (error) {
            throw error;
        }
    }

async deleteMany(twoDaysAgo) {
    try {
        const result = await UserModel.deleteMany({ lastLogin: { $lt: twoDaysAgo } });
        return result;
    } catch (error) {
        console.error(error);
        throw new Error('Error al eliminar usuarios');
    }
}

async deleteUser(id) {
    try {
        const result = await UserModel.findByIdAndRemove(id);
        return result;
    } catch (error) {
        console.error(error);
        throw new Error('Error al eliminar usuario');
    }
}

}


export default new UserManager();

