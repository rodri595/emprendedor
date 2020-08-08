// Rutas de la Entidad de Seguridad
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

let userModel = require('./user.model');

let init = async () => {
  await userModel.initModel();
};
init();
/**************************        SIGN IN            **************************************/
router.post('/signin', async (req, res) => {
  try {
    var {email, password} = req.body;
    if (email === '' || password == '') {
      return res.status(400).json({
        status: 'EMAIL_PASSW_EMPTY',
        message: 'El correo y la contreseña son necesarios',
      });
    }
    if (
      !/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(
        email
      )
    ) {
      return res.status(400).json({
        status: 'EMAIL_INVALIDO',
        message: 'El correo electrónico debe ser uno válido',
      });
    }
    if (
      !/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%])[0-9A-Za-z\.!@#$%]{8,32}$/.test(
        password
      )
    ) {
      return res.status(400).json({
        status: 'PASSWORD_INVALIDO',
        message:
          'La contraseña debe contener al menos una Mayúscula, una Minúscula, un número y un signo especial ! @ # $ % y mínimo 8 caracteres',
      });
    }
    var {email} = req.body;
    var check = await userModel.findEmail(email);
    if (check == 0) {
      var rslt = await userModel.addnew(req.body);
      res.status(200).json({
        status: 'OK',
        message:
          'Ha sido creado nueva cuenta, bienvenido al Emprendedor Clank ' +
          req.body.email +
          '. Por favor ingrese al emprendedor',
      });
    } else {
      res.status(400).json({
        status: 'EMAIL_EXISTENTE',
        message: 'El correo ya existe, por favor intente otro correo',
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({status: 'NOT_SERVER', message: 'Por favor intente mas tarde'});
  }
});

/**************************        LOGIN            **************************************/
router.post('/login', async (req, res) => {
  try {
    var {email, pswd} = req.body;
    if (email === '' || pswd == '') {
      return res.status(400).json({
        status: 'EMAIL_PASSW_EMPTY',
        message: 'El correo y la contreseña son necesarios',
      });
    }
    if (
      !/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(
        email
      )
    ) {
      return res.status(400).json({
        status: 'EMAIL_INVALIDO',
        message: 'El correo electrónico debe ser uno válido',
      });
    }
    var user = await userModel.getByEmail(email);
    if (await userModel.comparePassword(pswd, user.password)) {
      const {email, roles, status, _id} = user;
      const jUser = {
        email,
        roles,
        status,
        _id,
      };
      let token = jwt.sign(jUser, process.env.JWT_SECRET, {
        expiresIn: '9999999m',
      });
      res.status(200).json({
        ...jUser,
        jwt: token,
      });
    } else {
      res.status(401).json({
        status: 'CREDENCIAL_INVALIDO',
        message: 'Credenciales Incorrectas',
      });
    }
  } catch (err) {
    res
      .status(500)
      .json({status: 'EMAIL_NOT_EXISTENTE', message: 'No existe el correo'});
  }
});

module.exports = router;
