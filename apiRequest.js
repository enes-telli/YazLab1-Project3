import axios from 'axios';


export default function apiRequest(base64string) {

  const visionApiKey = {
    key: 'AIzaSyBXDkM2fZFwMGsI_R2jniT0mIpw9llzTLY',
    
    FIREBASE_API_KEY: 'AIzaSyCTqZvljLJjG99HbyeuHIXAZ0MLdbpf96o',
    FIREBASE_AUTH_DOMAIN: 'yazlab-2f864.firebaseapp.com',
    FIREBASE_DATABASE_URL: 'gs://yazlab-2f864.appspot.com/',
    FIREBASE_PROJECT_ID: 'yazlab-2f864',
    FIREBASE_STORAGE_BUCKET: 'yazlab-2f864.appspot.com',
    FIREBASE_MESSAGING_SENDER_ID: '165652554749',
  
    
  };//google viison api key import ediyoruz

  const uri =
    'https://vision.googleapis.com/v1/images:annotate?key=' + visionApiKey.key; //request yapacağımız query


    
  // request body
  const requestBody = {
    requests: [
      {
        image: {
          content: base64string,
        },
        features: [
          {
            type: 'OBJECT_LOCALIZATION',
            maxResults: 10,
          },
        ],
      },
    ],
  };

  const result = axios
    .post(uri, requestBody)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      //console.log(error);
    });

  //console.log(result);
  return result;
}
