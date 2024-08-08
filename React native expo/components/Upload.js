import React, { useState } from 'react'
import { View, Button, Alert, Modal, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
//import * as ImagePicker from 'expo-image-picker'
import * as DocumentPicker from 'expo-document-picker'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Toast from 'react-native-toast-message'
import { U } from '../styles/Upload.style'
import { fileService } from '../_services/file.service'


const Upload = () => {
  const [fileUri, setFileUri] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [fileSize, setFileSize] = useState(null)
  const [fileType, setFileType] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // ouvrir le modal
  const openModal = () => {
    setModalVisible(true)
  }

  // fermer le modal
  const closeModal = () => {
    setModalVisible(false)
  }

  // Fonction pour sélectionner un fichier
  // const pickFile = async () => {
  //   Alert.alert(
  //     'Select File Type',
  //     'Choose a file type to select',
  //     [
  //       { text: 'Image', onPress: pickImage },
  //       { text: 'Video', onPress: pickImage },
  //       { text: 'Audio', onPress: () => pickDocument('audio/*') },
  //       { text: 'Text', onPress: () => pickDocument('text/plain') },
  //       { text: 'Word', onPress: () => pickDocument('application/msword') },
  //       { text: 'PDF', onPress: () => pickDocument('application/pdf') },
  //       { text: 'Excel', onPress: () => pickDocument('application/vnd.ms-excel') },
  //       { text: 'Cancel', style: 'cancel' },
  //     ]
  //   )
  // }
  /*-----------------------------------------------------*/
  // Fonction pour sélectionner une image ou une vidéo
  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: false,
  //     quality: 1,
  //   })

  //   console.log('Picker Image Result:', result)

  //   if (!result.canceled) {
  //     setFileUri(result.assets[0].uri)
  //     console.log('Selected Image/Video URI:', result.assets[0].uri)
  //     console.log('Selected Image/Video Name:', result.assets[0].fileName || 'N/A')
  //     closeModal()
  //   }
  // }
  // Fonction pour sélectionner une image
  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images, // Choisir uniquement des images
  //     allowsEditing: false,
  //     quality: 1,
  //   })

  //   console.log('Picker Image Result:', result)

  //   if (!result.canceled) {
      
  //     console.log('Selected Image URI:', result.assets[0].uri)
  //     console.log('Selected Image Name:', result.assets[0].fileName || 'N/A')
  //     console.log('Selected Image Size:', result.assets[0].fileSize)
  //     console.log('Selected Image Type:', result.assets[0].type)

  //     setFileUri(result.assets[0].uri)
  //     setFileName(result.assets[0].fileName)
  //     setFileSize(result.assets[0].fileSize)
  //     setFileType(result.assets[0].type)

  //     console.log('fileURI y : ', fileUri)
  //     console.log('fileName y : ', fileName)
  //     console.log('fileSize y : ', fileSize)
  //     console.log('fileType y : ', fileType)
  //     closeModal()
  //   }
  // }
  // Fonction pour sélectionner une vidéo
  // const pickVideo = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Videos, // Choisir uniquement des vidéos
  //     allowsEditing: false,
  //     quality: 1,
  //   })

  //   console.log('Picker Video Result:', result)

  //   if (!result.canceled) {

  //     console.log('Selected Video URI:', result.assets[0].uri)
  //     console.log('Selected Video Name:', result.assets[0].fileName || 'N/A')
  //     console.log('Selected Video Size:', result.assets[0].fileSize)
  //     console.log('Selected Video Type:', result.assets[0].type)

  //     setFileUri(result.assets[0].uri)
  //     setFileName(result.assets[0].fileName)
  //     setFileSize(result.assets[0].fileSize)
  //     setFileType(result.assets[0].type)

  //     console.log('fileURI x : ', fileUri)
  //     console.log('fileName x : ', fileName)
  //     console.log('fileSize x : ', fileSize)
  //     console.log('fileType x : ', fileType)
  //     closeModal()
  //   }
  // }

  // Fonction pour sélectionner un document
  const pickDocument = async (donnee) => {
    let result = await DocumentPicker.getDocumentAsync({
      type: donnee ,
    })
    console.log('Document Picker Result:', result)

    if (!result.canceled && result.assets && result.assets.length > 0) {
        const document = result.assets[0]
        console.log('Selected Document URI:', document.uri)
        console.log('Selected Document Name:', document.name)
        console.log('Selected Document Type:', document.mimeType)
        console.log('Selected Document Size:', document.size)
        
        setFileUri(document.uri)
        setFileName(document.name)
        setFileSize(document.size)
        setFileType(document.mimeType)
        closeModal()
    } else {
      console.log('Document picking cancelled or failed')
    }
  }

  // Fonction pour importer le fichier
  const uploadFile = async () => {

    try {

      if (!fileUri) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Erreur',
          text2: 'Aucun fichier sélectionné.',
          visibilityTime: 7000,
          autoHide: true,
          bottomOffset: 40,
        })
        return
      }

      console.log('File URI:', fileUri)
      console.log('File Name:', fileName)
      console.log('File Size : ', fileSize)
      console.log('File Type  : ', fileType)

      var formData = new FormData()

      formData.append('file', {
        uri: fileUri,
        type: 'multipart/form-data',
        // name: fileName,
        name: fileUri.split('/').pop()
      })
      formData.append('fileName', fileName)

      let Y = {
        headers: { 'Content-Type': 'multipart/form-data', },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(percent)
        },
      }

      var res = await fileService.addFile(formData, Y)
      //console.log(res)

      setTimeout(() => {
        if (res.data.error) {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Erreur',
            text2: res.data.error.message,
            visibilityTime: 7000,
            autoHide: true,
            bottomOffset: 40,
          })
          setFileUri(null)
          setFileName(null)
          setFileSize(null)
          setFileType(null)
          setUploadProgress(0)
        } else {
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Succès',
            text2: res.data.message,
            visibilityTime: 7000,
            autoHide: true,
            bottomOffset: 40,
          })
          setFileUri(null)
          setFileName(null)
          setFileSize(null)
          setFileType(null)
          setUploadProgress(0)
        }
      }, 1000)

    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Erreur',
        text2: "Erreur d'upload du fichier",
        visibilityTime: 7000,
        autoHide: true,
        bottomOffset: 40,
      })
    }
  }

  // Fonction pour formater la taille du fichier
  const formatFileSize = (size) => {
    if (size < 1024) {
      return `${size} bytes`;
    } 
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(2)} KB`;
    } 
    if (size < 1024 * 1024 * 1024) {
      return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } 
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }

  const getFileTypeLabel = (type) => {
    switch (type) {
      case 'image/jpeg':
      case 'image/png':
        return 'Image';
      case 'video/mp4':
      case 'video/x-matroska':
      case 'video/avi':
        return 'Vidéo'
      case 'text/plain':
        return 'Text'
      case 'audio/aac':
      case 'audio/mp3':
      case 'audio/mpeg':
      case 'audio/wav':
        return 'Audio'
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
        return 'Word'
      case 'application/pdf':
        return 'PDF'
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.ms-excel':
        return 'Excel'
      default:
        return 'type de fichier inconnu'
    }
  }


  return (
    <>
      <Toast ref={(ref) => Toast.setRef(ref)} />
      <View style={U.container}>
        <Image source={require('../assets/file-upload.webp')} style={{ width: 392, height: 200, marginBottom: 20,}} />
       <TouchableOpacity onPress={openModal}>
          <Text style={U.selectFileButtonText}>Sélectionner un fichier</Text>
        </TouchableOpacity>
        <View style={U.infoContainer}>
          <View style={U.textContainer}>
            {fileName && <Text>Nom: {fileName}</Text>}
            {fileSize !== null && <Text>Taille: {formatFileSize(fileSize)}</Text>}
            {fileType && <Text>Type: {getFileTypeLabel(fileType)}</Text>}
          </View>
          {fileUri && fileName && <Text style={{marginBottom: 5,}}>Téléversé à {uploadProgress}%</Text>}
          {fileUri && fileName && <Button title="Upload File" onPress={uploadFile} />}
        </View>
        {/* */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={U.modalContainer}>
            <View style={U.modalContent}>
              <TouchableOpacity style={U.closeButton} onPress={closeModal}>
                <Icon name="cancel" size={30} color="red" />
              </TouchableOpacity>
              <TouchableOpacity style={U.button} onPress={() => pickDocument(['image/jpeg', 'image/png'])}>
                <Text style={U.buttonText}>Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={U.button} onPress={() => pickDocument(['video/mp4', 'video/x-matroska', 'video/avi'])}>
                <Text style={U.buttonText}>Video</Text>
              </TouchableOpacity>
              <TouchableOpacity style={U.button} onPress={() => pickDocument(['audio/aac', 'audio/mp3', 'audio/mpeg', 'audio/wav'])}>
                <Text style={U.buttonText}>Audio</Text>
              </TouchableOpacity>
              <TouchableOpacity style={U.button} onPress={() => pickDocument(['text/plain'])}>
                <Text style={U.buttonText}>Text</Text>
              </TouchableOpacity>
              <TouchableOpacity style={U.button} onPress={() => pickDocument(['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'])}>
                <Text style={U.buttonText}>Word</Text>
              </TouchableOpacity>
              <TouchableOpacity style={U.button} onPress={() => pickDocument(['application/pdf'])}>
                <Text style={U.buttonText}>PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity style={U.button} onPress={() => pickDocument(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'])}>
                <Text style={U.buttonText}>Excel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* */}
      </View>
    </>
  )
}

export default Upload
