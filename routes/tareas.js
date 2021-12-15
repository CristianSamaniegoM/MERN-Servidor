const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Crear una tarea
// api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'El Nombre de la tarea es obligatorio').not().isEmpty(),
        check('proyecto', 'El Proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

//api/tareas/
router.get('/',
    auth,
    tareaController.obtenerTareas
);

//api/tareas/:id
//Actualizar tarea
router.put('/:id',
    auth,
    tareaController.modificarTarea
);

//api/tareas/:id
//Eliminar tarea
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
);

module.exports = router;