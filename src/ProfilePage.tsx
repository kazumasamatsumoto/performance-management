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
      <div className="p-4">
        <h1 className="text-2xl mb-4">Profile Page</h1>
        <p className="mb-4">Account: {user.email}</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Skills"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
          value={futureDirection}
          onChange={(e) => setFutureDirection(e.target.value)}
          placeholder="Future Direction"
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <button
          onClick={handleSave}
          className="mb-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Save
        </button>
        <Link
          to="/employee-dashboard"
          className="inline-block bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
        >
          トップに戻る
        </Link>
      </div>
    );
  }

  return <div>You are not logged in.</div>;
};

export default ProfilePage;
