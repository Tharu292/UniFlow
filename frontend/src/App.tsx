import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Toaster } from 'react-hot-toast';

<Toaster position="top-right" />

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Toaster position="top-right" />
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/resources" element={<Resources />} />
          {/*For Pages later*/}
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;