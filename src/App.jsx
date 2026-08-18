import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, Float, Stars, Text, Html } from '@react-three/drei';

// 3D Spinning Ravi Kishan Cube
const RaviCube = ({ onMemeClick }) => {
  const cubeRef = useRef();
  
  const [texture1, texture2, texture3] = useTexture([
    '/ravi-meme-1.jpg',
    '/ravi-meme-2.jpg',
    '/ravi-meme-3.jpg'
  ]);

  useFrame((state, delta) => {
    cubeRef.current.rotation.x += delta * 1.5;
    cubeRef.current.rotation.y += delta * 2.5;
  });

  return (
    <Float speed={5} rotationIntensity={2} floatIntensity={4}>
      <mesh ref={cubeRef} scale={[3, 3, 3]} onClick={onMemeClick}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial attach="material-0" map={texture1} />
        <meshStandardMaterial attach="material-1" map={texture2} />
        <meshStandardMaterial attach="material-2" map={texture3} />
        <meshStandardMaterial attach="material-3" map={texture1} />
        <meshStandardMaterial attach="material-4" map={texture2} />
        <meshStandardMaterial attach="material-5" map={texture3} />
      </mesh>
    </Float>
  );
};

// Falling Money Particle System
const RainingMoney = () => {
  const moneyRefs = useRef([]);
  const [moneyProps] = useState(() =>
    Array.from({ length: 100 }, () => ({
      x: (Math.random() - 0.5) * 30,
      y: Math.random() * 40,
      z: (Math.random() - 0.5) * 20 - 5,
      speed: Math.random() * 0.1 + 0.05,
      rotX: Math.random(),
      rotY: Math.random()
    }))
  );

  useFrame(() => {
    moneyRefs.current.forEach((ref, i) => {
      if (ref) {
        ref.position.y -= moneyProps[i].speed;
        ref.rotation.x += 0.02;
        ref.rotation.y += 0.02;
        if (ref.position.y < -15) ref.position.y = 15;
      }
    });
  });

  return (
    <group>
      {moneyProps.map((props, i) => (
        <Text
          key={i}
          ref={(el) => (moneyRefs.current[i] = el)}
          position={[props.x, props.y, props.z]}
          fontSize={1.5}
        >
          💸
        </Text>
      ))}
    </group>
  );
};

// Background chaotic text
const MemeText = () => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Text
        position={[0, 3, -2]}
        fontSize={1.5}
        color="#ff00ff"
        font="https://fonts.gstatic.com/s/bangers/v20/FeVQS0NV3XyIgALV0AI.woff"
      >
        ZINDAGI JHANDWA!
      </Text>
    </Float>
  );
};

