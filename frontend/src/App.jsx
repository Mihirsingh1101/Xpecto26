const isTouchDevice =
  typeof window !== "undefined" &&
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import StarBackground from './components/StarBackground'; 
import Footer from './components/Footer'; // Import Footer

import Home from './pages/Home';
import Exhibition from './pages/Exhibition'; 
import Events from './pages/Events';        
import Sessions from './pages/Sessions';   
import Payments from './pages/Payment';


const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const CustomCursor = () => {
  const location = useLocation();
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  // Determine cursor color based on current route
  const getCursorColorClass = () => {
    const path = location.pathname;
    if (path === '/exhibition') return 'cursor-orange';
    if (path === '/events') return 'cursor-blue';
    if (path === '/sessions') return 'cursor-green';
    if (path === '/payments') return 'cursor-brown';
    return 'cursor-purple'; // default for home and other routes
  };

  const getSparkleColor = () => {
    const path = location.pathname;
    if (path === '/exhibition') return 'rgba(255, 159, 28, 0.9)';
    if (path === '/events') return 'rgba(67, 97, 238, 0.9)';
    if (path === '/sessions') return 'rgba(46, 196, 182, 0.9)';
    if (path === '/payments') return 'rgba(212, 163, 115, 0.9)';
    return 'rgba(138, 43, 226, 0.9)';
  };

  useEffect(() => {
    let lastPosition = { x: 0, y: 0 };
    let sparkleCounter = 0;

    const updateCursor = (e) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setCursorPosition(newPosition);

      // Create sparkle trail
      const distance = Math.sqrt(
        Math.pow(newPosition.x - lastPosition.x, 2) + 
        Math.pow(newPosition.y - lastPosition.y, 2)
      );

      // Create sparkles when cursor moves (every ~10px)
      if (distance > 10) {
        const sparkleId = sparkleCounter++;
        const sparkle = {
          id: sparkleId,
          x: lastPosition.x + (newPosition.x - lastPosition.x) * 0.3,
          y: lastPosition.y + (newPosition.y - lastPosition.y) * 0.3,
        };

        setSparkles((prev) => [...prev, sparkle]);

        // Remove sparkle after animation
        setTimeout(() => {
          setSparkles((prev) => prev.filter((s) => s.id !== sparkleId));
        }, 800);

        lastPosition = newPosition;
      }
    };

    const handleMouseEnter = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = (e) => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, []);

  return (
    <>
      {/* Sparkle Trail */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle-trail"
          style={{
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
            background: getSparkleColor(),
            boxShadow: `0 0 10px ${getSparkleColor()}, 0 0 20px ${getSparkleColor()}`,
          }}
        />
      ))}
      
      {/* Main Cursor */}
      <div 
        className={`custom-cursor ${getCursorColorClass()} ${isHovering ? 'hover' : ''}`}
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
        }}
      >
        <div className="saturn-ring saturn-ring-1"></div>
        <div className="saturn-ring saturn-ring-2"></div>
        <div className="saturn-ring saturn-ring-3"></div>
        <div className="saturn-planet"></div>
      </div>
    </>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="relative w-full min-h-screen bg-black text-white selection:bg-cyan-500/30 flex flex-col">
        
        {/* Custom Saturn Cursor */}
        {!isTouchDevice && <CustomCursor />}

        <Navbar />
        <StarBackground />

        {/* Main Content (flex-grow pushes footer down if content is short) */}
        <div className="relative z-10 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exhibition" element={<Exhibition />} />
            <Route path="/events" element={<Events />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/payments" element={<Payments />} />
          </Routes>
        </div>

        {/* Footer sits at the bottom */}
        <div className="relative z-10">
          <Footer />
        </div>

      </div>
    </Router>
  );
}

export default App;