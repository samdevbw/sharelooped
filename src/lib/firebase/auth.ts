import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    updateProfile,
    signOut
  } from "firebase/auth";
  import { auth, db } from "./config";
  import { doc, setDoc, serverTimestamp } from "firebase/firestore";
  
  // Initialize providers
  const googleProvider = new GoogleAuthProvider();
  
  // Register with email and password
  export const registerWithEmailAndPassword = async (email, password, fullName) => {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with full name
      await updateProfile(user, {
        displayName: fullName
      });
      
      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        id: user.uid,
        email,
        full_name: fullName,
        created_at: serverTimestamp()
      });
      
      return { user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };
  
  // Login with email and password
  export const loginWithEmailAndPassword = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };
  
  // Sign in with Google
  export const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Check if this is a new user
      const isNewUser = result._tokenResponse.isNewUser;
      
      if (isNewUser) {
        const user = result.user;
        // Store user data in Firestore for new Google sign-ins
        await setDoc(doc(db, "users", user.uid), {
          id: user.uid,
          email: user.email,
          full_name: user.displayName,
          created_at: serverTimestamp()
        });
      }
      
      return { user: result.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  };
  
  // Sign out
  export const logOut = async () => {
    try {
      await signOut(auth);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    }
  };
  
  // Export providers for direct use if needed
  export { GoogleAuthProvider, updateProfile };