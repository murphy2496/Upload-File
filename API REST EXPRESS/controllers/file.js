 /**********************************/
/* import des modules necessaires */
const DB = require('../db-config')
const File = DB.File

const fs = require('fs');
const path = require('path');

const {RequestError, FileError } = require('../error/customError')

 /************************************/
/* routage de la ressource etudiant */
exports.addFile = async (req, res, io) => {
    try{

        //console.log(req.file)
        const { originalname } = req.file
        const { fileName } = req.body

        const tempPath = req.file.path
        //console.log('originalname : ' + originalname, + ' path : ' + tempPath + ' fileName : ' + fileName)

        if(!originalname || !tempPath){
            throw new RequestError('Verifier le fichier')
        }

        const NameFile = fileName || originalname
        const newPath = path.join('uploads', NameFile)

        // renommer fichier 
        fs.rename(tempPath, newPath, (err) => {
            if (err) {
            console.error('Erreur lors du renommage du fichier:', err)
            throw new FileError('Erreur lors de l\'enregistrement du fichier', 2)
            //return res.status(500).send('Erreur lors de l\'enregistrement du fichier')
            }
            //console.log('Fichier renomer avec succès')
        })
        
        let file = await File.findOne({ where: { nomFile: fileName }, raw: true })
        if(file !== null){
            throw new FileError(`le fichier existe déjà `, 1)
        }
        
        await File.create({ 
            nomFile: fileName, pathFile: newPath
        })
        
        io.emit('NewFileAdded')

        return res.status(201).json({message: 'Fichier importé avec succès'})
    }catch(err){
        if (err.name == 'SequelizeDatabaseError') {
            res.status(500).json({ message: 'Database Error', Error: err })
        }
        res.json({error: err})
    }
}
//-------------------------------------------------------------------------------------------------------------------
exports.getAllFileName =  (req, res, next) => {
    File.findAll({
                    attributes: ['id', 'nomFile','createdAt'],
                    order: [['createdAt', 'DESC']]  // Tri par ordre décroissant de createdAt
                })
                .then(file => res.status(200).json({data: file}))
                .catch(err => next(err))
}
//----------------------------------------------------------------------------------------------------------------
exports.getFile = async (req, res, next) => {
    try{
        const id = req.params.id
        if(!id){
            throw new RequestError('Missing Parameter')
        }

        let file = await File.findOne({ where: { id: id }, raw: true })
        if(!file){
            throw new FileError('This file does not exist !', 0)
        }

        res.download(file.pathFile)
    }catch(err){
        next(err)
    }
}
//----------------------------------------------------------------------------------------------------------------------------------------------
exports.deleteFile = async (req, res, io, next) => {
    try{
        let id = req.params.id
        if(!id){
            throw new RequestError('Missing parameter')
        }
        // Récupérer l'enregistrement du fichier dans la base de données pour obtenir le nom du fichier
        const fileRecord = await File.findOne({ where: { id: id } })
        if (!fileRecord) {
            throw new RequestError('Fichier non trouvé')
        }
        //console.log('fileRecord:', fileRecord)

        // Construire le chemin absolu du fichier à partir du chemin relatif stocké dans la base de données
        const filePath = path.resolve(__dirname, '..', fileRecord.dataValues.pathFile);
        console.log('filePath:', filePath);
        // Supprimer le fichier du système de fichiers en utilisant fs.unlink
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log('Erreur lors de la suppression du fichier :', err)
                return res.status(500).json({ message: 'Erreur lors de la suppression du fichier sur le serveur' })
            }

            console.log('Fichier supprimé avec succès')
        })

        await File.destroy({ where: { id: id }, force: true })

        io.emit('FileDeleted')

        return res.status(200).json({ message: 'File Deleted' })
    }catch(err){
        next(err)
    }
}