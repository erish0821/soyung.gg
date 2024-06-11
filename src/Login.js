import React, { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase-config";

const Login = () => {
  const [error, setError] = useState("");

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError("Error signing in with Google: " + error.message);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleGoogleSignIn}>Sign In with Google</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
