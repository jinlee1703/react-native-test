import React, {useState} from 'react';
import {View, Text, Button, Image, StyleSheet} from 'react-native';
import ImagePicker, {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import TextRecognizer from '@react-native-ml-kit/text-recognition';

const App = () => {
  const [selectedImage, setSelectedImage] =
    useState<ImagePickerResponse | null>(null);
  const [recognizedText, setRecognizedText] = useState<string>('');

  const handleImageSelect = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
      },
      (response: ImagePickerResponse) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          setSelectedImage(response);
          if (response.assets && response.assets.length > 0) {
            const imageUri = response.assets[0].uri;
            performTextRecognition(imageUri);
          }
        }
      },
    );
  };

  const performTextRecognition = async (imageUri: string | undefined) => {
    if (imageUri) {
      const response = await TextRecognizer.recognize(imageUri);
      response;
      if (response && response.text) {
        setRecognizedText(response.text);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Select Image" onPress={handleImageSelect} />
      {selectedImage && (
        <Image
          source={{uri: selectedImage.assets![0].uri}}
          style={styles.image}
        />
      )}
      <Text>{recognizedText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
});

export default App;
