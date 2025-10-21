import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebaseClient';
import PromptCard from '../../components/PromptCard';

/**
 * User profile page
 *
 * Displays the public profile of a user and lists all prompts created by that user.
 * Fetches the user record from the `users` collection and queries the `prompts`
 * collection for documents where `ownerId` equals the user's ID. Cards for each
 * prompt are rendered using the `PromptCard` component. If no prompts exist
 * for the user, a placeholder message is shown.
 */
export default function UserProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        // Fetch user data
        const userSnap = await getDoc(doc(db, 'users', id));
        if (userSnap.exists()) {
          setUser({ id: userSnap.id, ...userSnap.data() });
        }
        // Fetch prompts by this user
        const promptsQuery = query(collection(db, 'prompts'), where('ownerId', '==', id));
        const qsnap = await getDocs(promptsQuery);
        const promptList = qsnap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
        setPrompts(promptList);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <main className="container py-20 text-center text-gray-300">
        Cargando…
      </main>
    );
  }
  if (!user) {
    return (
      <main className="container py-20 text-center text-gray-300">
        Perfil no encontrado
      </main>
    );
  }
  return (
    <>
      <Head>
        <title>{user.displayName || user.email || 'Perfil'} - Promptly</title>
      </Head>
      <main className="container max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8 flex items-center gap-4">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || user.email}
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
              {user.displayName ? user.displayName.charAt(0) : '?'}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {user.displayName || user.email || 'Usuario'}
            </h1>
            <p className="text-gray-400 text-sm">Miembro desde {user.createdAt?.toDate?.().toLocaleDateString?.() || '-'}</p>
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-4 text-white">Prompts subidos</h2>
        {prompts.length === 0 ? (
          <p className="text-gray-400">Este usuario aún no ha subido prompts.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
