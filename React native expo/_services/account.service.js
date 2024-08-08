import AsyncStorage from '@react-native-async-storage/async-storage'
import Axios from './caller.service'


let login = (donnee) => {
    return Axios.post('/auth/login', donnee)
}

let saveToken = (Token) => {
    AsyncStorage.setItem('user-info', Token)
}

let logout = () => {
    AsyncStorage.removeItem('user-info')
}

let getToken = () => {
    AsyncStorage.getItem('user-info')
}

let islogged = () => {
    var token = AsyncStorage.getItem('user-info')
    return !!token // booléen
}


export const accountService = {
    login, saveToken, logout, getToken, islogged
}