
PROMPTLY - FULL TEMPLATE (Next.js + Firebase) - INSTRUCCIONES PASO A PASO (para NO PROGRAMADORES)

Archivos clave creados en promptly-template/:
- package.json, next.config.js
- pages/index.js, pages/upload.js, pages/api/prompts/create.js
- lib/firebaseClient.js, lib/firebaseAdmin.js, lib/verifyToken.js
- functions/index.js (Cloud Function template)
- styles/globals.css
- firestore.rules, storage.rules (in project root)
- README deploy instructions

ANTES DE EMPEZAR (requisitos mínimos):
- Cuenta de Google
- Cuenta en Firebase (console.firebase.google.com)
- Cuenta en Vercel (vercel.com) o Firebase Hosting (opcional)
- Si no sabes usar terminal, pido ayuda de un desarrollador o uso Vercel web to deploy a static repo after commit

VARIABLES DE ENTORNO (establecer en Vercel env vars o en .env.local durante desarrollo):
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
FIREBASE_SERVICE_ACCOUNT  (JSON stringified service account for server admin SDK)
FIREBASE_STORAGE_BUCKET (same as NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)

PASOS RÁPIDOS (Despliegue en Vercel):
1) Subir este template a un repo GitHub (subir carpeta promptly-template como repo)
2) Conectar GitHub en Vercel, seleccionar repo y Deploy (Vercel detecta Next.js)
3) Añadir variables de entorno en Vercel (Settings > Environment Variables) con los valores de Firebase.
4) En Firebase console: habilitar Authentication -> Sign-in method -> Google
5) En Firebase console: crear Firestore DB (modo producción recomendado)
6) En Firebase console: Storage -> crear bucket
7) En Firebase console: Reglas -> pegar firestore.rules y storage.rules (archivos incluidos)
8) Opcional: Deploy Cloud Functions (requiere Firebase CLI & billing) para moderación

SEGURIDAD Y REGLAS:
- Usa los archivos firestore.rules y storage.rules incluidos para controlar quién puede escribir.
- En producción, revisa las reglas y ajusta límites (rate limits) y comprobaciones de metadata.

SI QUERÉS QUE LO SUBA YO:
- No puedo desplegar por ti fuera de este entorno, pero te puedo generar los comandos exactos y el ZIP listo para subir a GitHub, o incluso instrucciones para compartir con un dev que lo haga por vos.
- Si querés, genero también un archivo .zip con todo listo para subir. Para eso responde: "Genera ZIP".
