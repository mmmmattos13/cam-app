import { Button, StyleSheet, Text, TouchableOpacity, View, Modal, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';

export default function Camera(){

    const camRef = useRef<CameraView>(null);
    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  
    if (!permission) {    
      return <View />;
    }
  
    if (!permission.granted) {    
      return (
        <View style={styles.container}>
          <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
      );
    }
  
    function toggleCameraFacing() {
      setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    async function takePicture() {
      if(camRef && camRef.current){
        const photo = await camRef.current.takePictureAsync();
        setCapturedPhoto(photo?.uri);
        setModalIsOpen(true);
      }
    }


    return(
        <CameraView style={{flex: 1}} facing={facing} ref={camRef}>
            <View style={styles.mainView}>
                <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                    <Text style={styles.text}>Flip Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.takePhoto} onPress={takePicture}>
                  <Text style={styles.takePhotoText}>Take Picture</Text>
                </TouchableOpacity>
            </View>
            {capturedPhoto && (
              <Modal animationType='slide' transparent={false} visible={modalIsOpen}>
                <View style={styles.modalView}>
                  <TouchableOpacity style = {{margin: 10}} onPress={() => {setModalIsOpen(false)}}>
                    <Text>Close</Text>
                  </TouchableOpacity>
                  <Image source={{uri: capturedPhoto}} style={styles.image} />
                </View>
              </Modal>
            )}
            
        </CameraView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: "center",
    },
    mainView: {
      flex: 1,
      backgroundColor: "transparent",
      flexDirection: "row",
    },
    button: {
      position: "absolute",
      bottom: 20,
      left: 20,
    },
    text:{
      fontSize: 20,
      marginBottom: 15,
      color: "#fff",
    }, 
    takePhoto: {
      position: "absolute",
      bottom: 20,
      right: 20,
    },
    takePhotoText: {
      fontSize: 20,
      color: "#FFF",
      marginBottom: 15,
    },
    modalView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      margin: 20,
    },
    image: {
      width: "100%",
      height: 300, 
      borderRadius: 20,
    }
});