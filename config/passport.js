const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');

module.exports = (passport) => {
    passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => { //usernameField specifies element in the form 
        // get and match the user
        User.findOne({email: email})
        .then((user) => {
            if(!user){ // no match
                return done(null, false, {message: 'Email address not registered.'});
            }

            // match found
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;

                if(isMatch){
                    return done(null, user);
                }
                else{
                    return done(null, false, {message: 'Incorrect username or password.'});
                }
            })
        })
        .catch((err) => {console.log(err);})
    }));

    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
};