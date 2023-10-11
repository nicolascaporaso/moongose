import UserService from '../services/users.service.js';

class UserController {
    async deleteInactiveUsers(req, res) {
        try {
            const result = await UserService.deleteInactiveUsers();
            return res.status(204).end(); // Usuarios inactivos eliminados con éxito
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error general al eliminar usuarios inactivos' });
        }
    }

    async listUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error general al listar usuarios' });
        }
    }
}

export const userController = new UserController();