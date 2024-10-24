// pages/_app.js or pages/_app.tsx
import '../styles/global.css'
// The rest of your code...


export default function App({ Component, pageProps }) {
    return <Component {...pageProps} />
  }