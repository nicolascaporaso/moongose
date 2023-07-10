import passport from 'passport';
import FacebookStrategy from 'passport-facebook';
import GitHubStrategy from 'passport-github2';
import local from 'passport-local';
import { UserModel } from '../DAO/models/user.model.js';
import { CartService } from '../services/cart.service.js';
import { createHash, isValidPassword } from '../utils.js';

const LocalStrategy = local.Strategy;
const cartSrvc = new CartService();


// variables de entorno
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export function iniPassport() {

    // --------------------------------------PASSPORT LOCAL-------------------------
    passport.use(
        'login',
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: "password",
                passReqToCallback: true,
            },

            async (req, username, password, done) => {
                try {

                    const { email, password } = req.body; // Obtener datos del formulario de inicio de sesión 
                    if (!email || !password) {
                        // Si el email o la contraseña están vacíos
                        req.flash("error", "Por favor indique su email y password."); // Mensaje flash de error
                        return done(null, false); // Devolver resultado falso en la función de devolución de llamada
                    }

                    const user = await UserModel.findOne({ email: username });
                    if (!user) {
                        req.flash("error", 'User Not Found with username (email) ' + username);
                        return done(null, false);
                    }
                    if (!isValidPassword(password, user.password)) {
                        req.flash("error", 'Invalid Password, please try again');
                        return done(null, false);
                    }

                    return done(null, user);

                } catch (error) {
                    return done(new Error(error));
                }
            }
        )
    );

    passport.use(
        'register',
        new LocalStrategy(
            {
                passReqToCallback: true,
                usernameField: 'email',
                failureFlash: true, // indica que se deben almacenar mensajes flash en la sesión en caso de que ocurra un error 
            },
            async (req, username, password, done) => {
                try {
                    const { email, firstName, lastName, password, age } = req.body;

                    if (!email || !password || !firstName || !lastName || !age) {
                        req.flash("error", "Por favor indique sus datos correctamente.");
                        return done(null, false);
                    }

                    let user = await UserModel.findOne({ email: username });
                    if (user) {
                        req.flash("error", "El mail ya se encuentra en uso.");
                        return done(null, false);
                    }

                    const newCart = await cartSrvc.createCart(); // Crear un nuevo carrito                

                    const newUser = {
                        email,
                        firstName,
                        lastName,
                        role: "user",
                        age,
                        cartId: newCart,
                        password: createHash(password),
                    };

                    let userCreated = await UserModel.create(newUser);
                    console.log(userCreated);
                    console.log('User Registration succesful');


                    return done(null, userCreated);
                } catch (error) {
                    console.log('Error in register');
                    return done(new Error(error));
                }
            }
        )
    );
    //---------------------------------------------GITHUB------------------------------------------------
    passport.use(
        'github',
        new GitHubStrategy(
            {
                clientID: GITHUB_CLIENT_ID,
                clientSecret: GITHUB_CLIENT_SECRET,
                callbackURL: 'http://127.0.0.1:8081/auth/github/callback',
            },
            async (accesToken, _, profile, done) => {
                console.log(profile);
                try {
                    const res = await fetch('https://api.github.com/user/emails', {
                        headers: {
                            Accept: 'application/vnd.github+json',
                            Authorization: 'Bearer ' + accesToken,
                            'X-Github-Api-Version': '2022-11-28',
                        },
                    });
                    const emails = await res.json();
                    const emailDetail = emails.find((email) => email.verified == true);

                    if (!emailDetail) {
                        return done(new Error('cannot get a valid email for this user'));
                    }
                    profile.email = emailDetail.email;

                    let user = await UserModel.findOne({ email: profile.email });
                    if (!user) {
                        const newCart = await cartSrvc.createCart(); // Crear un nuevo carrito  

                        const newUser = {
                            email: profile.email,
                            firstName: profile._json.name || profile._json.login || 'noname',
                            lastName: 'none',
                            role: "user",
                            password: 'GitHub-User',
                            age: "0",
                            cartId: newCart,

                        };
                        let userCreated = await UserModel.create(newUser);
                        console.log('User Registration succesful');
                        return done(null, userCreated);
                    } else {
                        console.log('User already exists');
                        return done(null, user);
                    }


                } catch (e) {
                    console.log('Error en auth github');
                    console.log(e);
                    return done(e);
                }
            }
        )
    );

    //-------------------------------FACEBOOK ----------------------------

    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: 'http://127.0.0.1:8081/auth/facebook/callback',
        profileFields: ["id", "displayName", "email"],
    },
        async (accessToken, refreshToken, profile, done) => {

            try {
                const { email } = profile._json;
                let user = await UserModel.findOne({ email: email });
                if (!user) {
                    const newCart = await Services.addCart();

                    const displayName = profile.displayName.split(" ");
                    const lastName = displayName[1] || "nolastname";
                    const firstName = displayName[0] || "noname";

                    const userCreated = await UserModel.create({
                        firstName: firstName,
                        lastName: lastName,
                        email,
                        age: 0,
                        password: "Facebook-User",
                        cartID: newCart,
                        role: "user",
                    });

                    return done(null, userCreated);
                } else {

                    return done(null, user);
                }
            } catch (error) {
                console.log("Error en auth facebook");
                console.log(error);
                return done(new Error(error));
            }
        }
    )
    );


    //----------------------------- Google Strategy ----------------------------------

    /* passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:8080/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, done) => {
                // console.log(profile);
                try {
                    const { email, given_name, family_name } = profile._json;
                    let user = await UserModel.findOne({ email: email });
                    if (!user) {
                        const newCart = await Services.addCart();
                        const cartID = newCart.result.payload._id.toString();

                        // console.log("No existe el usuario. Se crearà uno nuevo");
                        const userCreated = await UserModel.create({
                            first_name: given_name,
                            last_name: family_name,
                            email,
                            age: 18,
                            password: "Google-User",
                            cartID,
                            role: "user",
                        });
                        // console.log("Usuario creado correctamente:", userCreated);
                        return done(null, userCreated);
                    } else {
                        // console.log("Usuario ya existe");
                        return done(null, user);
                    }
                } catch (error) {
                    console.log("Error en auth google");
                    console.log(error);
                    return done(new Error(error));
                }
            }
        )
    );*/


    //----------------------------------------------------------------------


    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById(id);
        done(null, user);
    });
}
