const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async(req, res) =>{
    // console.log(req.body)

    // Revisar errores con express validator configurado en routes
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errores: errors.array()})
    }

    // Extraer email y password
    const { email, password } = req.body

    try {
        // Revisar que el usuario registrado sea único
        let usuario = await Usuario.findOne({ email });

        if(usuario){
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        // Crear nuevo usuario
        usuario = new Usuario(req.body);

        // Encriptar la clave del usuario con bcryptjs
        const salt = await bcryptjs.genSalt(10); //Vueltas de encriptación
        usuario.password = await bcryptjs.hash(password, salt);

        // Guardar el usuario
        await usuario.save();

        //Crear y firmar el JWT, que se usa como la varible Sesssion en PHP
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        //Firmar el JWT
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600 //Va estar activo por 1 hora
        }, (error, token) =>{
            if(error) throw error;
            res.json({ token: token, msg:'Usuario creado' })
        })

        // Mensaje de confirmación
        // res.send('Usuario creado satisfactoriamente');
    } catch (error) {
        console.log(error);
        res.status(400).send('Hubo un error'); 
    }
}