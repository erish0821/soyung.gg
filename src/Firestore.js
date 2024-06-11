import React, { useState, useEffect, useCallback } from "react";
import { db } from "./firebase-config"; // 수정된 경로
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

const Firestore = () => {
  const [data, setData] = useState([]);
  const [input, setInput] = useState("");
  const dataCollectionRef = collection(db, "data");

  const fetchData = useCallback(async () => {
    const querySnapshot = await getDocs(dataCollectionRef);
    setData(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }, [dataCollectionRef]);

  const addData = async () => {
    await addDoc(dataCollectionRef, { text: input });
    fetchData();
  };

  const updateData = async (id, newText) => {
    const dataDoc = doc(db, "data", id);
    await updateDoc(dataDoc, { text: newText });
    fetchData();
  };

  const deleteData = async (id) => {
    const dataDoc = doc(db, "data", id);
    await deleteDoc(dataDoc);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <input type="text" onChange={(e) => setInput(e.target.value)} />
      <button onClick={addData}>Add Data</button>
      <ul>
        {data.map((d) => (
          <li key={d.id}>
            {d.text}
            <button onClick={() => updateData(d.id, prompt("New text:", d.text))}>Update</button>
            <button onClick={() => deleteData(d.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Firestore;
