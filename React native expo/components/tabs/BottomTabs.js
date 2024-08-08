//import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Upload from '../Upload'; import Files from '../Files'; //import Share from '../Share'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

//const Tab = createBottomTabNavigator()
const Tab = createMaterialBottomTabNavigator()

const BottomTabs = () => {

  return (
    <Tab.Navigator
      initialRouteName="files"
      screenOptions={{
        tabBarColor: 'red',
        headerShown: false,
      }}
      barStyle={{ backgroundColor: 'rgb(12, 187, 240)' }}
    >
      <Tab.Screen
        name="upload"
        component={Upload}
        options={{
          tabBarLabel: 'Upload',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="upload" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="files"
        component={Files}
        options={{
          tabBarLabel: 'Files',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="file" color={color} size={size} />
          ),
          //tabBarBadge: 3,
        }}
      />
      {/* <Tab.Screen
        name="share"
        component={Share}
        options={{
          tabBarLabel: 'Share',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="share" color={color} size={size} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  )
}

export default BottomTabs