export default function App() {
  const [isPlayingGucci, setIsPlayingGucci] = useState(true);
  const [isShaking, setIsShaking] = useState(false); 
  const [activeModal, setActiveModal] = useState(null); 
  const [resumeGucciOnClose, setResumeGucciOnClose] = useState(false); 
  
  const gucciVideoRef = useRef(null);
  const gucciAudioRef = useRef(null);
  const bouncingMemeRef = useRef(null); 

  useEffect(() => {
    gucciAudioRef.current = new Audio('/gucci-riyaz.mp3');
    gucciAudioRef.current.loop = true;

    const attemptAutoplay = async () => {
      try {
        if (gucciVideoRef.current) await gucciVideoRef.current.play();
        if (gucciAudioRef.current) await gucciAudioRef.current.play();
      } catch (error) {
        console.log("Browser blocked audio autoplay. User click required.");
        if (gucciVideoRef.current) gucciVideoRef.current.pause();
        setIsPlayingGucci(false);
      }
    };

    attemptAutoplay();

    return () => {
      if (gucciAudioRef.current) {
        gucciAudioRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    let shakeTimeout;
    if (isPlayingGucci) {
      setIsShaking(true);
      shakeTimeout = setTimeout(() => {
        setIsShaking(false);
      }, 3000);
    } else {
      setIsShaking(false);
    }
    return () => clearTimeout(shakeTimeout);
  }, [isPlayingGucci]);

  useEffect(() => {
    const playBoom = () => {
      const boom = new Audio('/boom.mp3');
      boom.volume = 0.5; 
      boom.play().catch(e => console.log("Boom blocked", e));
    };
    window.addEventListener('click', playBoom);
    return () => window.removeEventListener('click', playBoom);
  }, []);

  useEffect(() => {
    let x = 100;
    let y = 100;
    let dx = 4;
    let dy = 4;
    let animationFrameId;

    const bounce = () => {
      if (bouncingMemeRef.current) {
        const rect = bouncingMemeRef.current.getBoundingClientRect();
        const winW = window.innerWidth;
        const winH = window.innerHeight;

        if (x + rect.width >= winW || x <= 0) dx = -dx; 
        if (y + rect.height >= winH || y <= 0) dy = -dy; 

        x += dx;
        y += dy;
        bouncingMemeRef.current.style.left = `${x}px`;
        bouncingMemeRef.current.style.top = `${y}px`;
      }
      animationFrameId = requestAnimationFrame(bounce);
    };

    bounce();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const toggleGucci = (e) => {
    if (e) e.stopPropagation(); 
    if (isPlayingGucci) {
      gucciVideoRef.current?.pause();
      gucciAudioRef.current?.pause();
    } else {
      gucciVideoRef.current?.play();
      gucciAudioRef.current?.play();
    }
    setIsPlayingGucci(!isPlayingGucci);
  };

  const openModal = (modalType, e) => {
    if (e) e.stopPropagation();
    if (isPlayingGucci) {
      gucciVideoRef.current?.pause();
      gucciAudioRef.current?.pause();
      setIsPlayingGucci(false);
      setResumeGucciOnClose(true);
    } else {
      setResumeGucciOnClose(false);
    }
    setActiveModal(modalType);
  };

  const closeModal = (e) => {
    if (e) e.stopPropagation();
    setActiveModal(null);
    if (resumeGucciOnClose) {
      gucciVideoRef.current?.play();
      gucciAudioRef.current?.play();
      setIsPlayingGucci(true);
      setResumeGucciOnClose(false);
    }
  };

  return (
    <div className={isShaking ? 'earthquake' : ''} style={{ width: '100vw', height: '100vh', backgroundColor: '#000', position: 'relative', overflow: 'hidden' }}>
      
      {/* Chaotic 2000s Website UI Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 10, pointerEvents: 'none', display: activeModal ? 'none' : 'block' }}>
        <marquee scrollamount="15" style={{ color: 'lime', fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontFamily: 'Impact', textShadow: '2px 2px red' }}>
          🔥🔥 Ravi ki Puttar presents: MONEY FOLLOWS MY BROTHER 🔥🔥 ZINDAGI JHANDWA 🔥🔥 
        </marquee>
      </div>

      {/* BOUNCING MEME 4 IN THE BACKGROUND */}
      <img 
        ref={bouncingMemeRef}
        src="/ravi-meme-4.jpg" 
        alt="Bouncing Ravi"
        style={{
          position: 'absolute',
          zIndex: 5,
          width: 'min(20vw, 150px)', // Fluid sizing
          border: '3px dashed yellow',
          boxShadow: '5px 5px 0px red',
          display: activeModal ? 'none' : 'block' 
        }}
      />

      {/* RESPONSIVE Gucci Dance Video Player (Bottom Left) */}
      <div 
        style={{ 
          position: 'absolute', 
          bottom: '15px',
          left: '10px',
          zIndex: 20,
          border: '3px solid hotpink',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '5px 5px 0px cyan',
          backgroundColor: '#000',
          width: 'min(38vw, 250px)', // Shrinks on mobile
          display: activeModal ? 'none' : 'block'
        }}>
        <video 
          ref={gucciVideoRef} 
          src="/gucci-dance.mp4" 
          loop 
          muted 
          playsInline
          style={{ width: '100%', display: 'block' }} 
        />
        <button 
          onClick={toggleGucci}
          style={{
            width: '100%',
            padding: 'clamp(5px, 2vw, 10px)',
            fontSize: 'clamp(0.8rem, 2.5vw, 1.2rem)', // Scalable text
            fontFamily: 'Comic Sans MS, Comic Sans, cursive',
            backgroundColor: isPlayingGucci ? 'red' : 'yellow',
            color: isPlayingGucci ? 'white' : 'blue',
            border: 'none',
            borderTop: '3px dashed hotpink',
            cursor: 'pointer',
            transition: 'all 0.1s'
          }}
        >
          {isPlayingGucci ? '🛑 STOP' : '▶️ PLAY'}
        </button>
      </div>

      {/* RESPONSIVE Video Popup Button (For Money Follows) */}
      <div style={{ 
        position: 'absolute', 
        bottom: '15px', 
        right: '10px', 
        zIndex: 20,
        display: activeModal ? 'none' : 'block' 
      }}>
        <button 
          onClick={(e) => openModal('money', e)}
          style={{
            padding: 'clamp(10px, 3vw, 20px) clamp(15px, 4vw, 40px)',
            fontSize: 'clamp(1rem, 3.5vw, 1.8rem)', // Scalable text
            fontFamily: 'Comic Sans MS, Comic Sans, cursive',
            backgroundColor: 'chartreuse',
            color: 'black',
            border: '4px double orange',
            boxShadow: '-5px 5px 0px magenta',
            cursor: 'pointer',
            transition: 'all 0.1s'
          }}
        >
          📺 WATCH
        </button>
      </div>

      {/* DYNAMIC VIDEO POPUP MODAL */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.95)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px'
        }}>
          
          <button 
            onClick={closeModal}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              padding: 'clamp(5px, 2vw, 10px) clamp(10px, 3vw, 20px)',
              fontSize: 'clamp(1.2rem, 4vw, 2rem)',
              fontWeight: 'bold',
              backgroundColor: 'red',
              color: 'white',
              border: '3px solid white',
              fontFamily: 'Impact',
              cursor: 'pointer',
              zIndex: 1000
            }}
          >
            X CLOSE
          </button>

          <div style={{ 
            border: '5px dashed lime', 
            boxShadow: '0 0 30px lime', 
            backgroundColor: 'black',
            width: 'min(90vw, 600px)', // Constrains the modal width
            aspectRatio: activeModal === 'money' ? 'auto' : '9/16' // Fixes youtube iframe aspect ratio
          }}>
            {activeModal === 'money' ? (
              <video 
                src="/money-follows.mp4" 
                autoPlay 
                controls 
                loop
                style={{ width: '100%', maxHeight: '70vh', display: 'block' }}
              />
            ) : (
              <iframe 
                width="100%" 
                height="100%" 
                src={
                  activeModal === 'sutti' ? "https://www.youtube.com/embed/fVE5I2Z0iAg?autoplay=1&loop=1&playlist=fVE5I2Z0iAg" : 
                  activeModal === 'mid' ? "https://www.youtube.com/embed/n-_C9MVLLSk?autoplay=1&loop=1&playlist=n-_C9MVLLSk" :
                  "https://www.youtube.com/embed/tzCpWj6gSJ4?autoplay=1&loop=1&playlist=tzCpWj6gSJ4"
                } 
                title="YouTube player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                style={{ display: 'block' }}
              ></iframe>
            )}
          </div>
          
          <h1 style={{ 
            color: 'magenta', 
            fontFamily: 'Comic Sans MS', 
            marginTop: '20px', 
            textShadow: '2px 2px white', 
            textAlign: 'center',
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)'
          }}>
            {activeModal === 'money' ? 'MONEY MULTIPLYING...' : 
             activeModal === 'sutti' ? 'GHAR JAKE SUTTI BABU! 🛌' : 
             activeModal === 'mid' ? 'ABSOLUTE CINEMA! 🎥' :
             'hai Goteshwarai'}
          </h1>
        </div>
      )}

      {/* The 3D Canvas */}
      <div style={{ display: activeModal ? 'none' : 'block', width: '100%', height: '100%' }}>
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 5]} intensity={2} color="#ff00ff" />
          <directionalLight position={[-10, -10, -5]} intensity={2} color="#00ffff" />
          
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={1} fade speed={isPlayingGucci ? 12 : 2} />
          
          <RainingMoney />

          <React.Suspense fallback={
            <Html center>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', width: '100vw', padding: '0 20px' }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'row', 
                  gap: '10px', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  flexWrap: 'nowrap' // Prevents them from breaking onto new lines on small screens
                }}>
                  {/* Fluid widths to keep them aligned side-by-side on mobile */}
                  <img src="/ravi-meme-1.jpg" alt="Meme 1" onClick={(e) => openModal('left', e)} style={{ width: 'min(28vw, 200px)', cursor: 'pointer', border: '3px dashed magenta' }} />
                  <img src="/ravi-meme-2.jpg" alt="Meme 2" onClick={(e) => openModal('mid', e)} style={{ width: 'min(28vw, 200px)', cursor: 'pointer', border: '3px dashed cyan' }} />
                  <img src="/ravi-meme-3.jpg" alt="Meme 3" onClick={(e) => openModal('sutti', e)} style={{ width: 'min(28vw, 200px)', cursor: 'pointer', border: '3px dashed lime' }} />
                </div>
                <h2 style={{ 
                  color: 'lime', 
                  fontFamily: 'Comic Sans MS', 
                  textShadow: '2px 2px red', 
                  marginTop: '5px', 
                  whiteSpace: 'nowrap',
                  fontSize: 'clamp(1.2rem, 4vw, 2rem)' // Scalable text to prevent cutoff
                }}>
                  LOADING CHAOS... (CLICK A MEME)
                </h2>
              </div>
            </Html>
          }>
            <RaviCube onMemeClick={toggleGucci} />
            <MemeText />
          </React.Suspense>
          
          <OrbitControls autoRotate autoRotateSpeed={isPlayingGucci ? 25 : 5} enableZoom={true} />
        </Canvas>
      </div>
    </div>
  );
}