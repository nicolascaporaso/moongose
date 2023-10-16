import UserService from '../services/users.service.js';

class UserController {
    async deleteInactiveUsers(req, res) {
        try {
            const result = await UserService.deleteInactiveUsers();
            console.log(result);
            return res.status(204).json({ message: 'Operación exitosa', result: result });
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


async deleteUser(req, res) {
    try {
        const data = await UserService.deleteUser(req.params.ID);
        return res.status(201).json({ message: "user removed from system", data });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};

async changeRole(req, res) {
    try {
        const userId = req.params.ID;
        const newRole = req.query.newRole;
        const data = await UserService.changeRole(userId, newRole);
        return res.status(201).json({ message: "role changed", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ha ocurrido un error al actualizar el rol del usuario.' });
    }
};

}

export const userController = new UserController();