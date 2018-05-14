let passport = require("passport");
let User = require("../models/user");
let LocalStrategy = require("passport-local").Strategy;

module.exports = function(passport){ 
passport.serializeUser((User,done)=>{
    done(null,User.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id,(err,User)=>{
        done(err,User);
    });
});

passport.use('local-signup',new LocalStrategy({
    email: 'email',
    password: 'password',
    firstName: 'firstName',
    lastName: 'lastname',
    phoneNumber: 'phoneNumber',
    passReqToCallback: true
},(req,email,password,firstName,lastname,phoneNumber,done)=>{
    console.log("in passport");
    req.checkBody('email', 'invalid email').notEmpty().isLength({min:4});
    req.checkBody('firstname', 'invalid firstName').notEmpty().isLength({min:4});
    req.checkBody('lastName', 'invalid lastName').notEmpty().isLength({min:4});
    req.checkBody('phoneNumber', 'invalid phoneNumber').notEmpty().isLength({min:11});
    let errs = req.validationErrors();
    if (errs) {
        let messages = [];
        errs.forEach((err)=>{
            messages.push(err.msg);
        });
        return done(null,false,req.flash('error', messages));
    }
    User.findOne({'email': email,'phoneNumer':phoneNumber},(err,document)=>{
        if (err) {
            return done(err);
        }
        if (document) {
            return done(null,false,{message: "Email or phone number has been taken"});
        }
        let newUser = new User();
        newUser.local.email = emrequire("./config/auth");ail;
        newUser.local.password = firstName;
        newUser.local.lastname = lastName;
        newUser.local.phoneNumber = phoneNumber;
        newUser.local.password = newUser.encryptPassword(password);
        newUser.save((err,data)=>{
            console.log("data",data)
            if (err) return done(err);
            return done(null, newUser);
        });
    });
} ));

passport.use('local.signin', new LocalStrategy({
  email:'email',
  password:'password',
  passReqToCallback:true
},function(req,email,password,done){
  req.checkBody('email','Invalid email').notEmpty();
  req.checkBody('password','Invalid password').notEmpty();
  var errors=req.validationErrors();
  if(errors){
    var messages=[];
    errors.forEach(function(error){
      messages.push(error.msg);
    });
    return done(null,false,req.flash('error', messages));
  }
  User.findOne({'email':email},function(err,user){
    if(err){
      return done(err);
    }
    if(!user){
      return done(null,false,{message:'No user found.'});
    }
    if(!user.validPassword(password)){
    return done(null,false,{message:'Wrong password.'});
    }
     return done(null, user);
  });

}))};
