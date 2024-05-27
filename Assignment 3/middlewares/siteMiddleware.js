module.exports = async function(req,res,next){
    console.log("Session User in Middleware:", req.session.user);
    res.flash = function (type, message) {
        req.session.flash = { type, message };
    };
    res.locals.flash = req.session.flash;
    req.session.flash = null;
    res.locals.user = req.session.user;
    console.log("Locals User in Middleware:", res.locals.user);
    next();
}
