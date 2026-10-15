import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AnnouncementBar from './AnnouncementBar.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import CommandPalette from './CommandPalette.jsx';
import ConsentToast from './ConsentToast.jsx';

export default function Layout() {
  const { pathname } = useLocation();
  const isLesson = /^\/m\/[^/]+\/[^/]+/.test(pathname);
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <>
      <a href="#main" className="sr-only">Skip to content</a>
      <AnnouncementBar />
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      {!isLesson && <Footer />}
      <CommandPalette />
      <ConsentToast />
    </>
  );
}
