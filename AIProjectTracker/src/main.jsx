import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// import store from "./redux/store";
// import { Provider } from 'react-redux'
import store from './app/store.jsx'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google'

// Replace with your Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = '970864604807-3unkbf2t1rcoffr28qdo011fdvgh38fu.apps.googleusercontent.com'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
   <GoogleOAuthProvider clientId="970864604807-3unkbf2t1rcoffr28qdo011fdvgh38fu.apps.googleusercontent.com">
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>
  // </StrictMode>,
)
