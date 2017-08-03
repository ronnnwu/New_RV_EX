/**
 * Created by ronnnwu on 7/9/17.
 */

let mysqlServer = require("./connutil");

class user{

    constructor(userid, username, password){
        this.USERID = userid;
        this.USERNAME = username;
        this.PASSWORD = password;
    }

    // check username exists
    usernameExists(){
        mysqlServer.query('SELECT * FROM LOGIN_TABLE WHERE USERNAME = ?',
                            [this.USERNAME],  function(err, rows) {

            if (err)
                return callback(err);

            return rows.length === 1;

        });
    }


    // verify users and login
    usernameLookUpPass(callback){

        mysqlServer.query('SELECT * FROM LOGIN_TABLE WHERE USERNAME = ?',
                            [this.USERNAME], (err, rows) => {

            if (err)
                return callback(err);
            if (!rows.length){
                return callback(null, null);
            }
            this.USERID = rows[0].USERID;
            this.PASSWORD = rows[0].USERPASSWORD;
            return callback(null, this);

        });
    }

    // create user
    addUser(callback){
        mysqlServer.query('INSERT INTO LOGIN_TABLE(USERNAME, USERPASSWORD) VALUES( ?, ?)',
            [this.USERNAME, this.PASSWORD], (err, result) => {

                if (err) {
                    return callback(err);
                }
                this.USERID = result.insertId;
                return callback(null, this);
        });
    }

    //

}

module.exports = user;

//
// exports.getAllUsers = (callback) => {
//
//     mysqlServer.query('SELECT * FROM USER_TABLE',  function(err, rows) {
//
//         if (err)
//             return callback(err);
//
//         return callback(null, rows);
//
//     });
// };

