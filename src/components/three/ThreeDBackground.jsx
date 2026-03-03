import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "../../utils/themeContext.jsx";

export default function ThreeDBackground() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const particlesRef = useRef([]);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      precision: "lowp"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    containerRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Parse theme colors
    const parseColor = (hex) => {
      const h = hex.replace("#", "");
      return parseInt(h, 16);
    };

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 100;
      posArray[i + 1] = (Math.random() - 0.5) * 100;
      posArray[i + 2] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.5,
      color: parseColor(theme.primary),
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.3,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = {
      mesh: particles,
      geometry: particlesGeometry,
      originalPositions: posArray.slice(),
    };

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (particlesRef.current.mesh) {
        particlesRef.current.mesh.rotation.x += 0.0002;
        particlesRef.current.mesh.rotation.y += 0.0003;

        // Wave effect
        const positionAttribute = particlesRef.current.geometry.getAttribute("position");
        const positions = positionAttribute.array;
        const time = Date.now() * 0.0001;

        for (let i = 0; i < positions.length; i += 3) {
          positions[i] += Math.sin(time + i) * 0.05;
          positions[i + 1] += Math.cos(time + i * 0.5) * 0.05;
        }
        positionAttribute.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-screen pointer-events-none -z-10"
    />
  );
}
