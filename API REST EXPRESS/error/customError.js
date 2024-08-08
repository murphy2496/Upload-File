// créer des erreurs personalisé 

class MainError extends Error{

    constructor(errorMessage, errorType = ''){ 
        super()

        this.name =  this.constructor.name
        this.message = errorMessage

        switch(this.constructor.name){
            case 'RequestError':
                this.statusCode = 400  // bad request
                break
            case 'AuthenticationError':
                console.log('authentication error')
                if(errorType == 0){
                    this.statusCode = 400
                } else if(errorType == 1){
                    this.statusCode = 404
                } else {
                    this.statusCode = 401
                }
                break
            case 'UserError':
                console.log('user error')
                if(errorType == 0){
                    this.statusCode = 404
                } else{
                    this.statusCode = 409
                }
                break
            case 'FileError':
                if(errorType == 0){
                    this.statusCode = 404  // not found
                } else if(errorType == 1){
                    this.statusCode = 409  // existe déja
                } else {
                    this.statusCode == 500
                }
                break
            default:
                console.log('NO HANDLER FOR THAT')
        }
    }
}

class RequestError extends MainError{}
class AuthenticationError extends MainError{}
class UserError extends MainError{}
class FileError extends MainError{}

module.exports = { MainError, RequestError, AuthenticationError, UserError, FileError }