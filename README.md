# 🌍 astro3d-core

**Create realistic 3D spheres of celestial bodies — the minimalist way.**

This lightweight package lets you easily generate customizable 3D mesh spheres with high-quality textures for use in any `three.js` scene. Whether you're building a planetarium, educational visualization, or just want a cool spinning planet on your homepage — astro3d-core provides the essential building blocks without unnecessary complexity.

---

## 🚀 Features

- Minimalist API for textured 3D celestial bodies
- Fully customizable geometry and material parameters
- Support for overlay layers (clouds, atmospheres, etc.)
- Multiple overlay support with customizable opacity and scale
- Designed for use with **Three.js**

---

## 📦 Installation

```bash
npm install astro3d-core
# or
yarn add astro3d-core
```

---

## 🔧 Usage

### Creating a Basic Celestial Body

```js
import * as THREE from "three";
import { createCelestialBody } from "astro3d-core";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load your textures
const colorMapURL = "path/to/earth-texture.jpg";
const normalMapURL = "path/to/earth-normal-map.jpg";

const earth = createCelestialBody({
  radius: 3,
  colorMapURL: colorMapURL,
  normalMapURL: normalMapURL,
  roughness: 0.4,
  metalness: 0.001,
});

scene.add(earth);
camera.position.z = 10;

function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.005;
  renderer.render(scene, camera);
}

animate();
```

### Creating a Planet with Clouds

```js
import * as THREE from "three";
import { createCelestialBody } from "astro3d-core";

// Standard Three.js setup
// ...

// Create Earth with cloud layer
const earth = createCelestialBody({
  radius: 3,
  colorMapURL: "path/to/earth-texture.jpg",
  normalMapURL: "path/to/earth-normal-map.jpg",
  overlayMapURL: "path/to/clouds-texture.png",
  overlayRadiusScale: 1.01, // Slightly larger than the planet
  overlayOpacity: 0.6,
  roughness: 0.4,
  metalness: 0.001,
  reflectivity: 0.1,
});

scene.add(earth);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.001;
  // Cloud layer rotates with the planet as it's part of the same group
  renderer.render(scene, camera);
}

animate();
```

### Creating a Planet with Multiple Layers

```js
import * as THREE from "three";
import { createCelestialBody } from "astro3d-core";

// Create Jupiter with multiple cloud layers
const jupiter = createCelestialBody({
  radius: 5,
  colorMapURL: "path/to/jupiter-texture.jpg",
  overlayMapURL: ["path/to/jupiter-clouds-1.png", "path/to/jupiter-clouds-2.png", "path/to/jupiter-atmosphere.png"],
  overlayRadiusScale: [1.001, 1.005, 1.01], // Different scales for each layer
  overlayOpacity: [0.4, 0.3, 0.2], // Different opacities
  roughness: 0.6,
  metalness: 0.0,
});

scene.add(jupiter);

// Animation
function animate() {
  requestAnimationFrame(animate);
  jupiter.rotation.y += 0.002;
  renderer.render(scene, camera);
}

animate();
```

---

## 🛠️ Parameters

### Celestial Body Parameters

Here's the full list of options you can pass to `createCelestialBody`:

