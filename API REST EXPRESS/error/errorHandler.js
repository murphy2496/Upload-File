// gérer système de gestion des erreurs

const errorHandler = (err, req, res, next) => {

    // pour modifier système d'affichage erreur
    debugLevel = 0

    message = {}

    switch(debugLevel){
        case 0: 
            message = { message: err.message, error: err }
            if(err.name == 'SequelizeDatabaseError'){
                message = { message: 'Database Error', error: err }
            }
            break
        case 1:
            message = { message: err.message }
            break
        case 2:
            message = { message: err.message, error: err }
            break
        default:
            console.log('Bad debugLevel')
    }

    return res.status(err.statusCode || 500).json(message)
}

module.exports = errorHandler