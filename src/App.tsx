import React from 'react';
import { Ship, Menu, X } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LatestReleases from './components/LatestReleases';
import Legal from './components/Legal';
import Privacy from './components/Privacy';
import Footer from './components/Footer';

function App() {
  const path = window.location.pathname;
  const basePath = import.meta.env.BASE_URL;
  
  // Remove the base path from the current path for comparison
  const relativePath = path.replace(basePath, '/');
  
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        {relativePath === '/legal' ? (
          <Legal />
        ) : relativePath === '/privacy' ? (
          <Privacy />
        ) : (
          <>
            <Hero />
            <LatestReleases />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;