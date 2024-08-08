 /***********************************/
/* import des modules néccessaires */
const express =  require('express')
const cors = require('cors')
const { Server } = require('socket.io') 

//const checkTokenMiddleware = require('./middleware/check')
const  errorHandler = require('./error/errorHandler')
 /**********************************/
/* import de la connexion à la DB */
let DB = require('./db-config')

 /**************************/
/* intialisation de l'API */ 
const app = express()

app.use(cors({
  allowedHeaders: "Origin, X-Requested-With, x-access-token, role, Content, Accept, Content-Type, Authorization",
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/*-------- Socket.IO et créez un serveur --------*/
const io = new Server({ 
  cors: { /* origin: "http://localhost:3001", */ }
})
module.exports.getSocketIO = () => io 
io.listen(process.env.SERVER_SOCKET)

 /*********************************/
/* import des modules de routage */
const user_router = require('./routes/utilisateur')
const auth_router = require('./routes/auth')

const file_router = require('./routes/file')

 /****************************/
/* mise en place du routage */
app.get('/', (req, res) => res.send(`Weldone !`)) 

app.use('/users', user_router)
app.use('/auth', auth_router)

app.use('/file',  /*checkTokenMiddleware,*/ file_router)

app.get('*', (req, res) => res.status(501).send(`Not Found !`))

app.use(errorHandler)

 /*****************************/
/* Start server avec test DB */
DB.sequelize.authenticate()
  .then(() => console.log('Database connection is OK !!!'))
  .then(() => {
        app.listen(process.env.SERVER_PORT, () => {  
            console.log(`This server is running on port ${process.env.SERVER_PORT}`)
        })
  })
  .catch(err => console.log('Database error', err))