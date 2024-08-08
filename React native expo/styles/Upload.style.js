import { StyleSheet } from "react-native"

export const U = StyleSheet.create({
    container: {
        //flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginVertical: 5,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    infoContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    // selectFileButton: {
    //   paddingVertical: 10,
    //   paddingHorizontal: 20,
    //   marginVertical: 10,
    // },
    selectFileButtonText: {
        color: 'rgb(240, 105, 179)', 
        fontSize: 16,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    textContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 15,
        marginRight: 40,
        position: 'absolute',
        top: 100, 
        left: -90,
    },
})