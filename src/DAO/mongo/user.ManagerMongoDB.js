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

    async deleteUser(_id) {
        try {
            const result = await UserModel.findByIdAndRemove(_id);
            return result;
        } catch (error) {
            console.error(error);
            throw new Error('Error al eliminar usuario');
        }
    }

    async updateRole(userId, newRole) {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(userId, { role: newRole }, { new: true });
            return updatedUser;

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

async findDelete(twoDaysAgo) {
    try {
        const oldUsers = await UserModel.find({lastLogin: { $lte: twoDaysAgo },}).exec();
        return oldUsers;

    } catch (error) {
        console.error(error);
        throw error;
    }
}
}

export default new UserManager();

