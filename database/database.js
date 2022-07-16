const mysql = require('mysql');
const bcrypt = require("bcrypt");

class DB{
    constructor(){
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
    }

    connect(){
        this.connection.connect( (err) => {
            if (err) {
              console.error('error connecting: ' + err.stack);
              return;
            }
          });
    }

    query(sql, args){
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }

    close(){
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }

    async get_user_by_username(username){
        const sql = 'SELECT * FROM users WHERE username = ? AND active = 1';
        const args = [username];
        const rows = await this.query(sql, args);
        return rows[0];
    }

    async check_user(user, password, admin){
        try{            
            const user_row = await this.get_user_by_username(user);
            
            if(!user_row){
                return false;
            }
            
            // check if password is correct and if user is admin, in case of admin check if user is admin if it's user don't check if user is admin
            let is_valid = bcrypt.compareSync(password, user_row.password) && ( user_row.admin == admin || admin == 0 );

            return is_valid;
        }
        catch(err){
            console.log('check_user: ' + err);
        }

        return false;
    }

    async add_user(user, password){
        try{
            console.log('test_add_user');
            const hash_password = bcrypt.hashSync(password, 10);
    
            const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
            const args = [user, hash_password];
            const rows = await this.query(sql, args);
            console.log(JSON.stringify(rows));
        }
        catch(err){
            console.log(err);
        }
    }

    async check_user_test(user, password){
        try{
            console.log('check_user_test');
            // await this.test_add_user(user, password);
            const user_test = await this.get_user_by_username(user);
            console.log(JSON.stringify(user_test));
    
            // success:
            bcrypt.compare(password, user_test.password, (err, res) => {
                if (err)
                    console.log('1- ' + err);
                else  
                    console.log('1- ' + res);
            });
            
            // failure:
            password += '1';
            bcrypt.compare(password, user_test.password, (err, res) => {
                if (err)
                    console.log('2- ' + err);
                else  
                    console.log('2- ' + res);
            });
        }
        catch(err){
            console.log('check_user_test: ' + err);
        }

    }
}

module.exports = DB;


// user table fields:
// id: int(11)
// admin: tinyint(1)
// active: tinyint(1)
// username: varchar(255)
// password: varchar(255)
// will_delete: tinyint(1)
// date_delete: datetime
