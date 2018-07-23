const express = require('express');
const authRouter = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('../settings/config');
require('../settings/passport')(passport);
const jwt = require('jsonwebtoken');

const User = require('../models/User');

authRouter.route('/signup')
    .post(function(req, res) {
        console.log(req.body);
        User.upsertUser(req.body.name, req.body.email, req.body.password, function(err, user) {
            if(err){
              return res.status(403).send({success: false, msg: err});
            }
            else {
              console.log("success");
              let token = jwt.sign(user.toJSON(), config.secret);
              res.json({success: true, token: 'JWT ' + token, name: user.name, username: user.username});
            }
        });
    });

authRouter.route('/login')
    .post(function(req, res){
        console.log(req.body);
        User.checkUser(req.body.email, req.body.password, function(err, user) {
            if (err) {
              return res.status(403).send({success: false, msg: err});
            }
            else {
              let token = jwt.sign(user.toJSON(), config.secret);
              res.json({success: true, token: 'JWT ' +token, name: user.name, username: user.username});
            } 
        });
    });

authRouter.route('/facebook')
    .post(passport.authenticate('facebook-token', {session: false}), function(req, res) {
      console.log("in route ", req.user);
        if (!req.user) {
            return res.status(401).send({success: false, msg: 'User not Authenticated'});
        }
        let token = jwt.sign(req.user.toJSON(), config.secret);
        res.json({success: true, token: 'JWT ' + token, name: req.user.name, username: req.user.username});
    });

authRouter.route('/google')
    .post(passport.authenticate('google-token', {session: false}), function(req, res) {
        console.log("in route ", req.user);

        if (!req.user) {
            return res.status(401).send({success: false, msg: 'User not Authenticated'});
        }
        let token = jwt.sign(req.user.toJSON(), config.secret);
        res.json({success: true, token: 'JWT ' + token, name: req.user.name, username: req.user.username});
    });

authRouter.get('/profile', passport.authenticate('jwt', { session: false}), function(req, res) {
  // console.log('headers' , req.headers)
  let token = getToken(req.headers);
  // console.log('token' , token);
  // console.log('user' , req.user);
  if (token) {
    return res.json({success: true, msg: 'authorized.', user: req.user});
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
  } else {
      return null;
  }
} else {
    return null;
}
};


module.exports = authRouter;