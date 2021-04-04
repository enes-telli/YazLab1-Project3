import React from 'react';
import CameraComponent from './CameraComponent';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator}from '@react-navigation/stack';
import MainHome from './mainHome';


const Stack = createStackNavigator();
const myOptions={
  
  title:"Ana Sayfa",
  headerTintColor:"white",
  headerStyle:{backgroundColor:"#3fd4a2"}

}
const App = () => {
  return (
  
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={ MainHome  } options={myOptions}/>
      <Stack.Screen name="Kamera" component={ CameraComponent }options={{
            ...myOptions,title:"Analiz Et"
          }} />
    </Stack.Navigator>


  </NavigationContainer>
 
      
    )
};

export default ()=>{

  return(
   
      <App/>
    
  )
}
