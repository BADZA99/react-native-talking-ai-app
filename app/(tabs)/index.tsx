import { Image, StyleSheet, Platform, Pressable, Text, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import { Audio } from 'expo-av';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { AndroidOutputFormat } from 'expo-av/build/Audio';
import * as FileSystem from "expo-file-system";
//npx create-expo-app@latest nom puis npx expo start --port 19001
//le dossier tabs est le dossier de l'onglet du menu 
//le dossier app est le dossier de l'application
//chaque tab doit correspondre au nom de la page
//chaque page doit etre dans le dossier tabs

export default function HomeScreen() {
const [isRecording, setIsRecording] = React.useState<undefined | Audio.Recording>();
  async function  startRecording ()  : Promise<void> {
   try {
    await Audio.requestPermissionsAsync();
     await Audio.setAudioModeAsync({
       allowsRecordingIOS: true,
       playsInSilentModeIOS: true,
     });

    const audioPermissions : Audio.PermissionResponse = await Audio.getPermissionsAsync();
    if (!audioPermissions.granted || audioPermissions.status === 'denied') {
      console.log('Permission to record audio was denied');
      throw new Error('Permission to record audio was denied');
    }

    const {recording : recording,status} = await Audio.Recording.createAsync({
      ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
      android: {
       ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
       audioEncoder: AndroidOutputFormat.AMR_WB,
        outputFormat: AndroidOutputFormat.AMR_WB,
      },
      ios: {
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY.ios,
        audioQuality: Audio.RecordingOptionsPresets.HIGH_QUALITY.ios.audioQuality,
        outputFormat: Audio.RecordingOptionsPresets.HIGH_QUALITY.ios.outputFormat,
      },
    });

  
      setIsRecording(recording);
   } catch (error) {
     console.log(error);
   }
  };

  async function stopRecording ()  : Promise<void> {
    if (isRecording) {
      await isRecording.stopAndUnloadAsync();
      
     const uri : string |null  = isRecording.getURI();

     if (uri) {
       const fileUri = `${
         FileSystem.documentDirectory
       }recording-${Date.now()}.m4a`;
       await FileSystem.moveAsync({
         from: uri,
         to: fileUri,
       });

       const { sound } = await Audio.Sound.createAsync({ uri: fileUri });
       await sound.playAsync();

       console.log("Recorded file URI:", fileUri);
     }
     console.log('recorded file uri', uri);
     setIsRecording(undefined);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <View style={styles.stepContainer}>
          {/* Pressable EST UN ELEMENT BUTTON */}
          {/* button record */}
          <Pressable onPress={startRecording}>
             <Text
               style={{
                backgroundColor: "#58c4dc",
                padding: 10,
                borderRadius: 4,
                textAlign: "center",
                color: "#ffffff",
                fontWeight: "bold",
               }}
             >start recording </Text>
          </Pressable>
          {/* button stop */}
          <Pressable onPress={stopRecording}>
             <Text
               style={{
                backgroundColor: "#ec3a0d",
                padding: 10,
                borderRadius: 4,
                textAlign: "center",
                color: "#ffffff",
                fontWeight: "bold",
               }}
             >stop recording </Text>
          </Pressable>
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
