import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { RankedAsset } from "@/types";

interface OrbitalViewProps {
  assets: RankedAsset[];
  onAssetClick?: (asset: RankedAsset) => void;
}

// Crypto color mapping
const CRYPTO_COLORS: Record<string, string> = {
  BTC: "#F7931A",
  ETH: "#627EEA",
  SOL: "#00FFA3",
  AVAX: "#E84142",
  LINK: "#375BD2",
  AAVE: "#B6509E",
  UNI: "#FF007A",
  ARB: "#28A0F0",
  OP: "#FF0420",
  MATIC: "#8247E5",
};

// Individual planet/asset component
function AssetPlanet({
  asset,
  index,
  onClick,
}: {
  asset: RankedAsset;
  index: number;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Calculate orbital position
  const orbitRadius = 2 + index * 0.5;
  const speed = 0.2 / (index + 1);
  const size = 0.3 - index * 0.02;

  // Get color for asset
  const color = CRYPTO_COLORS[asset.symbol] || "#00FFD1";

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();

    // Orbital motion
    meshRef.current.position.x = Math.cos(time * speed + index) * orbitRadius;
    meshRef.current.position.z = Math.sin(time * speed + index) * orbitRadius;
    meshRef.current.position.y = Math.sin(time * speed * 0.5) * 0.3;

    // Rotation
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <group>
        {/* Planet */}
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.3 : 1}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.5 : 0.2}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Glow effect */}
        <mesh ref={meshRef} scale={hovered ? 1.6 : 1.3}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={hovered ? 0.3 : 0.1}
          />
        </mesh>

        {/* Label */}
        {hovered && (
          <Text
            position={[0, size + 0.3, 0]}
            fontSize={0.15}
            color="white"
            anchorX="center"
            anchorY="bottom"
          >
            {asset.symbol}
          </Text>
        )}
      </group>
    </Float>
  );
}

// Orbital ring
function OrbitalRing({ radius, opacity = 0.1 }: { radius: number; opacity?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.01, radius + 0.01, 64]} />
      <meshBasicMaterial color="#00FFD1" transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Center sun
function CenterSun() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.002;
  });

  return (
    <group>
      {/* Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFD700"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Glow layers */}
      <mesh scale={1.2}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.3} />
      </mesh>
      <mesh scale={1.5}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#FFA500" transparent opacity={0.1} />
      </mesh>

      {/* Point light */}
      <pointLight color="#FFD700" intensity={2} distance={10} />
    </group>
  );
}

// Main scene
function OrbitalScene({ assets, onAssetClick }: OrbitalViewProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      {/* Center */}
      <CenterSun />

      {/* Orbital rings */}
      {assets.map((_, index) => (
        <OrbitalRing key={index} radius={2 + index * 0.5} opacity={0.05 + index * 0.01} />
      ))}

      {/* Planets */}
      {assets.map((asset, index) => (
        <AssetPlanet
          key={asset.id}
          asset={asset}
          index={index}
          onClick={() => onAssetClick?.(asset)}
        />
      ))}

      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Main export component
export function OrbitalView({ assets, onAssetClick }: OrbitalViewProps) {
  const navigate = useNavigate();

  const handleAssetClick = (asset: RankedAsset) => {
    if (onAssetClick) {
      onAssetClick(asset);
    } else {
      navigate(`/asset/${asset.slug}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-border-default bg-bg-secondary"
    >
      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 p-3 rounded-xl bg-bg-primary/80 backdrop-blur-sm border border-border-default">
        <h3 className="text-sm font-medium text-text-primary mb-2">Orbital Rankings</h3>
        <p className="text-xs text-text-muted">
          Closer to center = Higher rank
        </p>
        <p className="text-xs text-text-muted mt-1">
          Click and drag to rotate
        </p>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 5, 8], fov: 50 }}>
        <OrbitalScene assets={assets} onAssetClick={handleAssetClick} />
      </Canvas>

      {/* Asset legend */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="flex flex-wrap gap-2 justify-center">
          {assets.slice(0, 5).map((asset) => (
            <div
              key={asset.id}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-bg-primary/80 backdrop-blur-sm border border-border-default"
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: CRYPTO_COLORS[asset.symbol] || "#00FFD1" }}
              />
              <span className="text-xs text-text-muted">{asset.symbol}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
