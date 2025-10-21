import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { auth, db } from '../../lib/firebaseClient';

/**
 * Prompt detail page
 *
 * Displays the full details of a single prompt. Shows the title, prompt text,
 * number of likes, a like button, copy button, and the uploader's name with a
 * link to their public profile. Users must be authenticated to like prompts.
 */
export default function PromptDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [prompt, setPrompt] = useState(null);
  const [owner, setOwner] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        // Fetch prompt
        const promptRef = doc(db, 'prompts', id);
        const promptSnap = await getDoc(promptRef);
        if (promptSnap.exists()) {
          const data = { id: promptSnap.id, ...promptSnap.data() };
          setPrompt(data);
          setLikes(data.likesCount || 0);
          const currentUser = auth.currentUser;
          setLiked(
            Boolean(currentUser && data.likes && data.likes.includes(currentUser.uid))
          );
          // Fetch owner
          if (data.ownerId) {
            const ownerSnap = await getDoc(doc(db, 'users', data.ownerId));
            if (ownerSnap.exists()) {
              setOwner({ id: ownerSnap.id, ...ownerSnap.data() });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching prompt:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleLike = async () => {
    const user = auth.currentUser;
    if (!user) {
      alert('Debes iniciar sesión para dar me gusta');
      return;
    }
    const promptRef = doc(db, 'prompts', id);
    try {
      if (liked) {
        await updateDoc(promptRef, {
          likesCount: (prompt.likesCount || 0) - 1,
          likes: arrayRemove(user.uid),
        });
        setLikes((prev) => prev - 1);
        setLiked(false);
        setPrompt((prev) => ({ ...prev, likesCount: prev.likesCount - 1 }));
      } else {
        await updateDoc(promptRef, {
          likesCount: (prompt.likesCount || 0) + 1,
          likes: arrayUnion(user.uid),
        });
        setLikes((prev) => prev + 1);
        setLiked(true);
        setPrompt((prev) => ({ ...prev, likesCount: prev.likesCount + 1 }));
      }
    } catch (err) {
      console.error('Error updating likes:', err);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      alert('Prompt copiado al portapapeles');
    } catch (err) {
      console.error('Error al copiar prompt:', err);
    }
  };

  if (loading) {
    return (
      <main className="container py-20 text-center text-gray-300">
        Cargando…
      </main>
    );
  }
  if (!prompt) {
    return (
      <main className="container py-20 text-center text-gray-300">
        Prompt no encontrado
      </main>
    );
  }
  return (
    <>
      <Head>
        <title>{prompt.title} - Promptly</title>
      </Head>
      <main className="container max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-4 text-white">{prompt.title}</h1>
        {owner && (
          <p className="mb-2 text-sm text-gray-400">
            Subido por{' '}
            <Link href={`/users/${owner.id}`}>
              <a className="text-cyan-400 hover:underline">
                {owner.displayName || owner.email || 'Usuario'}
              </a>
            </Link>
          </p>
        )}
        <div className="mb-4">
          <p className="text-gray-300 whitespace-pre-line">
            {prompt.promptText}
          </p>
        </div>
        {prompt.exampleImageUrl && (
          <img
            src={prompt.exampleImageUrl}
            alt={prompt.title}
            className="w-full h-auto rounded-lg mb-4"
          />
        )}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={handleLike}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black transition-colors"
          >
            <span>{liked ? '❤️' : '🤍'}</span>
            <span>{likes}</span>
          </button>
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors"
          >
            Copiar prompt
          </button>
        </div>
      </main>
    </>
  );
}
