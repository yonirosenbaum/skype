const Authentification = require('./controllers/authentification');
const passportService = require('./services/passport');
const passport = require('passport');

//authentificate with JWT and don't create a new cookie 
//based session since we are using JWT. 
const requireAuth = passport.authenticate('jwt', {session: false});
const requireSignin = passport.authenticate('local', {session: false})

module.exports = function(app){
    app.get('/', requireAuth, function(req,res){
        res.send({hi: 'there'})
    })
    app.post('/signin', requireSignIn, Authentification.signin);
    app.post('/signup', Authentification.signup);
}