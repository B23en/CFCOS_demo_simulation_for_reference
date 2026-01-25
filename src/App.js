import './App.css';
import { Startup, Explanation, Selection, InputTags, Processing, Results, Done, Rating, Preference } from './pages';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider } from './LanguageContext';
import { SessionProvider } from './SessionContext';

function App() {
  const location = useLocation();

  return (
    <div className="App">
      <LanguageProvider>
        <SessionProvider>
          <AnimatePresence mode="wait">
            <Routes key={location.pathname} location={location}>
              <Route path="/" element={<Startup />} />
              <Route path="/explanation" element={<Explanation />} />
              <Route path="/selection" element={<Selection />} />
              <Route path="/input-tags" element={<InputTags />} />
              <Route path="/processing" element={<Processing />} />
              <Route path="/results" element={<Results />} />
              <Route path="/preference" element={<Preference/>} />
              <Route path="/rating" element={<Rating />} />
              <Route path="/done" element={<Done />} />
            </Routes>
          </AnimatePresence>
        </SessionProvider>
      </LanguageProvider>
    </div>
  );
}

export default App;
