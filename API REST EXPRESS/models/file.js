 /**********************************/
/* import des modules necessaires */
const {DataTypes} = require('sequelize')

 /*****************************/
/* définition du modèle file */

module.exports = (sequelize) => {
    const File = sequelize.define('File',{
        nomFile:{
            type: DataTypes.STRING(70),
            allowNull: false
        },
        pathFile:{
            type:  DataTypes.STRING(80),
            allowNull: false
        }
    }, { tableName: 'File' })

    return File
}