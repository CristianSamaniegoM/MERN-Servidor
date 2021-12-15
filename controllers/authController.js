const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autenticarUsuario = async (req, res) =>{

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errores: errors.array()})
    }

    // Extraer el email y el password
    const { email, password } = req.body;

    try {
        // Revisar un usuario registrado
        let usuario = await Usuario.findOne({ email })

        if (!usuario) {
            return res.status(400).json({msg: 'El usuario no existe'})
        }

        // Revisar password
        const passCorrecto = await bcryptjs.compare(password, usuario.password)

        if(!passCorrecto){
            return res.status(400).json({msg: 'Password Incorrecto'})
        }

        // Si todo es correcto, firmar el JWT, que se usa como la varible Sesssion en PHP
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
            res.json({ token: token })
        })


    } catch (error) {
        console.log(error)
    }

}

// Obtiene usuario que esta autenticado
exports.usuarioAutenticado = async(req, res) => {
    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({ usuario });
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: 'Error de obtencion de datos'});
    }
}