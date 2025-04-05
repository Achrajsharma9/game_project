// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Header from './components/Header';
import HomePage from './Pages/HomePage';
import GameDetailPage from './Pages/GameDetailPage';
import LibraryPage from './Pages/LibraryPage';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game/:id" element={<GameDetailPage />} />
        <Route path="/library" element={
          <>
            <SignedIn>
              <LibraryPage />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;