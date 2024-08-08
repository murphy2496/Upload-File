import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context'
import { Platform, Text } from 'react-native'
import Router from './routes/router'

export default function AnimatedStyleUpdateExample() {

  return (
    <>
      {Platform.OS == "android" ? (
        <SafeAreaProvider>
          <SafeAreaView style={{flex: 1}}>
              <Router/>
          </SafeAreaView>
        </SafeAreaProvider>
      ) : (
          <Text>Hello IOS, cette application est pour un Android.</Text>
      )}
    </>
  )
}