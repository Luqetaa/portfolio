import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "../../utils/themeContext.jsx";

/* Pixel-art star sprite — small crisp square with bright core */
function createStarTexture() {
  const size = 8; // small texture = blocky pixels when rendered
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // Solid bright core (2×2 center)
  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.fillRect(3, 3, 2, 2);

  // Cross arms (1px)
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.fillRect(3, 1, 2, 2); // top
  ctx.fillRect(3, 5, 2, 2); // bottom
  ctx.fillRect(1, 3, 2, 2); // left
  ctx.fillRect(5, 3, 2, 2); // right

  // Dim corner pixels
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fillRect(2, 2, 1, 1);
  ctx.fillRect(5, 2, 1, 1);
  ctx.fillRect(2, 5, 1, 1);
  ctx.fillRect(5, 5, 1, 1);

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter; // crisp upscale — no blur
  tex.minFilter = THREE.NearestFilter;
  return tex;
}

export default function ThreeDBackground() {
  const containerRef = useRef(null);
  const layersRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });   // normalised –1…+1
  const targetRef = useRef({ x: 0, y: 0 });   // smoothed target
  const { theme } = useTheme();

  /* Track mouse inside the hero section */
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;   // –1 … +1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1; // –1 … +1 (Y up)
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use container dimensions (which should be 100% of parent)
    const getSize = () => ({
      w: container.clientWidth || window.innerWidth,
      h: container.clientHeight || window.innerHeight,
    });

    const { w, h } = getSize();

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 2000);
    camera.position.z = 50;

    // Render at reduced resolution for pixelated look
    const PX_SCALE = 0.4; // 40% resolution — subtle pixel look without being too chunky
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
    });
    renderer.setSize(Math.floor(w * PX_SCALE), Math.floor(h * PX_SCALE));
    renderer.setPixelRatio(1); // no DPI scaling — keep it blocky
    renderer.setClearColor(0x000000, 0);

    // Stretch canvas to full size with crisp pixel upscale
    const cvs = renderer.domElement;
    cvs.style.width = "100%";
    cvs.style.height = "100%";
    cvs.style.imageRendering = "pixelated";
    container.appendChild(cvs);

    const parseHex = (hex) => parseInt(hex.replace("#", ""), 16);
    const starTexture = createStarTexture();

    // Three depth layers: far dim stars, mid stars, near bright stars
    const layers = [
      { count: 400, spread: 500, depth: 300, size: 1.5, opacity: 0.35, speed: 0.00005, parallax: 0.008 },
      { count: 200, spread: 350, depth: 200, size: 2.5, opacity: 0.55, speed: 0.00012, parallax: 0.020 },
      { count: 80,  spread: 200, depth: 120, size: 4.0, opacity: 0.85, speed: 0.00025, parallax: 0.045 },
    ];

    const disposables = [];
    const layerData = [];

    layers.forEach((cfg) => {
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(cfg.count * 3);
      const sizes = new Float32Array(cfg.count);

      for (let i = 0; i < cfg.count; i++) {
        positions[i * 3]     = (Math.random() - 0.5) * cfg.spread;
        positions[i * 3 + 1] = (Math.random() - 0.5) * cfg.spread;
        positions[i * 3 + 2] = (Math.random() - 0.5) * cfg.depth - 20;
        sizes[i] = cfg.size * (0.4 + Math.random() * 0.6);
      }

      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

      const mat = new THREE.PointsMaterial({
        map: starTexture,
        size: cfg.size,
        color: parseHex(theme.primary),
        sizeAttenuation: true,
        transparent: true,
        opacity: cfg.opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geo, mat);
      scene.add(points);
      disposables.push(geo, mat);
      layerData.push({ points, geo, mat, cfg, sizes });
    });

    layersRef.current = layerData;

    // Animation
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = Date.now() * 0.001;

      // Smooth mouse follow (lerp toward actual mouse pos)
      targetRef.current.x += (mouseRef.current.x - targetRef.current.x) * 0.05;
      targetRef.current.y += (mouseRef.current.y - targetRef.current.y) * 0.05;

      const mx = targetRef.current.x;
      const my = targetRef.current.y;

      layerData.forEach((layer) => {
        // Slow auto-rotation
        layer.points.rotation.y += layer.cfg.speed;
        layer.points.rotation.x += layer.cfg.speed * 0.3;

        // Mouse-driven parallax: translate each layer differently based on depth
        const p = layer.cfg.parallax;
        layer.points.position.x = mx * p * 100;
        layer.points.position.y = my * p * 100;

        // Subtle mouse-driven tilt
        layer.points.rotation.y += mx * layer.cfg.speed * 2;
        layer.points.rotation.x += my * layer.cfg.speed * 2;

        // Twinkle: modulate opacity
        const baseOpacity = layer.cfg.opacity;
        const twinkleAmount = baseOpacity * 0.35;
        layer.mat.opacity = baseOpacity + Math.sin(t * 0.7) * twinkleAmount * 0.3;
      });

      // Camera slight tilt for extra 3D feel
      camera.position.x = mx * 3;
      camera.position.y = my * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      const { w, h } = getSize();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(Math.floor(w * PX_SCALE), Math.floor(h * PX_SCALE));
      cvs.style.width = "100%";
      cvs.style.height = "100%";
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starTexture.dispose();
      disposables.forEach((d) => d.dispose());
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        filter: "blur(5px)",
      }}
    />
  );
}
