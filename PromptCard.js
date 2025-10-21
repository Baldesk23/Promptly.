import Link from 'next/link';
import { useState } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
// Import firestore as db from firebaseClient. The file exports `firestore` so we
// alias it as `db` here for convenience.
import { auth, firestore as db } from '../lib/firebaseClient';

/**
 * PromptCard component
 *
 * Displays a single prompt with title, prompt text snippet, copy button and like (heart) button.
 * The like button toggles the current user's like and updates Firestore accordingly. A link
 * wraps the image and title to navigate to the detailed prompt page. The copy button copies
 * the prompt text to the clipboard. The component expects the prompt object to contain
 * `id`, `title`, `promptText`, `exampleImageUrl`, `likesCount` and `likes` properties.
 */
export default function PromptCard({ prompt }) {
  const [likes, setLikes] = useState(prompt.likesCount || 0);
  // Determine whether the current user has already liked this prompt. We check
  // auth.currentUser at render time since this hook will re-render on auth state changes
  const currentUser = typeof window !== 'undefined' ? auth.currentUser : null;
  const [liked, setLiked] = useState(
    Boolean(currentUser && prompt.likes && prompt.likes.includes(currentUser.uid))
  );

  const handleLike = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      alert('Debes iniciar sesión para dar me gusta');
      return;
    }
    const promptRef = doc(db, 'prompts', prompt.id);
    try {
      if (liked) {
        await updateDoc(promptRef, {
          likesCount: (prompt.likesCount || 0) - 1,
          likes: arrayRemove(user.uid),
        });
        setLikes((prev) => prev - 1);
        setLiked(false);
      } else {
        await updateDoc(promptRef, {
          likesCount: (prompt.likesCount || 0) + 1,
          likes: arrayUnion(user.uid),
        });
        setLikes((prev) => prev + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error('Error al actualizar likes:', error);
    }
  };

  const handleCopy = async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      alert('Prompt copiado al portapapeles');
    } catch (err) {
      console.error('Error al copiar prompt:', err);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden bg-black/60 backdrop-blur border border-white/10 shadow-md hover:shadow-lg transition-shadow">
      <Link href={`/prompts/${prompt.id}`}>
        <a className="block">
          {prompt.exampleImageUrl ? (
            <img
              src={prompt.exampleImageUrl}
              alt={prompt.title}
              className="w-full h-40 object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-40 flex items-center justify-center bg-gray-800 text-gray-400">
              Sin imagen
            </div>
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-1 line-clamp-1 text-white">
              {prompt.title}
            </h3>
            <p className="text-sm text-gray-300 line-clamp-2">
              {prompt.promptText}
            </p>
          </div>
        </a>
      </Link>
      <div className="flex items-center justify-between px-4 pb-4 gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 py-2 text-center rounded-lg border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black transition-colors"
        >
          Copiar
        </button>
        <button
          onClick={handleLike}
          className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-black transition-colors"
        >
          <span>{liked ? '❤️' : '🤍'}</span> <span>{likes}</span>
        </button>
      </div>
    </div>
  );
}