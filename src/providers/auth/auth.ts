import { Injectable } from '@angular/core';

// Providers
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

// Native
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';


@Injectable()
export class AuthProvider {

  constructor(private afAuth: AngularFireAuth, private fb: Facebook) {
    console.log('Hello AuthProvider Provider');
  }

  loginWithFacebook(){
    // var provider = new firebase.auth.FacebookAuthProvider();
    // return this.afAuth.auth.signInWithPopup(provider);
    return this.fb.login(['email','public_profile'])
    .then( response => {
      const facebookCredential = firebase.auth.FacebookAuthProvider
        .credential(response.authResponse.accessToken);

      return firebase.auth().signInAndRetrieveDataWithCredential(facebookCredential)
   })
  }

  loginWithGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider();
    return(
      this.afAuth.auth.signInWithRedirect(provider).then(function(result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        // var token = result.credential.;
        // The signed-in user info.
        var user = result;
        return user;
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        return error;
      })
    );
  }


}
