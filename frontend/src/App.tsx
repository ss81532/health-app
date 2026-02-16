import './App.css'
import AppRouter from './router/AppRouter'
import AppNavbar from './components/AppNavbar'
import { BrowserRouter } from 'react-router-dom';
import Breadcrumbs from './components/Breadcrumbs';
import { BackButton } from './components/BackButton';

function App() {
   return (
      <BrowserRouter>
         <AppNavbar />
         <div className="page-container">
            <BackButton />
            <AppRouter />
         </div>
      </BrowserRouter>
   );
}


export default App
