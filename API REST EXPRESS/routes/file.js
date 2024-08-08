 /**********************************/
/* import des modules necessaires */
const express = require('express')
const path = require('path')
const mime = require('mime-types')
const fs = require('fs');

const fileCtrl= require('../controllers/file')

const multer = require('multer')

const { getSocketIO } = require('../server')  
const io = getSocketIO()                     

 /*************************************/
/* récupération du routeur d'express */
let router = express.Router()

 /*******************************************************/
/* middleware pour enregistrer le temps de la requêtes */ 
router.use( (req, res, next) => {
  const event = new Date()
  console.log('File Time : ', event.toString())
  next()
})

 /**************************************************/
/* middleware pour stocker fichier dans un dossier*/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

 /************************************/
/* routage de la ressource file */


// insérer un nouveau fichier
router.post('/File', upload.single("file"), (req, res, next) => {
    //console.log('test mlay : ', req.file)
    fileCtrl.addFile(req, res, io, next)
})

// récupérer tout les nom fichier
router.get('/File', fileCtrl.getAllFileName)

// récupérer un fichier
router.get('/File/id/:id', fileCtrl.getFile)

// supprimer un fichier
router.delete('/File/:id', (req, res, next) => {
    fileCtrl.deleteFile(req, res, io, next) 
})
// servir les fichiers
router.get('/files/:filename', (req, res, next) => {
    const { filename } = req.params;
    const filePath = path.resolve('uploads', filename);

    console.log(`Requête pour le fichier : ${filePath}`);

    if (fs.existsSync(filePath)) {
        // Obtenir les informations sur le fichier
        const stats = fs.statSync(filePath);
        console.log(`Envoi du fichier : ${filePath}`);
        console.log(`Taille du fichier : ${stats.size} octets`);

        // Envoyer le fichier
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Erreur lors de l\'envoi du fichier:', err);
                next(err);
            }
        });
    } else {
        console.log(`Fichier non trouvé : ${filePath}`);
        res.status(404).json({ error: 'File not found' });
    }
});


module.exports = router