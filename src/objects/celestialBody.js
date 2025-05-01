import * as THREE from 'three';

/**
 * Returns an Earth-like sphere mesh with customizable options
 * @param {Object} options
 * @param {number} options.radius - Sphere radius (default: 3)
 * @param {number} options.widthSegments - Sphere width segments (default: 256)
 * @param {number} options.heightSegments - Sphere height segments (default: 256)
 * @param {string} options.colorMapURL - Path to color map image (default: colorMap)
 * @param {string} options.normalMapURL - Path to normal map image (default: normalMap)
 * @param {Array | string} options.overlayMapURL - Path to clouds map image (default: cloudsMap)
 * @param {Array | number} options.overlayRadiusScale - Radius of overlay maps, can be an array of values or a single value (default: 1.001)
 * @param {Array | number} options.overlayOpacity - Opacity of overlay maps, can be an array of values or a single value (default: 0.6)
 * @param {number} options.oblateness - Degree of oblateness (default: 0.0034)
 * @param {number} options.roughness - Material roughness (default: 0.4)
 * @param {number} options.metalness - Material metalness (default:  0.001)
 * @param {number} options.reflectivity - Material reflectivity (default: 0.1)
 * @param {number} options.clearcoat - Material clearcoat (default: 0.15)
 * @param {number} options.aoMapIntensity - Ambient occlusion map intensity (default: 0.8)
 * @param {number} options.lightMapIntensity - Light map intensity (default: 1.0)
 * @param {number} options.envMapIntensity - Environment map intensity (default: 0.3)
 * @param {number} options.bumpScale - Bump scale (default: 0.2)
 * @param {number} options.normalScale - Normal scale (default: 1.2)
 * @param {number} options.flatShading - Flat shading (default: false)
 * @param {number} options.transparent - Transparency (default: false)
 * @param {number} options.side - Material side (default: THREE.FrontSide)
 * @param {THREE.Color} options.color - Base color (default: new THREE.Color(0xffffff))
 * @param {number} options.initialRotation - Initial rotation of the sphere (default: -1 * Math.PI / 2)
 * @returns {THREE.Group} - Group containing Earth mesh and optional cloud layer
 */
