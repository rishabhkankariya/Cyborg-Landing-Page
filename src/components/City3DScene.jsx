import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export default function City3DScene({ scrollPercent, onProgress }) {
  const containerRef = useRef(null);
  const scrollPercentRef = useRef(scrollPercent);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Sync scroll percent to ref to avoid re-triggering useEffect
  useEffect(() => {
    scrollPercentRef.current = scrollPercent;
  }, [scrollPercent]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer, Fog
    const scene = new THREE.Scene();
    const clearColor = 0x0a0f1e; // Deep midnight navy
    scene.fog = new THREE.FogExp2(clearColor, 0.006);

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Camera is initially positioned behind and slightly above the truck
    camera.position.set(0, 3.5, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(clearColor, 1);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 2. Lights — cinematic dark setup
    const ambientLight = new THREE.AmbientLight(0x1a3060, 2.5); // Deep blue ambient
    scene.add(ambientLight);

    // Main key light (cool blue-white from top)
    const dirLight1 = new THREE.DirectionalLight(0x7dd3fc, 4.0);
    dirLight1.position.set(8, 20, 10);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    // Rim light (violet from behind)
    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 2.5);
    dirLight2.position.set(-10, 12, -15);
    scene.add(dirLight2);

    // Headlight spotlights on the truck
    const frontLight = new THREE.SpotLight(0x22d3ee, 8, 40, Math.PI / 6, 0.5, 1);
    frontLight.position.set(0, 1.2, -3);
    frontLight.target.position.set(0, 0, -25);
    scene.add(frontLight);
    scene.add(frontLight.target);

    // Ground bounce fill
    const fillLight = new THREE.PointLight(0x3b82f6, 2.5, 18);
    fillLight.position.set(0, 0.5, 0);
    scene.add(fillLight);

    // 3. Ground / Reflective Cyber Road
    const roadWidth = 20;
    const roadLength = 1000;
    const roadGeo = new THREE.PlaneGeometry(roadWidth, roadLength);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x0d1628, // Dark navy asphalt
      roughness: 0.6,
      metalness: 0.2,
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, -0.01, 0);
    scene.add(road);

    // Road Grid Helpers
    const gridHelper = new THREE.GridHelper(1000, 100, 0x22d3ee, 0x1a3060);
    gridHelper.position.y = 0;
    gridHelper.material.opacity = 0.25;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Reflective glowing borders
    const borderGeo = new THREE.BoxGeometry(0.1, 0.05, roadLength);
    const borderMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
    
    const borderLeft = new THREE.Mesh(borderGeo, borderMat);
    borderLeft.position.set(-roadWidth / 2, 0.025, 0);
    scene.add(borderLeft);

    const borderRight = new THREE.Mesh(borderGeo, borderMat);
    borderRight.position.set(roadWidth / 2, 0.025, 0);
    scene.add(borderRight);

    // 4. Scrolling Road Dashes (Divider Lines)
    const dashCount = 30;
    const dashGroup = new THREE.Group();
    const dashes = [];
    const dashSpacing = 35;

    const dashGeo = new THREE.BoxGeometry(0.15, 0.02, 5);
    const dashMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee });
    for (let i = 0; i < dashCount; i++) {
      const dash = new THREE.Mesh(dashGeo, dashMat);
      
      const zPos = -(i * dashSpacing);
      dash.position.set(0, 0.03, zPos);
      dashGroup.add(dash);
      dashes.push(dash);
    }
    scene.add(dashGroup);

    // 5. Infinite Parallax Wireframe Buildings
    const buildingsGroup = new THREE.Group();
    const buildings = [];
    const buildingCount = 40;

    for (let i = 0; i < buildingCount; i++) {
      const bWidth = Math.random() * 10 + 6;
      const bHeight = Math.random() * 80 + 20;
      const bDepth = Math.random() * 10 + 6;
      
      const geometry = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
      const edges = new THREE.EdgesGeometry(geometry);
      geometry.dispose();
      
      const colors = [0x22d3ee, 0xa855f7, 0xf43f7e, 0x3b82f6]; // Electric teal, violet, magenta, blue
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      const lineMat = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: Math.random() * 0.3 + 0.12,
      });
      const wireframe = new THREE.LineSegments(edges, lineMat);

      // Distribute along the sides of the road
      const side = Math.random() > 0.5 ? 1 : -1;
      const posX = side * (Math.random() * 30 + 16);
      const posZ = -(i * 22) - 10;
      
      wireframe.position.set(posX, bHeight / 2, posZ);
      buildingsGroup.add(wireframe);
      buildings.push({
        mesh: wireframe,
        baseX: posX,
        height: bHeight,
        speedFactor: Math.random() * 0.2 + 0.9,
      });
    }
    scene.add(buildingsGroup);

    // 6. Flying Security Drones (glowing points with light beams)
    const drones = [];
    const droneCount = 4;
    for (let i = 0; i < droneCount; i++) {
      const droneGroup = new THREE.Group();
      const bodyGeo = new THREE.BoxGeometry(0.5, 0.2, 0.5);
      const droneColor = i % 2 === 0 ? 0xa855f7 : 0x22d3ee; // Violet or electric teal
      const bodyMat = new THREE.MeshBasicMaterial({ color: droneColor });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      droneGroup.add(body);

      // Search light
      const searchLight = new THREE.SpotLight(droneColor, 10, 25, Math.PI / 8, 0.6, 1);
      searchLight.position.set(0, 0, 0);
      searchLight.target.position.set(0, -15, -5);
      droneGroup.add(searchLight);
      droneGroup.add(searchLight.target);

      droneGroup.position.set((Math.random() - 0.5) * 20, Math.random() * 10 + 5, -Math.random() * 100);
      scene.add(droneGroup);
      drones.push({
        group: droneGroup,
        light: searchLight,
        speed: Math.random() * 0.02 + 0.01,
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 5 + 3,
      });
    }

    // 7. Security Laser Grids (Security District 4)
    const lasersGroup = new THREE.Group();
    const lasers = [];
    const laserCount = 6;
    for (let i = 0; i < laserCount; i++) {
      const laserGeo = new THREE.CylinderGeometry(0.03, 0.03, 30, 8);
      const laserMat = new THREE.MeshBasicMaterial({
        color: 0xef4444, // Red alert laser
        transparent: true,
        opacity: 0,
      });
      const laser = new THREE.Mesh(laserGeo, laserMat);
      laser.rotation.z = Math.PI / 2;
      laser.position.set(0, Math.random() * 4 + 1, -Math.random() * 60 - 20);
      lasersGroup.add(laser);
      lasers.push(laser);
    }
    scene.add(lasersGroup);

    // 8. Load Cybertruck OBJ Model
    let truckModel = null;
    const wheels = [];

    const loader = new OBJLoader();
    loader.load(
      '/Tesla_Cybertruck.obj',
      (obj) => {
        truckModel = obj;
        
        // Compute bounding box
        const box = new THREE.Box3().setFromObject(truckModel);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const size = new THREE.Vector3();
        box.getSize(size);
        
        console.log('Cybertruck original bounding box size:', size, 'center:', center);

        // Center the model's children around the parent group's origin (0,0,0)
        truckModel.children.forEach((child) => {
          child.position.sub(center);
        });

        // Auto-scale to fit the road (we want the truck width to be around 1.8 units)
        const targetWidth = 1.8;
        const scaleFactor = targetWidth / (size.x || 1);
        truckModel.scale.set(scaleFactor, scaleFactor, scaleFactor);
        
        // Position it so the bottom of the tires rests on the road (Y = 0) and offset in Z
        const posY = (size.y / 2) * scaleFactor;
        truckModel.position.set(0, posY, -2.5);
        truckModel.rotation.y = Math.PI; // Face forward down -Z

        // Dramatic Cybertruck materials — visible on dark scene
        const bodyMat = new THREE.MeshStandardMaterial({
          color: 0xe8eef5, // Bright platinum silver
          metalness: 0.92,
          roughness: 0.12,
          emissive: 0x22d3ee, // Electric teal glow
          emissiveIntensity: 0.15,
        });

        const wheelMat = new THREE.MeshStandardMaterial({
          color: 0x1e2a3a, // Deep dark gunmetal
          metalness: 0.6,
          roughness: 0.45,
          emissive: 0xa855f7, // Violet hub glow
          emissiveIntensity: 0.2,
        });

        const glassMat = new THREE.MeshStandardMaterial({
          color: 0x4a8fb5, // Dark tinted blue glass
          metalness: 0.98,
          roughness: 0.04,
          transparent: true,
          opacity: 0.55,
          emissive: 0x22d3ee, // Teal glow
          emissiveIntensity: 0.25,
        });

        truckModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            if (Array.isArray(child.material)) {
              // Map materials in the material array based on their names
              child.material = child.material.map((mat) => {
                const matName = mat.name;
                if (matName === 'blinn3SG') {
                  // Wheels / Tires
                  return wheelMat;
                } else if (matName === 'phong3SG' || matName === 'phong4SG') {
                  // Glass / Windows
                  return glassMat;
                } else {
                  // Steel Body Panels
                  return bodyMat;
                }
              });
            } else {
              // Fallback for single material mesh
              const name = (child.name || '').toLowerCase();
              const matName = (child.material && child.material.name || '').toLowerCase();
              if (
                name.includes('wheel') || name.includes('tire') || name.includes('rim') || name.includes('tyre') ||
                matName.includes('wheel') || matName.includes('tire') || matName.includes('rim') || matName.includes('tyre') ||
                matName === 'blinn3sg'
              ) {
                child.material = wheelMat;
              } else if (
                name.includes('glass') || name.includes('windshield') || name.includes('window') ||
                matName.includes('glass') || matName.includes('windshield') || matName.includes('window') ||
                matName === 'phong3sg' || matName === 'phong4sg'
              ) {
                child.material = glassMat;
              } else {
                child.material = bodyMat;
              }
            }
          }
        });

        scene.add(truckModel);
        
        if (onProgress) {
          onProgress(100);
        }
      },
      (xhr) => {
        if (onProgress) {
          const total = xhr.total || 10937178; // Fallback to Cybertruck OBJ file size if Content-Length is missing
          const percent = (xhr.loaded / total) * 100;
          onProgress(Math.min(99, Math.round(percent)));
        }
      },
      (err) => {
        console.error('Failed to load Cybertruck model:', err);
        if (onProgress) {
          onProgress(100); // Prevent loader hang if the asset fails to load
        }
      }
    );

    // 9. Input events
    const handleMouseMove = (e) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // 10. Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Current scroll calculations
      const scroll = scrollPercentRef.current / 100;
      
      // Determine active district for dynamic lighting and cameras
      // Districts are mapped across scroll progress:
      // District 1 (Boot): 0 - 0.12
      // District 2 (Code): 0.12 - 0.25
      // District 3 (AI): 0.25 - 0.37
      // District 4 (Security): 0.37 - 0.50
      // District 5 (Graphics): 0.50 - 0.62
      // District 6 (Robotics): 0.62 - 0.75
      // District 7 (Quantum): 0.75 - 0.87
      // District 8 (Future): 0.87 - 1.00

      // Dynamic color adjustment per district
      let targetFogColor = new THREE.Color(0x0a0f1e);
      let targetAmbient = new THREE.Color(0x1a3060);
      let targetSpotColor = new THREE.Color(0x22d3ee);
      
      if (scroll < 0.12) {
        targetFogColor.setHex(0x0a0f1e); // Boot — deep navy
        targetAmbient.setHex(0x1a3060);
        lasers.forEach(l => l.material.opacity = 0);
      } else if (scroll < 0.25) {
        targetFogColor.setHex(0x050d1a); // Code — midnight blue
        targetAmbient.setHex(0x0f2040);
      } else if (scroll < 0.37) {
        targetFogColor.setHex(0x100a22); // AI — deep violet
        targetAmbient.setHex(0x1a1040);
      } else if (scroll < 0.50) {
        targetFogColor.setHex(0x1a0808); // Security — deep crimson
        targetAmbient.setHex(0x2a0f0f);
        targetSpotColor.setHex(0xef4444);
        lasers.forEach((l, idx) => {
          l.material.opacity = 0.6 + Math.sin(time * 8 + idx) * 0.3;
          l.position.x = Math.sin(time * 1.5 + idx) * 12;
        });
      } else if (scroll < 0.62) {
        targetFogColor.setHex(0x0a1208); // Graphics — deep forest
        targetAmbient.setHex(0x112210);
        targetSpotColor.setHex(0x22c55e);
        lasers.forEach(l => l.material.opacity = 0);
      } else if (scroll < 0.75) {
        targetFogColor.setHex(0x150f00); // Robotics — deep amber
        targetAmbient.setHex(0x251a00);
        targetSpotColor.setHex(0xf59e0b);
      } else if (scroll < 0.87) {
        targetFogColor.setHex(0x041510); // Quantum — deep teal
        targetAmbient.setHex(0x082520);
        targetSpotColor.setHex(0x10b981);
      } else {
        targetFogColor.setHex(0x020a18); // Future — darkest blue
        targetAmbient.setHex(0x051525);
        targetSpotColor.setHex(0x22d3ee);
      }

      // Smooth color transitions
      scene.fog.color.lerp(targetFogColor, 0.05);
      renderer.setClearColor(scene.fog.color);
      ambientLight.color.lerp(targetAmbient, 0.05);
      frontLight.color.lerp(targetSpotColor, 0.05);
      fillLight.color.lerp(targetSpotColor, 0.03);

      // 11. Dynamic Camera Movement synced to scroll
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      if (scroll < 0.87) {
        // standard driving perspective
        camera.position.x = mouseRef.current.x * 2.5;
        camera.position.y = 3.2 + mouseRef.current.y * 1.2;
        camera.position.z = 8.5;
        camera.lookAt(0, 1.2, -6);
      } else {
        // Elevated panoramic viewpoint of the city (District 8)
        const progressInLastSector = (scroll - 0.87) / 0.13; // 0 to 1
        camera.position.x = mouseRef.current.x * 6 + progressInLastSector * 8;
        camera.position.y = 3.2 + progressInLastSector * 12 + mouseRef.current.y * 3;
        camera.position.z = 8.5 + progressInLastSector * 6;
        camera.lookAt(0, 2, -15);
      }

      // 12. Simulate Infinite Driving Mechanics
      // Dash segments moving backwards
      const speedMultiplier = scroll > 0.02 ? 150 : 25; // Speed up when driving
      dashes.forEach((dash) => {
        dash.position.z += speedMultiplier * delta;
        // Reset dash if it passes behind the camera viewport
        if (dash.position.z > 15) {
          dash.position.z = -((dashCount - 1) * dashSpacing) + 10;
        }
      });

      // Buildings parallax moving backwards
      buildings.forEach((b) => {
        b.mesh.position.z += speedMultiplier * b.speedFactor * delta;
        if (b.mesh.position.z > 25) {
          b.mesh.position.z = -((buildingCount - 1) * 22) - 10;
          b.mesh.scale.y = Math.random() * 0.5 + 0.85; // slightly mutate height
        }
      });

      // 13. Spin Cybertruck wheels based on scroll rate and time
      if (wheels.length > 0) {
        const wheelRotSpeed = speedMultiplier * 0.05;
        wheels.forEach((w) => {
          // Rotate around wheel local hub axis (x-axis in standard orientations)
          w.rotation.x -= wheelRotSpeed * delta;
        });
      }

      // Subtly vibrate the Cybertruck body mesh to simulate engine rumbling
      if (truckModel) {
        truckModel.position.y = 0.42 + Math.sin(time * 45) * 0.006;
      }

      // Animate drone flight patterns
      drones.forEach((d) => {
        d.angle += d.speed;
        d.group.position.x += Math.cos(d.angle) * 0.1;
        d.group.position.z += Math.sin(d.angle) * 0.15;
      });

      renderer.render(scene, camera);
    };

    animate();

    // 14. Cleanup variables
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      // Dispose components
      road.geometry.dispose();
      road.material.dispose();
      borderGeo.dispose();
      borderMat.dispose();
      gridHelper.geometry.dispose();
      gridHelper.material.dispose();

      dashGeo.dispose();
      dashMat.dispose();

      buildings.forEach((b) => {
        b.mesh.geometry.dispose();
        b.mesh.material.dispose();
      });

      lasers.forEach((l) => {
        l.geometry.dispose();
        l.material.dispose();
      });

      drones.forEach((d) => {
        d.group.children.forEach((c) => {
          if (c.geometry) c.geometry.dispose();
          if (c.material) c.material.dispose();
        });
      });

      if (truckModel) {
        truckModel.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();
            child.material.dispose();
          }
        });
      }

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // Trigger rebuild on tab changes if any

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#0a0f1e]"
    />
  );
}
