const admin = require('firebase-admin');
const serviceAccount = require("./service-key.json");

//const data = require('../density-by-year.json');
const data = require('./test.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),  
  databaseURL: "https://vietnam-population-density.firebaseio.com/"
});

data && Object.keys(data).forEach(key => {
  const nestedContent = data[key];

  if (typeof nestedContent === "object") {
      Object.keys(nestedContent).forEach(docTitle => {
          admin.firestore()
              .collection(key)
              .doc(docTitle)
              .set(nestedContent[docTitle])
              .then((res) => {
                  console.log("Document successfully written!");
              })
              .catch((error) => {
                  console.error("Error writing document: ", error);
              });
      });
  }
});