function createCelestialBody({
    radius = 3,
    widthSegments = 64,
    heightSegments = 64,
    colorMapURL,
    normalMapURL,
    overlayMapURL,
    overlayRadiusScale = 1.001,
    overlayOpacity = 0.6,
    oblateness = 0,
    roughness = 0.8,
    metalness = 0.0,
    reflectivity = 0.0,
    clearcoat = 0.0,
    aoMapIntensity = 0.8,
    lightMapIntensity = 1.0,
    envMapIntensity = 0.05,
    bumpScale = 0.2,
    normalScale = 1.2,
    flatShading = false,
    transparent = false,
    side = THREE.FrontSide,
    color = new THREE.Color(0xffffff), // White base color to not tint the texture
    initialRotation = -1 * Math.PI / 2,

} = {}) {

    try {
        // Create a group to hold Earth and clouds
        const celestialGroup = new THREE.Group();

        // Load textures
        const colorTexture = new THREE.TextureLoader().load(colorMapURL);

        colorTexture.mapping = THREE.EquirectangularReflectionMapping;


        colorTexture.minFilter = THREE.LinearFilter;
        colorTexture.magFilter = THREE.LinearFilter;



        let options = {
            map: colorTexture,
            roughness: roughness,
            metalness: metalness,
            reflectivity: reflectivity,
            clearcoat: clearcoat,
            color: color,
            aoMapIntensity: aoMapIntensity,
            lightMapIntensity: lightMapIntensity,
            envMapIntensity: envMapIntensity,
            side: side,
            transparent: transparent,
            flatShading: flatShading,
        }

        if (normalMapURL) {
            const normalTexture = new THREE.TextureLoader().load(normalMapURL);

            normalTexture.mapping = THREE.EquirectangularReflectionMapping;
            normalTexture.minFilter = THREE.LinearMipMapLinearFilter;
            normalTexture.magFilter = THREE.LinearFilter;

            options['normalMap'] = normalTexture;
            options['normalScale'] = new THREE.Vector2(normalScale, normalScale);
            options['bumpMap'] = normalTexture;
            options['bumpScale'] = bumpScale;
        }

        const mainMaterial = new THREE.MeshPhysicalMaterial(options);

        const mainGeometry = new THREE.SphereGeometry(
            radius,
            widthSegments,
            heightSegments,
            0,
            Math.PI * 2,
            0,
            Math.PI
        );

        mainGeometry.scale(1, 1 - oblateness, 1);

        const celestialBody = new THREE.Mesh(mainGeometry, mainMaterial);
        celestialBody.rotation.y = initialRotation;

        celestialGroup.add(celestialBody);

        let i = 0;
        if (overlayMapURL) {
            if (Array.isArray(overlayMapURL)) {
                if (Array.isArray(overlayRadiusScale)) {
                    if (overlayMapURL.length !== overlayRadiusScale.length) {
                        console.error("overlayMapURL and overlayRadiusScale arrays must be of the same length.");
                        throw new Error("overlayMapURL and overlayRadiusScale arrays must be of the same length.");
                    }
                }
                if (Array.isArray(overlayOpacity)) {
                    if (overlayMapURL.length !== overlayOpacity.length) {
                        console.error("overlayMapURL and overlayOpacity arrays must be of the same length.");
                        throw new Error("overlayMapURL and overlayOpacity arrays must be of the same length.");
                    }
                }
                overlayMapURL.forEach((url) => {
                    const overlayTexture = new THREE.TextureLoader().load(url);
                    overlayTexture.minFilter = THREE.LinearFilter;
                    overlayTexture.magFilter = THREE.LinearFilter;

                    layerOpacity = Array.isArray(overlayOpacity) ? overlayOpacity[i++] : overlayOpacity;
                    const overlayMaterial = new THREE.MeshPhysicalMaterial({
                        map: overlayTexture,
                        transparent: true,
                        opacity: layerOpacity,
                        blending: THREE.AdditiveBlending,
                        roughness: 1,
                        metalness: 0,
                    });

                    let overlayRadius = radius * (Array.isArray(overlayRadiusScale) ? overlayRadiusScale[i++] : overlayRadiusScale);

                    const overlayGeometry = new THREE.SphereGeometry(
                        overlayRadius,
                        widthSegments / 2,
                        heightSegments / 2,
                        0,
                        Math.PI * 2,
                        0,
                        Math.PI
                    );

                    const overlayMesh = new THREE.Mesh(overlayGeometry, overlayMaterial);
                    overlayMesh.rotation.y = initialRotation;

                    celestialGroup.add(overlayMesh);
                });
            } else {
                const overlayTexture = new THREE.TextureLoader().load(overlayMapURL);
                overlayTexture.minFilter = THREE.LinearFilter;
                overlayTexture.magFilter = THREE.LinearFilter;

                const overlayMaterial = new THREE.MeshPhysicalMaterial({
                    map: overlayTexture,
                    transparent: true,
                    opacity: overlayOpacity,
                    blending: THREE.AdditiveBlending,
                    roughness: 1,
                    metalness: 0,
                });

                const overlayGeometry = new THREE.SphereGeometry(
                    radius * overlayRadiusScale,
                    widthSegments / 2,
                    heightSegments / 2,
                    0,
                    Math.PI * 2,
                    0,
                    Math.PI
                );

                const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial);
                overlay.rotation.y = initialRotation;

                celestialGroup.add(overlay);
            }

        }

        return celestialGroup;

    } catch (e) {
        console.error("Error in createCelestialBody: ", e);
        return new THREE.Group(); // Return empty group on error
    }
}

export { createCelestialBody };