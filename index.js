const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

const app = express();

// Conectar la db
conectarDB();

// Habilitar Cors
app.use(cors());

// Habilitar express.json
app.use(express.json({ extended: true }));

const port = process.env.port || 4000;

// Definir la página principal
// app.get('/', (req, res) =>{
//     res.send('Hola Mundo')
// })

// Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/proyectos', require('./routes/proyectos'))
app.use('/api/tareas', require('./routes/tareas'))

//arrancar la app 'Se añade 0.0.0.0 solo para migrar'
app.listen(port, '0.0.0.0', () =>{
    console.log(`El servidor esta funcionando en el puerto ${ port }`)
});

console.log("Carga desde Index.js")