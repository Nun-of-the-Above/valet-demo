import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "@firebase/auth";
import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const AuthContext = createContext();

function AuthProvider(props) {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [isLoadedAuth, setIsLoadedAuth] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user);
      setIsLoadedAuth(true);
    } else {
      setUser(null);
      setIsLoadedAuth(true);
    }
  });

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const register = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Registered as ", userCredential.user.email);
      })
      .catch((error) => {
        console.error("Error from firebase: ", error);
      });

  const logout = () => {
    signOut(auth).then(() => {
      console.log("User logged out");
    });
  };

  const registerWithRandomEmail = () => {
    const email = uuidv4() + "@gmail.com";
    const password = uuidv4();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Registered as ", userCredential.user.email);
      })
      .catch((error) => {
        console.error("Error from firebase: ", error);
      });
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadedAuth,
        login,
        logout,
        register,
        registerWithRandomEmail,
      }}
      {...props}
    />
  );
}

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
