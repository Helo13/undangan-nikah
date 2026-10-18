import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import { Envelope3D } from './Envelope3D';
import { useAppStore } from '@/store/appStore';

export function EnvelopeScene() {
  const guestName = useAppStore((state) => state.guestName);

  return (
    <div className="fixed inset-0 bg-[#0f0e17] flex items-center justify-center">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <Suspense fallback={null}>
          <Envelope3D guestName={guestName} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2 + 0.2} minPolarAngle={Math.PI / 2 - 0.2} />
      </Canvas>
    </div>
  );
}
