'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

/**
 * FinFloat 3D Model Component
 * Renders the FinFloat GLB model with automatic bounding box centering and normalization.
 */
export function FinFloatModel({ modelPath = '/assets/finfloat-model.glb' }) {
  const { scene } = useGLTF(modelPath);
  const modelRef = useRef();

  useEffect(() => {
    if (!scene) return;

    // Clone scene to avoid mutating cached original
    const clonedScene = scene.clone(true);

    // Compute bounding box and center
    const box = new THREE.Box3().setFromObject(clonedScene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // Re-center model at origin (0, 0, 0)
    clonedScene.position.sub(center);

    // Normalize scale so it fits comfortably within viewport
    const scale = 2.4 / maxDim;
    clonedScene.scale.setScalar(scale);

    // Enhance marine/aluminum material response
    clonedScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.roughness = 0.32;
        child.material.metalness = 0.68;
        child.castShadow = false;
        child.receiveShadow = false;
        child.material.needsUpdate = true;
      }
    });

    if (modelRef.current) {
      // Clear previous children and attach normalized model
      while (modelRef.current.children.length > 0) {
        modelRef.current.remove(modelRef.current.children[0]);
      }
      modelRef.current.add(clonedScene);
    }
  }, [scene]);

  return <group ref={modelRef} dispose={null} />;
}

// Preload the model asset for instant interactive performance
useGLTF.preload('/assets/finfloat-model.glb');

/**
 * FinFloat 360° Interactive Buoy Viewport
 * 
 * Features:
 * - 100% transparent canvas (blends seamlessly into section background)
 * - Continuous gentle ambient auto-rotation by default
 * - Ultra-smooth orbit drag controls: enableDamping=true, dampingFactor=0.05
 * - Constrained polar angles: minPolarAngle = Math.PI / 4, maxPolarAngle = Math.PI / 1.8 (prevents flipping upside down)
 * - Auto-resume: restarts ambient auto-rotation after a 2-second idle delay
 * - No outer card borders, frames, or dock buttons
 */
export default function FinFloatViewer({
  modelPath = '/assets/finfloat-model.glb',
  className = '',
  height = '520px',
}) {
  const controlsRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const idleTimeoutRef = useRef(null);

  const handleControlStart = () => {
    setIsInteracting(true);
  };

  const handleControlEnd = () => {
    setIsInteracting(false);
  };

  return (
    <div
      className={`relative w-full flex items-center justify-center bg-transparent overflow-visible ${className}`}
      style={{ height }}
    >
      {/* Subtle floor ambient brand-green reflection */}
      <div
        className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 w-[380px] h-[55px] rounded-full blur-2xl z-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 229, 153, 0.22) 0%, rgba(0, 229, 153, 0.03) 55%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      {/* 3D WebGL Canvas with High Performance and Capped DPR */}
      <Canvas
        className="relative z-10 w-full h-full bg-transparent cursor-grab active:cursor-grabbing"
        dpr={[1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1]}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        camera={{
          position: [0, 0.9, 3.6],
          fov: 40,
          near: 0.1,
          far: 100,
        }}
      >
        <Suspense fallback={null}>
          {/* Studio Lighting with Subtle Emerald Accent */}
          <ambientLight intensity={1.1} />
          <directionalLight position={[5, 8, 6]} intensity={1.8} />
          <directionalLight position={[-6, -2, -5]} intensity={0.9} color="#00e599" />
          <pointLight position={[0, 3, 2]} intensity={1.2} color="#00e599" />

          {/* Floating Subtle Ambient Bobbing & 3D Buoy Model */}
          <Float
            speed={1.4}
            rotationIntensity={0.15}
            floatIntensity={0.25}
            floatingRange={[-0.06, 0.06]}
          >
            <FinFloatModel modelPath={modelPath} />
          </Float>

          {/* Smooth Orbit Controls with Damping and Auto-Rotate Disabled */}
          <OrbitControls
            ref={controlsRef}
            enableDamping={true}
            dampingFactor={0.05}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.8}
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            onStart={handleControlStart}
            onEnd={handleControlEnd}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
