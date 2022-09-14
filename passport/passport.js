const passport = require('passport')
const User = require('../model/user')

var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function (user, done) {
    process.nextTick(function () {
        return done(null, user.id);
    });
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) { return next(err); }
        return done(null, user);
    })
});


passport.use(new GoogleStrategy({
    clientID: "140693850520-nbvmjr3bchpj2q3ov4ro7jeh0ee24t54.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:4000/auth/google/callback"
},
    (accessToken, refreshToken, profile, next) => {
        console.log('MY PROFILE', profile._json.email);
        User.findOne({ email: profile._json.email })
            .then(user => {
                if (user) {
                    console.log("User already exists in DB", user);
                    //cookietoken()
                    next(null, user);
                } else {
                    User.create({
                        name: profile.displayName,
                        googleId: profile.id,
                        email: profile._json.email
                    }).then(user => {
                        console.log("New User", user);
                        next(null, user)
                    }).catch(err => console.log(err))
                }
            })
    }
));
