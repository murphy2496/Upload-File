 /**********************************/
/* import des modules necessaires */
const bcrypt = require('bcrypt')

const DB = require('../db-config')
const User = DB.Utilisateur

const { RequestError, UserError } = require('../error/customError')
  /***************************************/
 /* routage de la ressource utilisateur */
//-------------------------------------------------------------------------------------------------------------------------------------
exports.getAllUsers =  (req, res, next) => {  
    User.findAll({attributes: ['id', 'nom','prenom', 'email']})
         .then( users => res.json({ data: users })) 
         .catch( err => next(err))
}
//--------------------------------------------------------------------------------------------------------------------------------------
 exports.getUser = async (req, res, next) => {
    try{
        let userId = req.params.id
        if(!userId){
            throw new RequestError('Missing Parameter')
        }

        let user = await User.findOne({ where: { id: userId },
            attributes: ['nom','prenom', 'email'] }) 
        if(user == null){
            throw new UserError('This user does not exist !', 0)
        }

        return res.json({ data: user })

    }catch(err){
        next(err)
    }
     
 }
 //--------------------------------------------------------------------------------------------------------------------------------------------
 exports.addUser = async (req, res, next) => {
    try{
        const { nom, prenom, password, email  } = req.body

        if(!nom || !prenom || !password || !email ){
            throw new RequestError('Missing parameter')
        }

        let user = await User.findOne({ where: { email: email }, raw: true })
        if(user !==null){
            throw new UserError(`The user ${nom} ${prenom} already exists !`, 1)
        }

        user = await User.create(req.body)

        return res.json({ message: 'User Created', data: user})

    }catch(err){
        next(err)
    }
 }
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.deleteUser = async (req, res, next) => {
    try{
        let userId = req.params.id
        if(!userId){
            throw new RequestError('Missing parameter')
        }

        await User.destroy({ where: { id: userId }, force: true })

        return res.status(200).json({ message: 'User Deleted' })
    }catch(err){
        next(err)
    }
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------
exports.updateUser = (req, res) => {
    let userId = req.params.id

    if(!userId){
        return res.status(400).json({ message: 'Missing Parameter' })
    }

    User.findOne({ where: { id: userId }, raw: true })
        .then( user => {

            if(user == null){
                return res.status(404).json({ message: 'This user does not exist !' })
            }

            if(req.body.password){
                bcrypt.hash(req.body.password, parseInt(process.env.BCRYPT_SALT_ROUND))
                      .then( hash => {
                        req.body.password = hash

                        updateUser()
                      })
                      .catch( err => res.status(500).json({ message: 'Hash Process Error', error: err })) 
            } else {
                updateUser()
            }

            function updateUser() {
                User.update(req.body, { where: { id: userId } })
                    .then( user => res.json({ message: 'User Updated', data: user}))
                    .catch( err => res.status(500).json({ message: 'Database Error', error: err }))
            }
        })
        .catch( err => res.status(500).json({ message: 'Database Error', error: err }))
}