import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';

const GlobeDots = () => {
  const group = useRef();
  const meshRefs = useRef([]);
  const lineRef = useRef();

  meshRefs.current = [];

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Rotate globe
    if (group.current) {
      group.current.rotation.y = time * 0.5;
      group.current.rotation.x = Math.sin(time * 0.03);
    }

    // Animate dots
    meshRefs.current.forEach(({ ref, basePos, phase }) => {
      if (ref) {
        const scale = 1 + 0.12 * Math.sin(time * 2 + phase);
        const animatedPos = basePos.clone().multiplyScalar(scale);
        ref.position.set(animatedPos.x, animatedPos.y, animatedPos.z);
      }
    });

    // Update connecting lines
    if (lineRef.current) {
      const threshold = 2.0;
      const segments = [];

      for (let i = 0; i < meshRefs.current.length; i++) {
        const a = meshRefs.current[i].ref?.position;
        if (!a) continue;

        for (let j = i + 1; j < meshRefs.current.length; j++) {
          const b = meshRefs.current[j].ref?.position;
          if (!b) continue;

          if (a.distanceTo(b) < threshold) {
            segments.push(a.clone(), b.clone());
          }
        }
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(segments);
      lineRef.current.geometry.dispose();
      lineRef.current.geometry = geometry;
    }
  });

  // Generate base points
  const [points] = useState(() => {
    const radius = 4;
    const count = 180;
    const dots = [];

    for (let i = 0; i < count; i++) {
      const theta = Math.acos(1 - 2 * (i + 0.5) / count);
      const phi = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      const basePos = new THREE.Vector3(x, y, z);
      const phase = Math.random() * Math.PI * 2;
      dots.push({ basePos, phase });
    }

    return dots;
  });

  return (
    <group ref={group}>
      {/* Dots */}
      {points.map(({ basePos, phase }, idx) => (
        <mesh
          key={idx}
          ref={(el) => (meshRefs.current[idx] = { ref: el, basePos, phase })}
          position={basePos}
        >
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#1d4ed8"
            emissiveIntensity={0.25}
          />
        </mesh>
      ))}

      {/* Dynamic Lines */}
      <lineSegments ref={lineRef}>
        <lineBasicMaterial color="#3b82f6" opacity={0.25} transparent />
      </lineSegments>
    </group>
  );
};

const AuthImagePattern = () => {
  return (
    <div className="w-full h-[500px]">
      <Canvas camera={{ position: [0, 0, 14], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <GlobeDots />
      </Canvas>
    </div>
  );
};

export default AuthImagePattern;
