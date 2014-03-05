'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport'),
    fs = require('fs'),
    path = require('path');

/**
 * Create user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.save(function(err) {
    if (err) return res.json(400, err);
    
    req.logIn(newUser, function(err) {
      if (err) return next(err);

      return res.json(req.user.userInfo);
    });
  });
};

/**
 *  Get profile of specified user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(404);

    res.send({ profile: user.profile });
  });
};

/**
 * Change password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return res.send(400);

        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get current user
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};


/**
 * Get/Set user avatar
 */
exports.avatar = function (req, res) {
    console.log("get avatar");

};
exports.changeAvatar = function (req, res) {
    var userId = req.user._id;

    var temp = req.files.file.path;
    var filename = req.files.file.name;
    var target = "./app/images/" + req.files.file.name;

    console.log("changing avatar to", filename, "for user", userId);

    fs.rename(temp, target, function (err) {
        if (err) throw err;
        console.log("updating avatar for user", userId);
        User.findById(userId, function (err, user) {
            if (err) throw err;
            user.avatar = "./images/" + filename;
            user.save(function (err) {
                if (err) {
                    console.log("user", userId, "could not be updated");
                    return res.send(400);
                }
                res.send(200, { avatar: user.avatar });
            });
        });
    });
};