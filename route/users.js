const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');

require('../config/passport')(passport);
// login handle
router.get('/login', (req, res) =>{
    res.render('login');
});
router.get('/register',(req,res)=>{
    res.render('register')
    })
//Register handle
router.post('/register',(req,res)=>{
    const {name, email, password, password2 } = req.body;
    let errors = [];
    console.log('Name:' + name + ' Email:' + email + ' Pass:'+ password + ' Pass2:' + password2)
    if(!name || !email || !password || !password2){
        errors.push({msg: "Please Fill Out all fields."});
    }
    if(password !== password2){
        errors.push({msg: "Passwords do not match."})
    }
    if(password.length < 8){
        errors.push({msg: "Password must be at least 8 character."});
    }
    if(errors.length > 0){
        res.render('register',{
            errors: errors,
            name: name,
            email: email,
            password: password,
            password2: password2
        });
    }
    else{
        User.findOne({email: email}).exec((err, user)=>{
            console.log(user);
            if(user){
                errors.push({msg: "Email already registered."});
                res.render('register', {
                    errors: errors, 
                    name: name, 
                    email: email, 
                    password: password, 
                    password2: password2
                });
            }
            else{
                const newUser = new User({
                    name: name, 
                    email: email,
                    password: password,
                    password2: password2
                });

                // hash the password
                bcrypt.genSalt(10, (err, salt) =>{
                    bcrypt.hash(newUser.password, salt, null, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then((value) => {
                            console.log(value);
                            
                            // flash suces message
                            req.flash('success_msg', "You have successfully registered!");
                            res.redirect('/users/login/');
                        })
                        .catch(value => console.log(value));
                    })
                });
            }
        });
    }
});
router.post('/login',(req,res,next)=>{
    passport.authenticate('local', {
        successRedirect : '/dashboard', 
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//logout
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg', 'Now logged out.');
    res.redirect('/users/login');
 });
module.exports  = router;