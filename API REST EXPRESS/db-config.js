 /***********************************/
/* import des modules néccessaires */
const {Sequelize} = require('sequelize')

 /**********************************/
/* connexion à la base de données */
let sequelize = new Sequelize(
    process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false
    }
)

 /*******************************/
/* mise en place des relations */
const db = {}

db.sequelize = sequelize
db.Utilisateur = require('./models/utilisateur')(sequelize)
db.File = require('./models/file')(sequelize)

 /**************************************/
/* synchronisation global des modèles */ 
sequelize.sync( err => {
    console.log('Database sync Error', err)
})

module.exports = db