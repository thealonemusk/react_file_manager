import { toast } from "react-toastify";
import { auth, database } from "../../API/firebase";
import userModel from "../../models/users";
import { RESET_USER, SET_USER } from "../actions/authActions";
import { RESET_FOLDERS_FILES } from "../actions/filefoldersActions";
import firebase from "firebase/app";
import "firebase/auth";

const setUser = (data) => ({
  type: SET_USER,
  payload: data,
});

const resetUser = () => ({
  type: RESET_USER,
});

export const registerUser =
  ({ name, email, password }, setError) =>
  (dispatch) => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        setError("");
        const newUser = userModel(email, name, user.user.uid);
        auth.currentUser.updateProfile({
          displayName: name,
        });

        database.users.add(newUser).then((usr) => {
          dispatch(
            setUser({
              userId: user.user.uid,
              user: { data: user.user.providerData[0] },
            })
          );
          toast.success("User registered successfully!!");
        });
      })
      .catch((err) => {
        console.log(err);
        if (err.code === "auth/email-already-in-use") {
          setError("Email Already Exists!");
        }
      });
  };

export const loginUser =
  ({ email, password }, setError) =>
  async (dispatch) => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const usr = await database.users.where("uid", "==", userCredential.user.uid).get();
      console.log(usr.docs);
    } catch (err) {
      console.error(err);
      setError("Invalid Email Or Password!");
    }
  };

export const signInWithGoogle = (setError) => async (dispatch) => {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const userCredential = await auth.signInWithPopup(provider);
    const user = userCredential.user;
    const usr = await database.users.where("uid", "==", user.uid).get();
    console.log(usr.docs);
  } catch (err) {
    console.error(err);
    setError("Failed to sign in with Google");
  }
};

export const getUser = () => (dispatch) => {
  auth.onAuthStateChanged(function (user) {
    if (user) {
      dispatch(
        setUser({
          userId: auth.currentUser.uid,
          user: { data: auth.currentUser.providerData[0] },
        })
      );
    } else {
      dispatch(resetUser());
    }
  });
};

const resetFilesFolders = () => ({
  type: RESET_FOLDERS_FILES,
});

export const logoutUser = () => (dispatch) => {
  auth.signOut().then(() => {
    dispatch(resetUser());
    dispatch(resetFilesFolders());
  });
};
