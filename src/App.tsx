import React from 'react';
import { Ship, Menu, X } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LatestReleases from './components/LatestReleases';
import ReleaseDetails from './components/ReleaseDetails';
import Legal from './components/Legal';
import Privacy from './components/Privacy';
import Admin from './components/Admin';
import EditRelease from './components/EditRelease';
import Footer from './components/Footer';

function App() {
  const path = window.location.pathname;
  const search = window.location.search;
  const basePath = import.meta.env.DEV ? '/' : '/airshipbeta/';
  
  // Handle GitHub Pages redirect path
  let relativePath = path.replace(basePath, '');
  if (search.startsWith('?/')) {
    relativePath = search.slice(2);
  }
  
  // Extract release ID from path if present
  const releaseMatch = relativePath.match(/^releases\/(\d+)$/);
  const releaseId = releaseMatch ? parseInt(releaseMatch[1]) : null;

  // Extract edit ID from path if present
  const editMatch = relativePath.match(/^admin\/edit\/(\d+)$/);
  const editId = editMatch ? parseInt(editMatch[1]) : null;

  // Determine which component to render based on the relative path
  const renderContent = () => {
    switch (relativePath) {
      case 'legal':
        return <Legal />;
      case 'privacy':
        return <Privacy />;
      case 'admin':
        return <Admin />;
      case 'admin/new':
        return <EditRelease />;
      default:
        if (editId) {
          return <EditRelease releaseId={editId} />;
        }
        if (releaseId) {
          return <ReleaseDetails releaseId={releaseId} />;
        }
        return (
          <>
            <Hero />
            <LatestReleases />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {!relativePath.startsWith('admin') && <Navbar />}
      <main>
        {renderContent()}
      </main>
      {!relativePath.startsWith('admin') && <Footer />}
    </div>
  );
}