const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

var uri = "mongodb+srv://simar:Atlas123@senecaweb.pvkyjrm.mongodb.net/FinalTest4";

const finalUsers = new Schema({
    "email": {
        "type": String,
        "unique": true
    },
    "password": String,
});

let User;

exports.startDB = function(){
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection(uri, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {

            if (err) {
                console.log("Cannot connect to DB.");
                reject(err);
            }
            else {
                User = db.model("finalusers", finalUsers);
                console.log("DB connection successful.");
                resolve();
            }
        });
    })
}


exports.register = function(user){
    return new Promise((resolve, reject) => {
        if (user.password == "" || user.password.trim().length == 0 || user.useremail == "" || user.useremail.trim().length == 0) {
            reject("Error: email or password cannot be empty.");
        }
        else {
            bcrypt.hash(user.password, 10).then((hash) => {
                user.password = hash;
                let newUser = new User({
                email: user.useremail,
                password: user.password
            });
                newUser.save((err) => {
                    if (err) {
                        if (err.code == 11000) {
                            reject(user.useremail + " already exits");
                        }
                        else {
                            reject("Error: cannot create the user.");
                        }
                    }
                    else {
                        resolve();
                    }
                })
            }).catch(() => {
                reject("There was an error encrypting the password")
            })

        }

    })
}

exports.signIn = function(user){
    return new Promise((resolve, reject) => {
        User.findOne({ email: user.useremail })
            .exec()
            .then((foundUser) => {
                if (email = "") {
                    reject("Unable to find user: " + user.useremail)
                }
                else {
                    bcrypt.compare(user.password, foundUser.password).then((res) => {

                        if (res == true) {
                            resolve(foundUser);
                        }
                        else {
                            reject('Incorrect Password for user: '+ user.useremail);
                        }
                    })
                }
            })
            .catch(() => {
                reject("Unable to find user: " + user.useremail);
            })
    })
}
