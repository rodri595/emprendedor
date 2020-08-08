const db = require('../../db/db');
const ObjectId = require('mongodb').ObjectId;
let emprendedorColl;

module.exports = class {
    static async initModel() {
        if (! emprendedorColl) {
            let _db = await db.getDB();
            emprendedorColl = await _db.collection('emprendedores');
            return;
        } else {
            return;
        }
    }
    /**************************        GETALL            **************************************/
    static async getAll() {
        try {
            if (emprendedorColl) {
                let registro = await emprendedorColl.find();
                return registro.toArray();
            }
            return [];
        } catch (err) {
            console.log(err);
            return err;
        }
    }
    /**************************        NEW EMPRENDEDOR            **************************************/
    static async findEmail(email) {
        try {
            let filter = {
                "email": email
            };
            let emprendedor = await emprendedorColl.find(filter).count();
            return emprendedor;
        } catch (err) {
            return false;
        }
    }

    static async addOne(ownerId, ownerEmail, data) {
        const {nombreCompleto, email, areas} = data;
        try {
            const newEmprendedor = {
                "email": email,
                "nombreCompleto": nombreCompleto,
                "areas": [areas],
                "roles": [
                    "emprendedor", "standard"
                ],
                "infocreated": {
                    "userId": ownerId,
                    "userEmail": ownerEmail,
                    "datecreated": new Date().getTime()
                },
                "status": 'ACT'
            }

            const result = await emprendedorColl.insertOne(newEmprendedor);
            return result;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
    /**************************        FINDONE            **************************************/

    static async getOne(id) {
        try {
            let filter = {
                "_id": new ObjectId(id)
            };
            const result = await emprendedorColl.findOne(filter);
            return result;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
    /**************************        FIND BY AREA           **************************************/

    static async getArea(emp) {
        try {
            let filter = {
                "areas": {
                    "$all": [emp]
                }

            };
            const result = await emprendedorColl.find(filter);
            return result;
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    /**************************       DELETE            **************************************/
    static async deleteOne(ownerId, ownerEmail, id) {
        try {
            let filter = {
                "_id": new ObjectId(id)
            };

            var update = {
                "$set": {
                    "status": "DELETED",
                    "infoDeleted": {
                        "userId": ownerId,
                        "userEmail": ownerEmail,
                        "dateDeleted": new Date().getTime()
                    }
                },
                "$inc": {
                    "Deleted": 1
                }
            };
            const result = await emprendedorColl.findOneAndUpdate(filter, update);
            return result;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
    /**************************       UPDATE            **************************************/
    static async update(ownerId, ownerEmail, id, update) {
        try {
            let filter = {
                "_id": new ObjectId(id)
            };
            var {
                areas,
                status
            } = update;

            var update = {
                "$set": {
                    "areas": areas,
                    "status": status
                },
                "$push": {
                    "infoUpdate": {
                        "userId": ownerId,
                        "userEmail": ownerEmail,
                        "datelastUpdate": new Date().getTime()
                    }

                },

                "$inc": {
                    "Updates": 1
                }
            };
            const result = await emprendedorColl.findOneAndUpdate(filter, update);
            return result;
        } catch (err) {
            console.log(err);
            return err;
        }
    }


    /****************************************RATING************** */

    static async veryfiyLike(ownerId, id) {
        try {
            let filter = {
                "_id": new ObjectId(id),
                "infoLike": {
                    "userId": ownerId
                }
            };
            const check = await emprendedorColl.find(filter).count() > 0;
            if (check) 
                return true


            


            if (! check) 
                return false;
            


        } catch (err) {
            console.log(err);
            return err;
        }

    }

    static async dislike(ownerId, id) {
        try {
            let postId = {
                "_id": new ObjectId(id),
                "infoLike": {
                    "userId": ownerId
                }
            };
            let userdisLike = {
                "$inc": {
                    "like": -1
                },
                "$pull": {
                    "infoLike": {
                        "userId": ownerId

                    }
                }
            };
            const result = await emprendedorColl.updateOne(postId, userdisLike);
            return result;
        } catch (err) {
            return err;
        }
    }
    static async like(ownerId, id) {
        try {
            let postId = {
                "_id": new ObjectId(id)
            };
            let userLike = {
                "$inc": {
                    "like": 1
                },
                "$push": {
                    "infoLike": {
                        "userId": ownerId

                    }
                }
            };
            const result = await emprendedorColl.updateOne(postId, userLike);
            return result;
        } catch (err) {
            return err;
        }
    }
} // class
