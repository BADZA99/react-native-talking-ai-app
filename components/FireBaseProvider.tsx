// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import React, { useContext } from "react";

type FireBaseContextValues = FirebaseApp | undefined

export const FireBaseContext = React.createContext<FireBaseContextValues>(undefined)





// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCtqvO09HdKB2BO-xbna00HLjPRlhP8k9c",
  authDomain: "talking-ai-app-7e1d4.firebaseapp.com",
  projectId: "talking-ai-app-7e1d4",
  storageBucket: "talking-ai-app-7e1d4.firebasestorage.app",
  messagingSenderId: "6922053951",
  appId: "1:6922053951:web:ab5fa5a9e7315b4a85cb8a",
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

interface FireBaseProviderProps {
  children: React.ReactNode;
}

export default function FireBaseProvider({ children }: FireBaseProviderProps) {
  return (
    <FireBaseContext.Provider value={app}>
      {children}
    </FireBaseContext.Provider>
  );
}

export const useFireBaseContext= ()=>useContext(FireBaseContext);
