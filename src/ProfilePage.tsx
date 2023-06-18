// src/ProfilePage.tsx
import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import auth from "./firebase";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [skills, setSkills] = useState("");
  const [futureDirection, setFutureDirection] = useState("");

  const handleSave = async () => {
    if (user) {
      await setDoc(doc(db, "users", user.uid), {
        name,
        age,
        skills,
        futureDirection,
      });
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setName(docSnap.data().name);
          setAge(docSnap.data().age);
          setSkills(docSnap.data().skills);
          setFutureDirection(docSnap.data().futureDirection);
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return (
      <div>
        <h1>Profile Page</h1>
        <p>Account: {user.email}</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
        />
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Skills"
        />
        <input
          value={futureDirection}
          onChange={(e) => setFutureDirection(e.target.value)}
          placeholder="Future Direction"
        />
        <button onClick={handleSave}>Save</button>
        <Link to="/employee-dashboard">トップに戻る</Link>
      </div>
    );
  }

  return <div>You are not logged in.</div>;
};

export default ProfilePage;
