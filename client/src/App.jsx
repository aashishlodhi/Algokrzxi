import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout.jsx';
import Home from './pages/Home.jsx';
import Modules from './pages/Modules.jsx';
import ModuleOverview from './pages/ModuleOverview.jsx';
import Lesson from './pages/Lesson.jsx';
import Roadmaps from './pages/Roadmaps.jsx';
import Search from './pages/Search.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="modules" element={<Modules />} />
        <Route path="m/:slug" element={<ModuleOverview />} />
        <Route path="m/:slug/:lessonId" element={<Lesson />} />
        <Route path="roadmaps" element={<Roadmaps />} />
        <Route path="search" element={<Search />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
