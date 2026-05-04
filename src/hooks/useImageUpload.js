import { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

const TIMEOUT_MS = 15000; // fail after 15 seconds instead of hanging forever

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadImage = (file, path) => {
    return new Promise((resolve, reject) => {
      if (!file) return reject(new Error('No file provided'));

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return reject(new Error('Only JPG, PNG, WEBP or GIF images allowed'));
      }
      if (file.size > 5 * 1024 * 1024) {
        return reject(new Error('Image must be under 5 MB'));
      }

      setUploading(true);
      setProgress(0);

      const storageRef = ref(storage, path);
      const task = uploadBytesResumable(storageRef, file);

      // Timeout — if no progress after 15s, Storage isn't set up
      const timer = setTimeout(() => {
        task.cancel();
        setUploading(false);
        setProgress(0);
        reject(new Error(
          'Upload timed out. Make sure Firebase Storage is enabled in your Firebase Console (Build → Storage → Get started).'
        ));
      }, TIMEOUT_MS);

      task.on(
        'state_changed',
        (snap) => {
          clearTimeout(timer); // got a response — clear timeout
          setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
        },
        (err) => {
          clearTimeout(timer);
          setUploading(false);
          setProgress(0);
          const msg = err.code === 'storage/unauthorized'
            ? 'Permission denied. Set your Firebase Storage rules to allow writes for authenticated users.'
            : err.code === 'storage/canceled'
            ? 'Upload cancelled.'
            : err.message;
          reject(new Error(msg));
        },
        async () => {
          clearTimeout(timer);
          const url = await getDownloadURL(task.snapshot.ref);
          setUploading(false);
          setProgress(0);
          resolve(url);
        }
      );
    });
  };

  return { uploadImage, uploading, progress };
};
