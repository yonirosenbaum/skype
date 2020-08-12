const jwt = require('jwt-simple');
const config = require('../config');

//DO I PUT (NEXT) IN THIS???
// encode the user id since this will be consistent to use as a token
const tokenForUser = (id) => {
    const timestamp = new Date().getTime()
    console.log('id:', id, 'iat:', timestamp)
    return jwt.encode({sub: id, iat: timestamp}, config.secret);
}

exports.signin = function(req, res, next){
    //User has had username and password authorised
    //Here they are given a token from req.user
    res.send({token: tokenForUser(req.user)})
}

exports.signup = function(req,res,next){
    const email = req.body.email;
    const password = req.body.password;
    if(!email || !password){
        return res.status(422).send({error: 'You must provide email and password.'})
    }
}

module.exports = tokenForUser;