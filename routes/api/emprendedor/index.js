const express = require('express');
let router = express.Router();
const model = require('./emprendedor.model');

const init = async () => {
    await model.initModel();
};
init();
/**************************        GETALL            **************************************/
router.get('/', async (req, res) => {
    try {
        let emprendedor = await model.getAll();
        res.status(200).json(emprendedor);
    } catch (err) {
        console.log(err);
        res.status(500).json({"Error": "Algo Sucedio Mal intentar de nuevo."});
    }
});
// get /
/**************************        NEW            **************************************/
router.post('/new', async (req, res) => {
    try {
        var {
            email
        } = req.body;
        var check = await model.findEmail(email);
        if (check == 0) {
            const rslt = await model.addOne(req.user._id, req.user.email, req.body);
            res.status(200).json(rslt);
        } else {
            res.status(401).json({"error": "Correo de Emprendedor ya Existe"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({"Error": "Algo Sucedio Mal intentar de nuevo."});
    }
});
// post /new

/**************************        FIND ONE            **************************************/
router.get('/:id', async (req, res) => {
    try {
        let {id} = req.params;
        let emprendedor = await model.getOne(id);
        res.status(200).json(emprendedor);
    } catch (err) {
        console.log(err);
        res.status(500).json({"Error": "Algo Sucedio Mal intentar de nuevo."});
    }
});
// get one
/**************************        FIND BY AREA            **************************************/
router.get('/findbyarea', async (req, res) => {
    try {
        var {
            areas
        } = req.body;
        let emprendedor = await model.getArea(id);
        res.status(200).json(emprendedor);
    } catch (err) {
        console.log(err);
        res.status(500).json({"Error": "Algo Sucedio Mal intentar de nuevo."});
    }
});
// get one

/**************************        DELETE            **************************************/
router.put('/del/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const result = await model.deleteOne(req.user._id, req.user.email, id);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({"Error": "Algo Sucedio Mal intentar de nuevo."});
    }
});
/**************************        UPDATE          **************************************/
router.put('/upd/:id', async (req, res) => {
    try {
        const {id} = req.params;
        var {
            areas,
            status
        } = req.body;
        var update = {};

        if (areas && !(/^\s*$/).test(areas)) {
            update.areas = areas;
        }
        if (status && !(/^\s*$/).test(status)) {
            update.status = status;
        }

        const result = await model.update(req.user._id, req.user.email, id, update);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({"Error": "Algo Sucedio Mal intentar de nuevo."});
    }
});


/***************************RATING********************************************************/
/**************************        LIKE            **************************************/
router.get('/verifylike/:id', async (req, res) => {
    try {
        let {id} = req.params;
        let check = await model.veryfiyLike(req.user._id, id);
        res.status(200).json(check);
    } catch (err) {
        console.log(err);
        res.status(500).json({"Error": "Algo Sucedio Mal intentar de nuevo."});
    }
});

router.put('/like/:id', async (req, res) => {
    try {
        let {id} = req.params;
        let verify = await model.veryfiyLike(req.user._id, id);
        if (! verify) {
            var check = await model.like(req.user._id, id);
            res.status(200).json(check);
        } else {

            var check = await model.dislike(req.user._id, id);
            res.status(200).json(check);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({"Error": "Algo Sucedio Mal intentar de nuevo."});
    }
});

module.exports = router;
