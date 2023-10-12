import SessionDTO from "../DAO/DTO/Session.DTO.js";
import usersService from "../services/users.service.js";


class SessionController{

session (req, res) {
// llamar al DTO 
    const dataFormated = new SessionDTO(req.session);
    return res.status(200).json(dataFormated);
};

failReg(req, res) {
    const { error } = req.flash();
    return res.status(400).render("error", { error });
}

failLogin (req, res) {
    const { error } = req.flash();
    return res.status(400).render("error", { error });
}

register (req, res) {
    return res.render('register', {});
}

registerOk(req, res) {
    if (!req.user) {
        return res.json({ error: 'something went wrong' });
    }
    req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, age: req.user.age, role: req.user.role, };
    return res.redirect("/auth/profile");
}

login (req, res) {
    return res.render('login', {});
}

async loginOk (req, res) {
    if (!req.user) {
        return res.json({ error: 'invalid credentials' });
    }
    req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, role: req.user.role, age: req.user.age, cartId: req.user.cartId };
    await usersService.saveLoginTime(req.user._id);
    return res.redirect("/auth/profile");
}

async logout (req, res) {
    await usersService.saveLoginTime(req.user._id);
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).render('error', { error: 'no se pudo cerrar su session' });
        }
        return res.redirect('/auth/login');
    });
}

profile (req, res) {
    const dataFormated = new SessionDTO(req.session);
    return res.render("profile", {
        firstname: dataFormated.firstName,
        lastname: dataFormated.lastName,
        email: dataFormated.email,
        isadmin: dataFormated.role,
        cartId: dataFormated.cartId,
    });
}

async callbackProfile (req, res) {
    await usersService.saveLoginTime(req.user._id);
    
    req.session.user = req.session.user ?? {};
    req.session.user.firstName =req.user.firstName;
    req.session.user.lastName =req.user.lastName;
    req.session.user.role =req.user.role;
    req.session.user.email =req.user.email;
    req.session.user.age =req.user.age;
    req.session.user.cartId =req.user.cartId;

    // Redirige al usuario a la página deseada después de iniciar sesión correctamente
    res.redirect("/auth/profile");
}

callbackFacebook (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
}


}
export const sessionController = new SessionController();