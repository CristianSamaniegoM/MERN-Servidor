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

const PORT = process.env.PORT || 4000;

// Definir la página principal
// app.get('/', (req, res) =>{
//     res.send('Hola Mundo')
// })

// Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/proyectos', require('./routes/proyectos'))
app.use('/api/tareas', require('./routes/tareas'))

app.listen(PORT, () =>{
    console.log(`El servidor esta funcionando en el puerto ${ PORT }`)
});

console.log("Carga desde Index.js")