import ReactDOM from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import persistor, { store } from './store'
import App from './App.tsx'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PersistGate } from 'redux-persist/integration/react'
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
      <ToastContainer />
    </PersistGate>
  </Provider>
);
