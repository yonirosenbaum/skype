const passport = require('passport');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//2 strategies for signin/signup and provide token 
// and the other to check a token when someone requests
// a resource and then afterwards provides the resource.
const localLogin = new LocalStrategy({username: 'username'}, 
    function(username, password, done){
        //Verify this username and password, call done
        //with the user if it is the correct username and password
        //otherwise, call done with false
        User.findOne({username: username}, function(err, user){
            if(err){
                return done(err)
            }
            if(!user){
                return done(null, false)
            }
            //compare passwords
            
            if password = sql password return done(null,user)
            if no match return done(null, false)

        })
})

//Setup options for JWT Strategy
//Tells JWT to extract a token from a header called authorization
const jwtOptions = {
    jwtFromRquest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};
//function called whenever user tries to login
//payload is the decoded JWT token created by tokenForUser
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
    //Check if user ID exists in the database and pass it onto done
    //with user object
//looks like mongoDB methods
        username.findOne(payload.sub, function(err, user){
            // if error connecting to user
            if(err){
                return done(err, false)
            }
            //if username is incorrect
            if(user){
                return done(null, user)
            } else{
                done(null, false)
            }
            //pass on user object of valid
        })
    }
)
//Tell passport to use the strategy
passport.use(jwtLogin);
passport.use(localLogin);