import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth } from '../lib/firebaseClient';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// A reusable navigation bar that displays the app logo and links. It shows
// the user’s display name (or “Perfil”) when authenticated and a login link
// otherwise. The log-out button appears when the user is signed in.

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link href="/">Promptly</Link>
      </div>
      <div className="navbar-right">
        <Link href="#catalogo">Catálogo</Link>
        {/* Enlace para subir un nuevo prompt. Permite a cualquier usuario acceder
            a la página de subida; allí se pedirá iniciar sesión si es necesario. */}
        <Link href="/upload">Subir prompt</Link>
        {user ? (
          <>
            {/* Enlace al perfil público del usuario autenticado */}
            <Link href="/profile">
              {user.displayName ? user.displayName.split(' ')[0] : 'Perfil'}
            </Link>
            {/* Botón para cerrar sesión */}
            <button className="link-button" onClick={() => signOut(auth)}>
              Cerrar sesión
            </button>
          </>
        ) : (
          // Si no hay sesión iniciada, mostrar enlace para iniciar sesión
          <Link href="/upload">Iniciar sesión</Link>
        )}
      </div>
    </nav>
  );
}
