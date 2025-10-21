import { useEffect, useState } from 'react';
import { auth } from '../lib/firebaseClient';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Navbar from '../components/Navbar';

// The Profile page shows information about the currently logged-in user. If
// no user is logged in, it prompts the visitor to sign in first. You can
// extend this page to display the user’s prompts or allow editing of
// profile details.

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container">
          <p>Cargando...</p>
        </main>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <main className="container">
          <h1>Perfil</h1>
          <p>Debes iniciar sesión para ver tu perfil.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container profile">
        <h1>Tu perfil</h1>
        <img
          src={user.photoURL || ''}
          alt="avatar"
          className="profile-avatar"
        />
        <p>Nombre: {user.displayName || ''}</p>
        <p>Email: {user.email || ''}</p>
        <button className="btn-primary" onClick={() => signOut(auth)}>
          Cerrar sesión
        </button>
        {/* Aquí puedes listar los prompts del usuario o añadir más información. */}
      </main>
    </>
  );
}