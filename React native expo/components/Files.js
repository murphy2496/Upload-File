import React, { useState, useEffect } from 'react'
import { View, Text, TextInput, FlatList, TouchableOpacity, Modal, Button, StyleSheet, Image, Platform } from 'react-native'
import { F } from '../styles/File.style'
import { fileService } from '../_services/file.service'
import socket from '../_services/socket.service'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as FileSystem from 'expo-file-system'
// import * as WebBrowser from 'expo-web-browser'
// import { Video, Audio } from 'expo-av'
// import * as DocumentPicker from 'expo-document-picker'
// import * as IntentLauncher from 'expo-intent-launcher'
import * as Sharing from 'expo-sharing'
import { BASE_URL } from '../_services/fileSystem.service'


const Files = () => {
    const [files, setFiles] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredFiles, setFilteredFiles] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)

    const handleSearch = (query) => {
        setSearchQuery(query)
        setFilteredFiles(files.filter(file => file.nomFile.toLowerCase().includes(query.toLowerCase())))
    }

    useEffect(() => {
        socketN()
        getFileName()
    }, [])

    const getFileName = async () => {
        try {
            let res = await fileService.getAllFileName()
            setFiles(res.data.data)
            setFilteredFiles(res.data.data)
        } catch (err) {
            console.error(err)
        }
    }

    const socketN = () => {
        socket.on('NewFileAdded', () => {
            getFileName()
        })
        socket.on('FileDeleted', () => {
            getFileName()
        })

        return () => {
            socket.off('NewFileAdded')
            socket.off('FileDeleted')
        }
    }

    const openModal = async (item) => {
        setSelectedItem(item)
        setModalVisible(true)
    }

    const closeModal = () => {
        setModalVisible(false)
        setSelectedItem(null)
    }

    const deleteFile = async (fileId) => {
        try {
            //console.log('qsdfsqdf : ', fileId)
            await fileService.deleteFile(fileId)
            closeModal()
            // getFileName() 
        } catch (err) {
            console.error('Error deleting file:', err)
        }
    }

    const getMimeType = (filename) => {
        const extension = filename.split('.').pop().toLowerCase()
        const mimeTypes = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'mp4': 'video/mp4',
            'mkv': 'video/x-matroska',
            'avi': 'video/x-msvideo',
            'mp3': 'audio/mpeg',
            'wav': 'audio/wav',
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'csv': 'text/csv',
            'txt': 'text/plain'
        }
        return mimeTypes[extension] || 'application/octet-stream'
    }

    const downloadAndOpenFile = async (fileN) => {
        try {
            const fileUri = FileSystem.cacheDirectory + `file_${fileN}`
            const mimeType = getMimeType(fileN)

            // Télécharger le fichier dans le répertoire cache
            const { uri } = await FileSystem.downloadAsync(
                `${BASE_URL}${fileN}`,
                fileUri
            )

            //console.log(`Fichier téléchargé avec succès : ${uri}`)

            // Obtenir les informations du fichier pour vérifier sa taille
            // const fileInfo = await FileSystem.getInfoAsync(uri)
            // console.log(`Taille du fichier : ${fileInfo.size} bytes`)

            // Lire le contenu du fichier 
            // const fileContent = await FileSystem.readAsStringAsync(uri)
            // console.log('Contenu du fichier :', fileContent)

            // Ouvrir fichier
            if (Platform.OS === 'android' || Platform.OS === 'ios') {
                if (await Sharing.isAvailableAsync()) {
                    await Sharing.shareAsync(uri, {
                        mimeType: mimeType,
                    })
                } else {
                    console.log('Sharing is not available on this device')
                }
            }
        } catch (err) {
            console.error('Error downloading file:', err)
        }
    }


    return (
        <View style={{ flex: 1, marginHorizontal: 20 }}>
            <TextInput
                placeholder='Rechercher'
                clearButtonMode='always'
                style={F.search}
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={(query) => handleSearch(query)}
            />
            <FlatList
                data={filteredFiles}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => openModal(item)} style={{ padding: 10 }}>
                        <Text style={F.res}>{item.nomFile}</Text>
                    </TouchableOpacity>
                )}
            />

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType='slide'
                onRequestClose={closeModal}
            >
                <View style={F.modalContainer}>
                    <View style={F.modalContent}>
                        <Text style={F.modalTitle}>{selectedItem?.nomFile}{/* selectedItem?.nomFile : Vérifie si selectedItem n'est pas null ou undefined. Si c'est le cas, il accède à la propriété nomFile. Sinon, il renvoie undefined sans lancer d'erreur. */}</Text> 
                        <TouchableOpacity onPress={() => downloadAndOpenFile(selectedItem?.nomFile)} style={F.button}>
                            <MaterialCommunityIcons name="eye" size={24} color="black" />
                            <Text style={[F.buttonText, { color: 'black'}]}>Visualiser</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => downloadAndOpenFile(selectedItem?.nomFile)} style={F.button}>
                            <MaterialCommunityIcons   name="download" size={24} color="black" />
                            <Text style={F.buttonText}>Télécharger</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity onPress={() => deleteFile(selectedItem?.id)} style={[F.button, { color: 'red' }]}>
                            <MaterialCommunityIcons name="delete" size={24} color="red" />
                            <Text style={[F.buttonText, { color: 'red' }]}>Supprimer</Text>
                        </TouchableOpacity>
                        <Button title="Annuler" onPress={closeModal} />
                    </View>
                </View>
            </Modal>
        </View>
    )
}


export default Files
