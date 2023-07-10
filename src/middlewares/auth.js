export function isUser(req, res, next) {
    if (req.session?.user?.email) {
        return next();
    } else if (req.session?.passport?.user) {
        return next();
    }
    return res.status(401).render('error', { error: 'error de autenticacion!' });
}

export function isAdmin(req, res, next) {
    if (req.session?.user?.isAdmin) {
        return next();
    }
    return res.status(403).render('error', { error: 'error de autorización!' });
}

export function isLoggedin (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/products");
};

export function redirectIfLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/products");
    }
    return next();
};