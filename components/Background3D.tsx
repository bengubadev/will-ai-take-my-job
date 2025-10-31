// FIX: Add a triple-slash directive to force TypeScript to load react-three-fiber's type definitions,
// which resolves the errors about unrecognized JSX elements like <mesh>.
/// <reference types="@react-three/fiber" />
import * as THREE from 'three';
import React, { useRef, useMemo, useEffect, useState } from 'react';
// FIX: Import `ThreeElements` to provide types for react-three-fiber components.
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';

// FIX: Add strong types to the Cube component props for improved type safety.
// An interface cannot extend a type alias. Changed to a type intersection.
type CubeProps = ThreeElements['mesh'] & {
  color: string;
  shouldRotate: boolean;
};

const Cube: React.FC<CubeProps> = ({ color, shouldRotate, ...props }) => {
  const ref = useRef<THREE.Mesh>(null!);
  const [targetRotation, setTargetRotation] = useState(new THREE.Euler(0, 0, 0));

  // Memoize random speeds for consistent animation
  const [rotationSpeed, movementSpeed] = useMemo(() => {
    const rotation = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      0 // no z rotation
    );
    const movement = (Math.random() * 0.6) + 0.2; // Random upward speed
    return [rotation, movement];
  }, []);

  useEffect(() => {
    if (shouldRotate) {
      setTargetRotation((prev) => new THREE.Euler(prev.x + Math.PI / 2, prev.y + Math.PI / 2, prev.z));
    }
  }, [shouldRotate]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += rotationSpeed.x * delta;
      ref.current.rotation.y += rotationSpeed.y * delta;

      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRotation.x, 0.1);
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotation.y, 0.1);

      ref.current.position.y += movementSpeed * delta;

      // Get viewport height to wrap around when cube is out of view
      const { viewport } = state;
      const threshold = 1; // buffer
      if (ref.current.position.y > viewport.height / 2 + threshold) {
        ref.current.position.y = -viewport.height / 2 - threshold;
      }
    }
  });

  return (
    <mesh ref={ref} {...props}>
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshBasicMaterial color={color} wireframe />
    </mesh>
  );
};

interface Background3DProps {
  theme: 'dark' | 'light';
  profession: string;
}

const Background3D: React.FC<Background3DProps> = ({ theme, profession }) => {
  const [shouldRotate, setShouldRotate] = useState(false);
  const prevProfessionLength = useRef(profession.length);

  useEffect(() => {
    if (profession.length > prevProfessionLength.current) {
      setShouldRotate(true);
    } else {
      setShouldRotate(false);
    }
    prevProfessionLength.current = profession.length;
    const timer = setTimeout(() => setShouldRotate(false), 100);
    return () => clearTimeout(timer);
  }, [profession]);

  // Colors chosen for subtlety to not distract from the main content
  const cubeColor = theme === 'dark' ? '#374151' : '#d1d5db';

  // Generate a set of random cube positions, memoized for performance
  const cubes = useMemo(() => {
    return Array.from({ length: 60 }).map(() => ({
      position: [
        (Math.random() - 0.5) * 25, // x spread
        (Math.random() - 0.5) * 25, // y spread
        (Math.random() - 0.5) * 15 - 5, // z spread
      ] as [number, number, number],
    }));
  }, []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        {cubes.map((cube, index) => (
          <Cube key={index} position={cube.position} color={cubeColor} shouldRotate={shouldRotate} />
        ))}
      </Canvas>
    </div>
  );
};

export default Background3D;