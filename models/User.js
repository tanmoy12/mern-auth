const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    facebookProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
    },
    googleProvider: {
        type: {
            id: String,
            token: String
        },
        select: false
    }
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UserSchema.statics.comparePassword = function (passw, userpass, cb) {
    bcrypt.compare(passw, userpass, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

UserSchema.set('toJSON', {getters: true, virtuals: true});

UserSchema.statics.upsertUser = function(name, email, password, cb) {
    var that = this;
    return this.findOne({
        'email': email
    }, function(err, user) {
        // no user was found, lets create a new one
        if(err) return cb("Sign up failed", null);
        if (!user) {
            const newUser = new that();
            newUser.name = name;
            newUser.email = email;
            newUser.password = password;

            console.log(newUser);

            newUser.save(function(err, user) {
                if (err)
                    return cb("Sign up failed", null);
                else{
                    return cb(null, user)
                }

            });
        } else {
            return cb("Email already registered", null);
        }
    });
};

UserSchema.statics.checkUser = function(email, password, cb) {
    var that = this;
    return this.findOne({ email: email}, function(err, user) {
        if (err) cb("Server error", null);

        if (!user) {
            cb("User not found", null);
        } else {
            // check if password matches
            that.comparePassword(password, user.password, function (err, isMatch) {
                if (isMatch && !err) {
                    cb(null, user);
                } 
                else {
                    cb("Username & Password do not match", null);
                }
            });
        }
    });
};

UserSchema.statics.upsertFbUser = function(accessToken, refreshToken, profile, cb) {
    var that = this;
    return this.findOne({
        $or: [ { 'email':  profile.emails[0].value}, { 'facebookProvider.id': profile.id } ] 
    }, function(err, user) {
        // no user was found, lets create a new one
        if (!user) {
            var newUser = new that({
                name: profile.displayName,
                email: profile.emails[0].value,
                facebookProvider: {
                    id: profile.id,
                    token: accessToken
                }
            });

            newUser.save(function(err, savedUser) {
                if (err) {
                    cb("Server error", null);
                }else{
                    return cb(null, savedUser);
                }
                
            });
        } else {
            var query   = { _id: user._id }; 
            var update  = { facebookProvider: {
                    id: profile.id,
                    token: accessToken
                } }; 
            var options = { new: true }; 
            that.findOneAndUpdate(query, update, options, function(err, savedUser){ 
              if (err) {
                        cb("Server error", null);
                    }else{
                        console.log(savedUser);
                        return cb(null, savedUser);
                    } 
            });
        }
    });
};

UserSchema.statics.upsertGoogleUser = function(accessToken, refreshToken, profile, cb) {
    var that = this;
    return this.findOne({
        $or: [ { 'email':  profile.emails[0].value}, { 'googleProvider.id': profile.id } ] 
    }, function(err, user) {
        // no user was found, lets create a new one
        if (!user) {
            var newUser = new that({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleProvider: {
                    id: profile.id,
                    token: accessToken
                }
            });

            newUser.save(function(err, savedUser) {
                if (err) {
                    cb("Server error", null);
                }else{
                    return cb(null, savedUser);
                }
                
            });
        } else {
            var query   = { _id: user._id }; 
            var update  = { googleProvider: {
                    id: profile.id,
                    token: accessToken
                } }; 
            var options = { new: true }; 
            that.findOneAndUpdate(query, update, options, function(err, savedUser){ 
              if (err) {
                        cb("Server error", null);
                    }else{
                        console.log(savedUser);
                        return cb(null, savedUser);
                    } 
            });
        }
    });
};



module.exports = mongoose.model('User', UserSchema);