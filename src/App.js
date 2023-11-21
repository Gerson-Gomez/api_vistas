import React from 'react';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './componentes/Navbar';
import Comentarios from './componentes/Comentarios';
import Artistas from './componentes/Artistas';
import Albums from './componentes/Albums';



function App() {  
  return (
    <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Comentarios />} />
      <Route path="/artistas" element={<Artistas />} />
      <Route path="/albums" element={<Albums />} />
    </Routes>
  </Router>
);
}

export default App;