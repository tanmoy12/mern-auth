var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var FacebookTokenStrategy = require('passport-facebook-token');
var GoogleTokenStrategy = require('passport-google-token').Strategy;
// load up the user model
var User = require('../models/User');
var config = require('../settings/config'); // get settings file
module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = config.secret; 
  
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    // console.log("payload", jwt_payload);
    User.findOne({_id: jwt_payload._id}, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
            
              done(null, user);
          } else {
              done(null, false);
          }
      });
  }));

  passport.use(new FacebookTokenStrategy({
            clientID: config.facebookAuth.clientID,
            clientSecret: config.facebookAuth.clientSecret
        },
        function (accessToken, refreshToken, profile, done) {
            // console.log(accessToken);
            User.upsertFbUser(accessToken, refreshToken, profile, function(err, user) {
                console.log("returning fb passport", profile.displayName);
                return done(err, user);
            });
        }));
  passport.use(new GoogleTokenStrategy({
            clientID: config.googleAuth.clientID,
            clientSecret: config.googleAuth.clientSecret
        },
        function (accessToken, refreshToken, profile, done) {
            User.upsertGoogleUser(accessToken, refreshToken, profile, function(err, user) {
                return done(err, user);
            });
        }));
}