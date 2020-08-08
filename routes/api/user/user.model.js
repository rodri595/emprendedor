const db = require('../../db/db');
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');

let userColl;

module.exports = class {
    static async initModel() {
        if (! userColl) {
            let _db = await db.getDB();
            console.log(_db)
            userColl = await _db.collection('usuarios');
            if (process.env.ENSUREINDEX == "1") {
                await userColl.createIndex({
                    "email": 1
                }, {unique: true});
            }
            return;
        } else {
            return;
        }
    } // initModel

    static async addnew(data) {
        const {email, nombreCompleto, password} = data;
        try {
            let newUser = {
                "email": email,
                "nombreCompleto": nombreCompleto,
                "password": bcrypt.hashSync(password, 10),
                "datecreated": new Date().getTime(),
                "status": 'ACT',
                "roles": ["standard"]
            }
            let rslt = await userColl.insertOne(newUser);
            return rslt;
        } catch (err) {
            console.log(err);
            return err;
        }
    } // addnew

    static async getByEmail(email) {
        try {
            let filter = {
                "email": email
            };
            let user = await userColl.findOne(filter);
            return user;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static async findEmail(email) {
        try {
            let filter = {
                "email": email
            };
            let user = await userColl.find(filter).count();
            return user;
        } catch (err) {
            return false;
        }
    }

    static async comparePassword(rawPassword, cryptedPassword) {
        try {
            return bcrypt.compareSync(rawPassword, cryptedPassword);
        } catch (err) {
            return false;
        }
    }
}