| Parameter            | Type            | Default                     | Description                             |
| -------------------- | --------------- | --------------------------- | --------------------------------------- |
| `radius`             | `number`        | `3`                         | Radius of the sphere                    |
| `widthSegments`      | `number`        | `64`                        | Number of horizontal segments           |
| `heightSegments`     | `number`        | `64`                        | Number of vertical segments             |
| `colorMapURL`        | `string`        | -                           | Path to the diffuse texture (color)     |
| `normalMapURL`       | `string`        | -                           | Path to the normal map                  |
| `overlayMapURL`      | `string\|Array` | -                           | Path(s) to overlay texture(s)           |
| `overlayRadiusScale` | `number\|Array` | `1.001`                     | Scale factor(s) for overlay(s)          |
| `overlayOpacity`     | `number\|Array` | `0.6`                       | Opacity value(s) for overlay(s)         |
| `oblateness`         | `number`        | `0`                         | Flattening of the sphere (0-1)          |
| `roughness`          | `number`        | `0.8`                       | How rough the surface appears           |
| `metalness`          | `number`        | `0.0`                       | How metallic the surface appears        |
| `reflectivity`       | `number`        | `0.0`                       | Reflectiveness of the material          |
| `clearcoat`          | `number`        | `0.0`                       | Clearcoat layer for extra gloss         |
| `aoMapIntensity`     | `number`        | `0.8`                       | Intensity of ambient occlusion          |
| `lightMapIntensity`  | `number`        | `1.0`                       | Intensity of baked lighting             |
| `envMapIntensity`    | `number`        | `0.05`                      | Strength of environment reflection      |
| `bumpScale`          | `number`        | `0.2`                       | Scale of bump mapping                   |
| `normalScale`        | `number`        | `1.2`                       | Intensity of normal mapping             |
| `flatShading`        | `boolean`       | `false`                     | Enable flat shading                     |
| `transparent`        | `boolean`       | `false`                     | Enable transparency                     |
| `side`               | `THREE.Side`    | `THREE.FrontSide`           | Which side(s) of the material to render |
| `color`              | `THREE.Color`   | `new THREE.Color(0xFFFFFF)` | Base material color                     |
| `initialRotation`    | `number`        | `-Math.PI / 2`              | Initial Y rotation of the sphere        |

---

## 🔍 Advanced Features

### Multiple Overlay Support

The `overlayMapURL` parameter can accept either a string or an array of strings to create multiple overlays:

```js
const planet = createCelestialBody({
  // Basic parameters...
  overlayMapURL: ["path/to/layer1.png", "path/to/layer2.png", "path/to/layer3.png"],
  overlayRadiusScale: [1.001, 1.005, 1.01], // Different radius for each layer
  overlayOpacity: [0.7, 0.5, 0.3], // Different opacity for each layer
});
```

### Oblate Spheroid Support

For more realistic gas giants or rapidly rotating planets:

```js
const jupiter = createCelestialBody({
  // Basic parameters...
  oblateness: 0.06478, // Jupiter's actual oblateness
});
```

---

## 🖼️ Textures

This package does not include textures. You'll need to provide URLs to your own texture maps.

Good sources for planetary textures include:

- [NASA Visible Earth](https://visibleearth.nasa.gov/)
- [Solar System Scope](https://www.solarsystemscope.com/textures/)
- [Planetary Pixel Emporium](http://planetpixelemporium.com/planets.html)

---

## 🚀 Example

### Earth with Clouds and Atmospheric Glow

```js
import * as THREE from "three";
import { createCelestialBody } from "astro3d-core";

// Standard Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0x404040);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 3, 5);
scene.add(ambientLight);
scene.add(directionalLight);

// Create Earth with clouds and atmosphere
const earth = createCelestialBody({
  radius: 3,
  widthSegments: 64,
  heightSegments: 64,
  colorMapURL: "path/to/earth-texture.jpg",
  normalMapURL: "path/to/earth-normal-map.jpg",
  overlayMapURL: ["path/to/clouds.png", "path/to/atmosphere-glow.png"],
  overlayRadiusScale: [1.01, 1.03],
  overlayOpacity: [0.6, 0.2],
  roughness: 0.4,
  metalness: 0.001,
  reflectivity: 0.1,
  oblateness: 0.0034, // Earth's actual oblateness
});

scene.add(earth);

// Set camera position
camera.position.z = 10;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  earth.rotation.y += 0.001;
  renderer.render(scene, camera);
}

animate();
```

---

## 💫 Final Thoughts

astro3d-core is a lightweight library focused on providing the essential building blocks for creating realistic celestial bodies in your Three.js scenes. By keeping the API minimal, we give you the flexibility to build exactly what you need without the overhead.

If you find this package helpful, consider giving it a star 🌟 or contributing with a pull request.
