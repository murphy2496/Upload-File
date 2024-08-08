import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import BottomTabs from '../components/tabs/BottomTabs'

const Stack = createNativeStackNavigator()

const Router = () => {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='bottomTabs' screenOptions={{headerShown: false}}>
            <Stack.Screen name='bottomTabs' component={BottomTabs}/>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  )
}

export default Router