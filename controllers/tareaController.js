const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// Crear una Tarea
exports.crearTarea = async (req, res) =>{

    //Revisar si hay errores
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errores: errors.array()})
    }

    
    try {
        // Extraer el Proyecto y comprobar si existe
        const { proyecto } = req.body;
        
        const existeProyecto = await Proyecto.findById(proyecto);

        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado'})
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        // Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error - Crear Tarea');
    }

}

// obtener tareas por proyecto
exports.obtenerTareas = async (req,res) =>{
    
    try {
        // Extraer el Proyecto y comprobar si existe
        // const { proyecto } = req.body; Solo se usa cuando no se usa params
        const { proyecto } = req.query; //Query se usa con params
            
        const existeProyecto = await Proyecto.findById(proyecto);

        if (!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado'})
        }

        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        // Obtener tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });

        res.json({ tareas })

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error en obtener tareas');
    }

}

// Actualizar Tarea
exports.modificarTarea = async (req,res) =>{
    try {
        // Extraer el Proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body;
    
        // Verificar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);
        
        if(!tarea){
            return res.status(404).json({ msg: 'Tarea no encontrado'})
        }
        
        // Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        
        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        // Crear un objeto con la nueva información
        const nuevaTarea = {};

//      if(nombre) 
//      if(estado) 

        nuevaTarea.nombre = nombre; 
        nuevaTarea.estado = estado; 

        //Guardar Tarea
        tarea = await Tarea.findOneAndUpdate({ id: req.params.id }, nuevaTarea, { new: true });

        res.json({ tarea })

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }
}

exports.eliminarTarea = async (req, res) =>{
    try {
        // Extraer el Proyecto y comprobar si existe
        // const { proyecto } = req.body;
        const { proyecto } = req.query;
    
        // Verificar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);
        
        if(!tarea){
            return res.status(404).json({ msg: 'Tarea no encontrado'})
        }
        
        // Extraer proyecto
        const existeProyecto = await Proyecto.findById(proyecto);
        
        // Revisar si el proyecto actual pertenece al usuario autenticado
        if(existeProyecto.creador.toString() !== req.usuario.id){
            return res.status(401).json({ msg: 'No Autorizado' })
        }

        //Eliminar
        await Tarea.findByIdAndRemove({ _id : req.params.id })
        res.json({msg: 'Tarea Eliminada'})

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error')
    }   
}