import express from 'express';
import passport from 'passport';
import { isAdmin, isUser, isLoggedin,  } from '../middlewares/auth.js';
import { log } from 'console';



export const authRouter = express.Router();


//-------------------------------------- para probar la session -----------------------
authRouter.get('/session', (req, res) => {
    return res.send(JSON.stringify(req.session));
});


//------------------------------------passport local------------------------
authRouter.get("/failregister", (req, res) => {
    const { error } = req.flash();
    return res.status(400).render("error", { error });
});

authRouter.get('/faillogin', async (req, res) => {
    const { error } = req.flash();
    return res.status(400).render("error", { error });
});


authRouter.get('/register', (req, res) => {
    return res.render('register', {});
});

authRouter.post('/register', passport.authenticate('register', { failureRedirect: '/auth/failregister' }),
    (req, res) => {
        if (!req.user) {
            return res.json({ error: 'something went wrong' });
        }
        req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, age: req.user.age, role: req.user.role, };
        return res.redirect("/products");
    });



authRouter.get('/login', (req, res) => {
    return res.render('login', {});
});

authRouter.post('/login', passport.authenticate('login', { failureRedirect: '/auth/faillogin' }),
    (req, res) => {
        if (!req.user) {
            return res.json({ error: 'invalid credentials' });
        }
        req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, role: req.user.role, age: req.user.age, cartId: req.user.cartId };
        return res.redirect("/products");
    });



authRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).render('error', { error: 'no se pudo cerrar su session' });
        }
        return res.redirect('/auth/login');
    });
});


authRouter.get("/profile", isLoggedin,  (req, res) => {
    console.log(req.session.user);
    const role = req.session.user.role === "admin" ? "Administrador" : "Usuario Estándar";
    return res.render("profile", {
        firstname: req.session.user.firstName,
        lastname: req.session.user.lastName,
        email: req.session.user.email,
        isadmin: role,
        age: req.session.user.age,
        cartId: req.session.user.cartId,
    });
});


//--------------------------------github -----------------------------------

authRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

authRouter.get("/github/callback", passport.authenticate("github", { failureRedirect: "/error" }), 
(req, res) => {
    
    req.session.user = req.session.user ?? {};
    req.session.user.firstName =req.user.firstName;
    req.session.user.lastName =req.user.lastName;
    req.session.user.role =req.user.role;
    req.session.user.email =req.user.email;
    req.session.user.age =req.user.age;
    req.session.user.cartId =req.user.cartId;

    // Redirige al usuario a la página deseada después de iniciar sesión correctamente
    res.redirect("/auth/profile");
});


//--------------------------------FACEBOOK -----------------------------------

authRouter.get(
    "/facebook",
    passport.authorize("facebook", { scope: ["email"] })
);

authRouter.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

/*
authRoutes.get(
"/google",
passport.authenticate("google", { scope: ["profile", "email"] })
);

authRoutes.get(
"/google/callback",
passport.authenticate("google", { failureRedirect: "/auth/fail-register" }),
(req, res) => {
req.session.email = req.user.email;
req.session.role = req.user.role;
req.session.first_name = req.user.first_name;
req.session.last_name = req.user.last_name;
req.session.age = req.user.age;
req.session.cartID = req.user.cartID;
return res.redirect("/products");
}
);
*/