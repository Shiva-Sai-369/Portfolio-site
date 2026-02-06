
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  PerspectiveCamera, 
  Float, 
  Stars, 
  ContactShadows, 
  Environment,
  PresentationControls
} from '@react-three/drei';
import Experience from './Experience';
import { COLORS } from '../constants';

// Define intrinsic elements as uppercase constants to avoid JSX.IntrinsicElements errors
const AmbientLight = 'ambientLight' as any;
const SpotLight = 'spotLight' as any;
const PointLight = 'pointLight' as any;

const Scene: React.FC = () => {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} />
      
      {/* Lighting */}
      <AmbientLight intensity={0.2} />
      <SpotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <PointLight position={[-10, -10, -10]} intensity={0.5} color={COLORS.secondary} />
      <PointLight position={[0, 5, 0]} intensity={0.8} color={COLORS.primary} />

      {/* Background Elements */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Main Experience */}
      <Experience />

      {/* Post Processing Simulation */}
      <Environment preset="city" />
      <ContactShadows 
        position={[0, -4.5, 0]} 
        opacity={0.4} 
        scale={20} 
        blur={2} 
        far={4.5} 
      />
    </Canvas>
  );
};

export default Scene;
