import { decorate, observable, action } from "mobx";
import firebase from "firebase/app";
import "firebase/auth";

class AuthStore {
  isSigned = false;

  loginWith = (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
        console.log(error);
      })
      .then(response => {
        // console.log(response);
        this.isSigned = true;
      });
  };

  logout = () => {
    this.isSigned = false;
  };
}

decorate(AuthStore, {
  isSigned: observable,
  loginWith: action,
  logout: action
});

export default AuthStore;
