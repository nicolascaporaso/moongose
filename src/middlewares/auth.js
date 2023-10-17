export function isUser(req, res, next) {
    const userRole = req.session?.user?.role;
    if (userRole === 'user') {
        return next();
    }
    return res.status(401).render('error', { error: 'error de autenticacion!' });
}


export function isPremium(req, res, next) {
    const userRole = req.session?.user?.role;
    if (userRole === 'admin') {
        return next();
    }
    return res.status(403).render('error', { error: 'error de autorización!' });
}


export function isAdmin(req, res, next) {
    const userRole = req.session?.user?.role;
    if (userRole === 'admin') {
        return next();
    }
    return res.status(403).render('error', { error: 'error de autorización!' });
}

export function isLoggedin (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
};

export function redirectIfLoggedIn (req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/products");
    }
    return next();
};

export function isUserCartOwner (req, res, next) {
    if (req.session?.user?.cartId == req.params.cid) {
        return next();
    }
    return res.status(403).render('error', { error: 'error de autorización!' });
};

export function isUserCartOwnerOrAdmin (req, res, next) {
    if (req.session?.user?.cartId == req.params.cid || req.session?.user?.role === 'admin') {
        return next();
    }
    return res.status(403).render('error', { error: 'error de autorización!' });
};