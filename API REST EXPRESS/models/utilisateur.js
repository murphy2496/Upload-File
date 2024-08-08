/**********************************/
/* import des modules necessaires */
const {DataTypes} = require('sequelize')

const bcrypt = require('bcrypt')

 /************************************/
/* définition du modèle utilisateur */

module.exports = (sequelize) => {
    const Utilisateur = sequelize.define('Utilisateur', {
        nom:{
            type: DataTypes.STRING(30),
            defaultValue: '',
            allowNull: false
        },
        prenom:{
            type: DataTypes.STRING(50),
            defaultValue: '',
            allowNull: false
        },
        password:{
            type: DataTypes.STRING(64),
            is: /^[0-9a-f]{64}$/i
        },
        email:{
            type: DataTypes.STRING(150),
            validate:{
                isEmail: true
            }, 
            allowNull: false
        }
    }, { tableName: 'Utilisateur' })

    Utilisateur.beforeCreate( async (user, Options) => {
        let hash = await bcrypt.hash(user.password, parseInt(process.env.BCRYPT_SALT_ROUND))
        user.password = hash
        //console.log(user)
    })

    Utilisateur.checkPassword = async (password, originel) => {
        return await bcrypt.compare(password, originel)
    }

    return Utilisateur
}