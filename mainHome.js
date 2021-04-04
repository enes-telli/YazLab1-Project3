import  React from 'react';
import {Button} from 'react-native-paper';
import {View,Text,TouchableOpacity} from 'react-native';



export default MainHome = ({navigation}) => {
 
  
  return (
    <View style={{flex:1, backgroundColor:"#ebebeb"}}>
       


        <TouchableOpacity
        onPress={() => navigation.navigate("Kamera")}>
          <View style={{ 
            
            margin:20,
            backgroundColor: 'blue',
            height: 50,
          justifyContent: 'center',
            alignItems: 'center',
            //width: 150,
            borderRadius: 3,
    
    }}><Text style={{color:"white",fontSize:20}}>Analiz Et!</Text></View>
        </TouchableOpacity>

    </View>
    
  );
}