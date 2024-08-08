import { StyleSheet } from "react-native"

export const F = StyleSheet.create({
    search: {
        marginTop: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
    },
    res: {
        marginTop: 10,
        padding: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        color: 'grey'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        marginLeft: 10,
        fontSize: 16,
    },
})