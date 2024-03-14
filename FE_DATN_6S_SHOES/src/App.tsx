
import './App.css'
import { RouterProvider } from "react-router-dom";
import { routes } from './routes';

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <div className='min-h-screen '>
      <RouterProvider router={routes} />
    </div>
  )
}

export default App
