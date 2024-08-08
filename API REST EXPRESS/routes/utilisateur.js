 /**********************************/
/* import des modules necessaires */
const express = require('express')
const userCtrl = require('../controllers/utilisateur')
 
 /*************************************/
/* récupération du routeur d'express */
let router = express.Router()
 
 /*******************************************************/
/* middleware pour enregistrer le temps de la requêtes */ 
router.use( (req, res, next) => {
    const event = new Date()
    console.log('User Time : ', event.toString())
    next()
})

 /***************************************/
/* routage de la ressource utilisateur */

router.get('/', userCtrl.getAllUsers)

router.get('/:id', userCtrl.getUser)

router.put('', userCtrl.addUser)

router.delete('/:id',userCtrl.deleteUser)

router.patch('/:id', userCtrl.updateUser)


module.exports = router