import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { useAppStore, AppPhase } from '@/store/appStore';

interface Envelope3DProps {
  guestName: string;
}

export function Envelope3D({ guestName }: Envelope3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const flapRef = useRef<THREE.Mesh>(null);
  const paperRef = useRef<THREE.Mesh>(null);

  const [isOpening, setIsOpening] = useState(false);
  const [progress, setProgress] = useState(0);

  const setPhase = useAppStore((state) => state.setPhase);
  const startMusic = useAppStore((state) => state.startMusic);

  useFrame((state, delta) => {
    if (!isOpening) {
      if (groupRef.current) {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.08;
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.04;
      }
    } else {
      if (progress < 1) {
        const nextProg = Math.min(progress + delta * 0.75, 1);
        setProgress(nextProg);

        // Flap open
        if (flapRef.current) {
          flapRef.current.rotation.x = THREE.MathUtils.lerp(0, -Math.PI * 0.8, nextProg);
        }

        // Paper slide out
        if (paperRef.current && nextProg > 0.25) {
          const p = (nextProg - 0.25) / 0.75;
          paperRef.current.position.y = THREE.MathUtils.lerp(-0.4, 2.2, p);
          paperRef.current.position.z = THREE.MathUtils.lerp(0, 3.5, Math.pow(p, 0.4));
          paperRef.current.scale.setScalar(THREE.MathUtils.lerp(0.85, 2.2, p));
        }

        if (nextProg >= 1) {
          setPhase(AppPhase.TRANSITION);
        }
      }
    }
  });

  const handleClick = () => {
    if (!isOpening) {
      setIsOpening(true);
      startMusic();
    }
  };

  return (
    <group ref={groupRef} dispose={null}>
      {/* Back & body */}
      <mesh position={[0, 0, 0]} onClick={handleClick} castShadow receiveShadow>
        <boxGeometry args={[3, 2, 0.06]} />
        <meshStandardMaterial color="#f5eedc" roughness={0.6} />
      </mesh>

      {/* Flap */}
      <mesh ref={flapRef} position={[0, 1, 0.035]} onClick={handleClick}>
        <boxGeometry args={[3, 2, 0.03]} />
        <meshStandardMaterial color="#ece3cc" roughness={0.6} side={THREE.DoubleSide} />
        <Html position={[0, -0.4, 0.02]} transform distanceFactor={2} style={{ pointerEvents: 'none' }}>
          <div style={{ textAlign: 'center', fontFamily: 'serif', width: '220px' }}>
            <div style={{ fontSize: '11px', color: '#8c7a5b', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Kepada Yth.
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#2c221e', marginTop: '4px' }}>
              {guestName || 'Tamu Undangan'}
            </div>
          </div>
        </Html>
      </mesh>

      {/* Slide-out Paper */}
      <mesh ref={paperRef} position={[0, -0.4, 0]} scale={0.75}>
        <planeGeometry args={[2.4, 3.2]} />
        <meshStandardMaterial color="#fffef9" roughness={0.9} side={THREE.DoubleSide} />
        <Html position={[0, 0, 0.01]} transform distanceFactor={2.2} style={{ pointerEvents: 'none' }}>
          <div style={{ textAlign: 'center', fontFamily: 'serif', width: '260px', padding: '20px', color: '#2c221e' }}>
            <div style={{ fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', color: '#b59a68' }}>
              Undangan Pernikahan
            </div>
            <div style={{ fontSize: '26px', fontWeight: 'bold', fontFamily: 'Playfair Display', margin: '15px 0' }}>
              Andi & Siska
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>
              Sabtu, 25 Oktober 2026
            </div>
          </div>
        </Html>
      </mesh>

      {/* Button hint */}
      {!isOpening && (
        <Html position={[0, -1.5, 0]} center>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="bg-amber-100/90 text-amber-900 border border-amber-300 px-6 py-3 rounded-full font-serif font-semibold shadow-2xl backdrop-blur-md cursor-pointer pointer-events-auto flex items-center gap-2 text-sm tracking-wide"
          >
            <span>✉️</span> Buka Undangan
          </motion.button>
        </Html>
      )}

      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow />
      <pointLight position={[-5, -2, -2]} intensity={0.4} />
    </group>
  );
}
