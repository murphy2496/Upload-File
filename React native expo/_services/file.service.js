import Axios from './caller.service'


// récupérer tout les nom fichier
let getAllFileName = () => {
    return Axios.get('/file/File')
}
// insérer un nouveau fichier
let addFile = (X, Y) => {
    return Axios.post('/file/File', X, Y)
}
// récupérer un fichier
let getFile = (donnee) => {
    return Axios.get('/file/File/id/' + donnee)
}
// supprimer un fichier
let deleteFile = (donnee) => {
    return Axios.delete('/file/File/' + donnee)
}


export const fileService ={
    getAllFileName, addFile, getFile, deleteFile,
}