import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage';
import ListView from './components/ListView';
import GalleryView from './components/GalleryView';
import DetailView from './components/DetailView';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/mp2">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<ListView />} />
            <Route path="/gallery" element={<GalleryView />} />
            <Route path="/movie/:id" element={<DetailView />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
