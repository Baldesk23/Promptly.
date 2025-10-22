import Head from 'next/head';
import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import Navbar from '../components/Navbar';
import PromptCard from '../components/PromptCard';
import { db } from '../lib/firebaseClient';

// This homepage separates the hero and catalog sections. The hero includes a
// button that smoothly scrolls to the catalog when clicked. A navbar at the top
// allows navigation to the catalog, profile and upload pages and shows
// login/logout options.

export default function Home() {
  const scrollToCatalogo = () => {
    const el = document.getElementById('catalogo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  // Fetch prompts from Firestore on mount
  const [prompts, setPrompts] = useState([]);
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const q = query(collection(db, 'prompts'), orderBy('createdAt', 'desc'), limit(12));
        const qsnap = await getDocs(q);
        const list = qsnap.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
        setPrompts(list);
      } catch (err) {
        console.error('Error fetching prompts:', err);
      }
    };
    fetchPrompts();
  }, []);
  return (
    <>
      <Head>
        <title>Promptly</title>
      </Head>
      <Navbar />
      {/* Sección de hero con fondo animado y botón para explorar el catálogo */}
      <section className="hero">
        {/* Partículas animadas de fondo */}
        <div className="particle-wrapper">
          <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <h1 className="hero-title">Bienvenido a Promptly</h1>
        <p className="hero-subtitle">
          Explorá, copiá y compartí prompts para generar imágenes con IA — gratis y al instante.
        </p>
        <button className="btn-primary" onClick={scrollToCatalogo}>
          Explorar prompts
        </button>
      </section>
      {/* Sección de catálogo con lista de tarjetas de prompts */}
      <section id="catalogo" className="catalog">
        <h2 className="section-title">Catálogo</h2>
        <p className="section-subtitle">
          Tarjetas con prompts de ejemplo. Copialos o probalos en tu herramienta favorita.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </section>
    </>
  );
}
