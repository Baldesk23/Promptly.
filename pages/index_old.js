
import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Home() {
  useEffect(()=>{
    function handleMouseDown(){ document.body.classList.add('using-mouse') }
    window.addEventListener('mousedown', handleMouseDown)
    return ()=> window.removeEventListener('mousedown', handleMouseDown)
  },[])
  return (
    <>
      <Head>
        <title>Promptly — Galería de Prompts</title>
        <meta name="description" content="Promptly - Galería gratuita de prompts para generar imágenes con IA. Explora, copia y sube prompts." />
      </Head>
      <main>
        <header className="hero">
          <div className="container">
            <h1>Bienvenido a <strong>Promptly</strong> <span className="waveform" aria-hidden="true"><span></span><span></span><span></span><span></span></span></h1>
            <p>Explorá, copiá y compartí prompts para generar imágenes con IA — gratis y al instante.</p>
            <div style={{marginTop:18}}><a className="btn-primary" href="#catalog" id="explore-btn">Explorar prompts</a></div>
          </div>
        </header>

        <main role="main" className="container" id="catalog" aria-labelledby="catalog-heading">
          <h2 id="catalog-heading" style={{margin:0,fontSize:'1.25rem'}}>Catálogo</h2>
          <p style={{color:'rgba(255,255,255,0.7)',marginTop:'.5rem'}}>Tarjetas con prompts de ejemplo. Copialos o probalos en tu herramienta favorita.</p>
          <section className="catalog" aria-live="polite">
            <article className="card" role="article" aria-label="Prompt Cyberpunk City">
              <img loading="lazy" alt="Cyberpunk city example" src="https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=60" />
              <div className="meta">
                <strong>Ultra detailed cyberpunk city</strong>
                <p style={{margin:'8px 0',color:'rgba(255,255,255,0.8)',fontSize:'.9rem'}}>ultra detailed, cinematic, cyberpunk city, neon lights, rain, 8k, octane render</p>
                <div className="tags" aria-hidden="true"><span className="tag">cyberpunk</span><span className="tag">city</span></div>
                <div style={{display:'flex',gap:8,marginTop:12}}>
                  <button className="btn-primary" data-prompt="ultra detailed, cinematic, cyberpunk city, neon lights, rain, 8k, octane render" onClick={(e)=>{navigator.clipboard.writeText(e.target.getAttribute('data-prompt')).then(()=>alert('Prompt copiado'))}}>Copiar prompt</button>
                  <a className="btn-primary" style={{background:'transparent',border:'1px solid rgba(6,249,249,0.14)',color:'var(--primary)'}} href="#" aria-label="Probar en IA">Probar en IA</a>
                </div>
              </div>
            </article>

            <div className="ad-card" role="complementary" aria-label="Anuncio patrocinado">
              <div>
                <div className="ad-label">Patrocinado</div>
                <div style={{fontWeight:700}}>Desata tu creatividad — Prueba X AI</div>
                <div style={{marginTop:8}}><a className="btn-primary" href="#" style={{background:'transparent',border:'1px dashed rgba(6,249,249,0.12)',color:'var(--primary)'}}>Ver Planes</a></div>
              </div>
            </div>

          </section>
        </main>

        <footer role="contentinfo">
          <div style={{maxWidth:1000,margin:'0 auto'}}>
            <p style={{margin:'0 0 .5rem'}}>© 2025 Promptly. Creado por Kevin.</p>
            <small style={{color:'rgba(255,255,255,0.45)'}}>Política de privacidad • Términos • Contacto</small>
          </div>
        </footer>
      </main>
    </>
  )
}
