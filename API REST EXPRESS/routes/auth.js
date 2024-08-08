 /**********************************/
/* import des modules necessaires */
const express = require('express')
const authCtrl = require('../controllers/auth')

 /*************************************/
/* récupération du routeur d'express */
let router = express.Router()

 /*******************************************************/
/* middleware pour enregistrer le temps de la requêtes */

router.use( (req, res, next) => { 
    const event = new Date()
    console.log('AUTH Time : ', event.toString())
    next() 
})

 /********************************/
/* routage de la ressource auth */

router.post('/login', authCtrl.login)

module.exports = router