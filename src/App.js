/* * Copyright (c) 2026 BVLTRA. All rights reserved.
 * Licensed under the Educational and Demonstrative Use License, Version 1.0.
 * See LICENSE file in the project root for full terms and restrictions.
 */
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavigationBar from './navbar';
import LandingPage from './LandingPage';
import ComparisonPage from './ComparisonPage';
import TimelinePage from './TimelinePage';
import ComparePage from './ComparePage';

function App() {
  return (
    <BrowserRouter>
      {/* Note about Routing: This is so the Navbar appears on all routes */}
      <NavigationBar />
      
      {/* Understanding of Routing: The Routes engine watches the URL and renders the matching component */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/timeline" element={<TimelinePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
