import React, { useRef, useLayoutEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Torus,
  Sphere,
  Icosahedron,
  MeshWobbleMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COLORS } from "../constants";

const Group = "group" as any;
const Mesh = "mesh" as any;
const MeshStandardMaterial = "meshStandardMaterial" as any;
const SphereGeometry = "sphereGeometry" as any;
const TorusGeometry = "torusGeometry" as any;
const PlaneGeometry = "planeGeometry" as any;
const BoxGeometry = "boxGeometry" as any;

const Experience: React.FC = () => {
  const { camera } = useThree();
  const elementsRef = useRef<THREE.Group>(null);
  const heartRef = useRef<THREE.Mesh>(null);
  const gemRef = useRef<THREE.Mesh>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      tl.to(camera.position, { y: -10, z: 12, ease: "none" }, 0.5)
        .to(camera.position, { y: -25, x: 2, z: 10, ease: "none" }, 1.5)
        .to(camera.position, { y: -45, x: -3, z: 15, ease: "none" }, 2.5)
        .to(camera.position, { y: -65, x: 0, z: 12, ease: "none" }, 3.5)
        .to(camera.position, { y: -85, x: 0, z: 8, ease: "none" }, 4.5);
    });

    return () => ctx.revert();
  }, [camera]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (heartRef.current) {
      heartRef.current.position.y = -25 + Math.sin(time) * 0.5;
      heartRef.current.rotation.z = Math.sin(time * 0.5) * 0.2;
    }
    if (gemRef.current) {
      gemRef.current.position.y = -25 + Math.cos(time * 0.7) * 0.4;
      gemRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Group>
      {/* SECTION 2: ABOUT ME FLOATING EMOJIS */}
      <Group ref={elementsRef}>
        <Icosahedron ref={heartRef} args={[1, 1]} position={[-5, -25, 0]}>
          <MeshWobbleMaterial color="#ff4d4d" speed={2} factor={0.6} />
        </Icosahedron>

        <Icosahedron ref={gemRef} args={[0.8, 0]} position={[5, -25, 2]}>
          <MeshStandardMaterial color="#4db8ff" wireframe />
        </Icosahedron>

        <Group position={[0, -28, -2]}>
          <Torus args={[1.5, 0.4, 8, 5]}>
            <MeshStandardMaterial color="#d966ff" />
          </Torus>
          <Sphere args={[0.5, 32, 32]}>
            <MeshStandardMaterial color="#ffff66" />
          </Sphere>
        </Group>
      </Group>

      {/* Background Ambience */}
      <Mesh position={[0, -45, -10]}>
        <PlaneGeometry args={[50, 150]} />
        <MeshStandardMaterial color="#000000" />
      </Mesh>
    </Group>
  );
};

export default Experience;
