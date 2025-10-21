import Head from 'next/head';
import { useState, useEffect } from 'react';
import { auth, googleProvider, storage } from '../lib/firebaseClient';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function Upload() {
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [promptText, setPromptText] = useState('');
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          setUser(result.user);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  async function login() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (error) {
      await signInWithRedirect(auth, googleProvider);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!user) return alert('Inicia sesión con Google primero');
    if (!title || !promptText) return alert('Completá título y prompt');
    let imageUrl = '';
    if (file) {
      const storageRef = ref(storage, `prompts/${user.uid}/${Date.now()}_${file.name}`);
      const task = uploadBytesResumable(storageRef, file);
      task.on('state_changed', (snapshot) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(prog));
      });
      await task;
      imageUrl = await getDownloadURL(storageRef);
    }
    const token = await user.getIdToken();
    const res = await fetch('/api/prompts/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        promptText,
        tags: [],
        category: 'General',
        aiModel: 'manual',
        exampleImageUrl: imageUrl,
      }),
    });
    if (res.ok) {
      alert('Prompt subido. Será revisado por moderación si corresponde.');
      setTitle('');
      setPromptText('');
      setFile(null);
      setProgress(0);
    } else {
      const body = await res.json();
      alert('Error: ' + (body.error || 'unknown'));
    }
  }

  return (
    <>
      <Head>
        <title>Subir prompt - Promptly</title>
      </Head>
      <main className="container" style={{ paddingTop: 40 }}>
        <h1>Subir prompt</h1>
        {!user ? (
          <button className="btn btn-primary" onClick={login}>
            Iniciar sesión con Google
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <img
              src={user?.photoURL || ''}
              alt="avatar"
              style={{ width: 40, height: 40, borderRadius: 999 }}
            />
            <div>{user?.displayName || ''}</div>
          </div>
        )}
        <form
          onSubmit={handleUpload}
          style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Prompt (lo que quieras generar)"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            rows={6}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {progress > 0 && <div>Subida: {progress}%</div>}
          <button className="btn-primary" type="submit">
            Subir Prompt
          </button>
        </form>
      </main>
    </>
  );
}
