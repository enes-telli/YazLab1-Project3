import React from 'react';
import { View,Text,StyleSheet,TouchableOpacity,Alert,PermissionsAndroid,Platform,} from 'react-native';
import {RNCamera} from 'react-native-camera';
import RNFS from 'react-native-fs'; //fotoğrafı base64 stringe dönüştürmek için gerekli modül
import apiRequest from './apiRequest'; // api isteğini yaptığımız kütüphane
import CameraRoll from '@react-native-community/cameraroll'; //galeriye fotoğraf kaydetmek için gerekli kütüphane
import {launchImageLibrary} from 'react-native-image-picker'; //galeriden fotoğraf seçmek için gerekli kütüphane

const CameraComponent = () => {

  

  async function permisson_iste() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }

  //galeriden fotoğraf seçtiğimiz kısım
  const galeridenSec = () => {
    var options = {
      title: 'Select Image',
      takePhotoButtonTitle: 'Take Photo',
      chooseFromLibraryButtonTitle: 'Choose Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, async (res) => {
      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
      } else {
        let source = res;

        //fotoğrafı base64stringe dönüştürüyoruz

        var image = await RNFS.readFile(source.uri, 'base64').then((res) => {
          return res;
        });

        //base64stringi api ile sunucuya gönderiyoruz
        var response = await apiRequest(image);

        var objects = 'Görselin içeriği: ';
        //apiden gelen sonuçları objects isimli strinde ekliyoruz
        for (let i = 0; i < response.responses[0].localizedObjectAnnotations.length; i++) {
          let object = response.responses[0].localizedObjectAnnotations[i];
          objects += '\n' + object.name+'\n';
          let bounds = object.boundingPoly.normalizedVertices.length;
          for (let j = 0; j < bounds; j++)
          {
            objects += 'x: ' + object.boundingPoly.normalizedVertices[j].x + '\n';
            objects += 'y: ' + object.boundingPoly.normalizedVertices[j].y + '\n\n';
          }
        }


       
        // alert box ile sonucu kullanıcıya gösteriyoruz
        objeleriYaz(objects);
      }
    });
  };

  // fotoğraf çektiğimiz kısım
  const takePicture = async function (camera) {
    const options = {quality: 0.5, base64: true};
    const data = await camera.takePictureAsync(options);

    // çektiğimiz fotoğrafı galeriye kaydediyoruz
    async function savePicture() {
      if (Platform.OS === 'android' && !(await permisson_iste())) {
        return;
      }

      CameraRoll.save(data.uri, {type: 'photo'});
    }

    savePicture();

    //fotoğrafı base64 stringe dönüştürüyoruz
    var string64 = await RNFS.readFile(data.uri, 'base64').then((res) => {
      return res;
    });

    //base64stringi api ile sunucuya gönderiyoruz
    var response = await apiRequest(string64);

    //apiden gelen sonuçları objects isimli strinde ekliyoruz
    var objects = 'Görselin içeriği: ';
    for (let i = 0; i < response.responses[0].localizedObjectAnnotations.length; i++) {
      let object = response.responses[0].localizedObjectAnnotations[i];
      objects += '\n' + object.name+'\n';
      let bounds = object.boundingPoly.normalizedVertices.length;
      for (let j = 0; j < bounds; j++)
      {
        objects += 'x: ' + object.boundingPoly.normalizedVertices[j].x + '\n';
        objects += 'y: ' + object.boundingPoly.normalizedVertices[j].y + '\n\n';
      }
    }
     

    // alert box ile sonucu kullanıcıya gösteriyoruz
    objeleriYaz(objects);
  };

  const cameraScreen = () => {
    return (
      <RNCamera
        style={Styles.cameraContainer}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}>
        {({camera}) => {
          return (
            
              <View style={Styles.cameraContainer}>
                <View style={Styles.container2}>
                  <TouchableOpacity onPress={() => takePicture(camera)}>
                    <View style={Styles.shotButton}><Text style={Styles.galeriText}>Fotoğraf Çek</Text></View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={Styles.cameraRollButton}
                    onPress={() => galeridenSec()}>
                    <Text style={Styles.galeriText}>Galeri</Text>
                  </TouchableOpacity>
                </View>
              </View>
            
          );
        }}
      </RNCamera>
    );
  };

  return cameraScreen();
};

// alertbox componenti
function objeleriYaz(response) {
  return Alert.alert(
    'Objelerin Listesi',
    response,
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ],
    {cancelable: false},
  );
}

const Styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    flexDirection: 'column',
    alignItems: 'center',
  },
  container2: {flexDirection: 'row', alignItems: 'center'},

  shotButton: {
    backgroundColor: '#30c2bb',
    width: 150,
    height: 50,
    marginBottom: 20,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraRollButton: {
    marginBottom: 20,
    backgroundColor: '#d63bdb',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    borderRadius: 3,
    marginLeft: 20,
  },
  galeriText: {color: 'white',fontSize:20},
});

export default CameraComponent;
