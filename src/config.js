import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyD5uNosPjVCn74fV433ufhUElu2KKD2Tx0",
    authDomain: "vietnam-population-density.firebaseapp.com",
    databaseURL: "https://vietnam-population-density.firebaseio.com",
    projectId: "vietnam-population-density",
    storageBucket: "vietnam-population-density.appspot.com",
    messagingSenderId: "53459986796"
};

const firePopulation = firebase.initializeApp(config);
const db = firePopulation.firestore();

export default db;