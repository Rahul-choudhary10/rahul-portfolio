import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useCollection = (collectionName, orderField = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let q = collection(db, collectionName);
    if (orderField) {
      q = query(collection(db, collectionName), orderBy(orderField));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, orderField]);

  return { data, loading, error };
};

// Fetches the first document in a collection regardless of its ID.
// Useful for single-document collections like personalInfo, socialLinks.
export const useFirstDocument = (collectionName) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        if (!snapshot.empty) {
          const d = snapshot.docs[0];
          setData({ id: d.id, ...d.data() });
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [collectionName]);

  return { data, loading, error };
};

export const useDocument = (collectionName, docId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!docId) return;
    const docRef = doc(db, collectionName, docId);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() });
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [collectionName, docId]);

  return { data, loading, error };
};

export const firestoreAdd = (collectionName, data) =>
  addDoc(collection(db, collectionName), { ...data, createdAt: serverTimestamp() });

export const firestoreUpdate = (collectionName, id, data) =>
  updateDoc(doc(db, collectionName, id), { ...data, updatedAt: serverTimestamp() });

export const firestoreDelete = (collectionName, id) =>
  deleteDoc(doc(db, collectionName, id));

export const firestoreSet = (collectionName, id, data) =>
  setDoc(doc(db, collectionName, id), { ...data, updatedAt: serverTimestamp() }, { merge: true });

export const firestoreAddMessage = (data) =>
  addDoc(collection(db, 'messages'), { ...data, timestamp: serverTimestamp(), read: false });
