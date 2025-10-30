// 3D Scene Manager using Three.js
class Scene3DManager {
    constructor(containerId = 'app') {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.fontLoader = null;
        this.textureLoader = null;
        this.font = null;
        this.floatingObjects = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectedObject = null;
        this.isDragging = false;
        this.isOrbiting = false;
        this.lastMouse = { x: 0, y: 0 };
        this.dragPlane = new THREE.Plane();
        this.dragIntersection = new THREE.Vector3();
        this.dragOffset = new THREE.Vector3();
        
        this.init();
    }

    async init() {
        console.log('🎨 Initializing 3D Scene...');
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparent to show video background
        
        // Create camera with wider field of view for better 3D effect
        this.camera = new THREE.PerspectiveCamera(
            90,  // Wider FOV for more dramatic perspective
            window.innerWidth / window.innerHeight,
            0.1,
            500  // Increased far plane to see objects from far away
        );
        this.camera.position.z = 30;  // Moved camera closer for more dramatic effect
        
        // Create renderer with alpha for transparency
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Insert renderer before the controls (so it's behind UI elements)
        const controls = document.getElementById('controls');
        if (controls) {
            this.container.insertBefore(this.renderer.domElement, controls);
        } else {
            this.container.appendChild(this.renderer.domElement);
        }
        
        // Style the canvas
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.top = '0';
        this.renderer.domElement.style.left = '0';
        this.renderer.domElement.style.zIndex = '2';
        this.renderer.domElement.style.pointerEvents = 'auto';
        
        // Add lights
        this.addLights();
        
        // Load font for 3D text
        await this.loadFont();
        
        // Add texture loader with CORS support for external images
        this.textureLoader = new THREE.TextureLoader();
        // Set crossOrigin to allow loading images from external domains (like Pexels)
        this.textureLoader.crossOrigin = 'anonymous';
        
        // Add event listeners
        this.addEventListeners();
        
        // Start animation loop
        this.animate();
        
        console.log('✅ 3D Scene initialized successfully');
    }

    addLights() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light for depth
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight1.position.set(10, 10, 10);
        this.scene.add(directionalLight1);
        
        // Another directional light from opposite side
        const directionalLight2 = new THREE.DirectionalLight(0x8888ff, 0.4);
        directionalLight2.position.set(-10, -10, 5);
        this.scene.add(directionalLight2);
        
        // Point light for dramatic effect
        const pointLight = new THREE.PointLight(0xffd700, 0.5);
        pointLight.position.set(0, 0, 20);
        this.scene.add(pointLight);
    }

    async loadFont() {
        return new Promise((resolve, reject) => {
            const loader = new THREE.FontLoader();
            // Use a default Three.js font
            loader.load(
                'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
                (font) => {
                    this.font = font;
                    console.log('✅ Font loaded successfully');
                    resolve(font);
                },
                undefined,
                (error) => {
                    console.error('❌ Error loading font:', error);
                    reject(error);
                }
            );
        });
    }

    create3DText(text, options = {}) {
        if (!this.font) {
            console.error('❌ Font not loaded yet');
            return null;
        }

        const {
            size = 2,
            height = 0.5,
            color = 0x2F24C1,
            emissive = 0xFFD700,
            position = { x: 0, y: 0, z: 0 }
        } = options;

        // Create text geometry with extrusion
        const textGeometry = new THREE.TextGeometry(text, {
            font: this.font,
            size: size,
            height: height,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 5
        });

        // Center the geometry
        textGeometry.computeBoundingBox();
        const centerOffset = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
        textGeometry.translate(centerOffset, 0, 0);

        // Create material with metallic/shiny effect
        const textMaterial = new THREE.MeshStandardMaterial({
            color: color,
            emissive: emissive,
            emissiveIntensity: 0.3,
            metalness: 0.6,
            roughness: 0.4
        });

        // Create mesh
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(position.x, position.y, position.z);
        
        // Add custom properties for animation (will be overridden in addFloatingMessage)
        textMesh.userData.isText = true;
        textMesh.userData.originalText = text;

        return textMesh;
    }

    parseColorToInt(input) {
        if (typeof input === 'number') return input;
        if (typeof input === 'string') {
            if (input.startsWith('#')) {
                const hex = input.slice(1);
                const value = parseInt(hex, 16);
                if (!isNaN(value)) return value;
            }
            // Try plain hex without '#'
            const value = parseInt(input, 16);
            if (!isNaN(value)) return value;
        }
        return 0x2F24C1;
    }

    createTextParticles(text, options = {}) {
        if (!this.font) {
            console.error('❌ Font not loaded yet');
            return null;
        }

        const {
            size = 10,
            height = 1.5,
            position = { x: 0, y: 0, z: 0 },
            color = 0x2F24C1,
            particleCount = 2000
        } = options;

        // Build text geometry to sample target positions
        const textGeometry = new THREE.TextGeometry(text, {
            font: this.font,
            size: size,
            height: height,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.05,
            bevelOffset: 0,
            bevelSegments: 5
        });
        textGeometry.computeBoundingBox();
        const centerOffset = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x);
        textGeometry.translate(centerOffset, 0, 0);

        // Convert to non-indexed to get a dense position buffer
        const nonIndexed = textGeometry.toNonIndexed();
        const srcPositions = nonIndexed.attributes.position.array;
        const available = srcPositions.length / 3;
        const count = Math.min(particleCount, available);

        // Prepare target positions sampled from text geometry
        const targetPositions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const idx = Math.floor((i / count) * available) * 3; // even sampling
            targetPositions[i * 3 + 0] = srcPositions[idx + 0] + position.x;
            targetPositions[i * 3 + 1] = srcPositions[idx + 1] + position.y;
            targetPositions[i * 3 + 2] = srcPositions[idx + 2] + position.z;
        }

        // Initial positions: random sphere around center
        const startPositions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 40 * Math.cbrt(Math.random());
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const x = r * Math.sin(phi) * Math.cos(theta) + position.x;
            const y = r * Math.sin(phi) * Math.sin(theta) + position.y;
            const z = r * Math.cos(phi) + position.z - 30; // slightly in front
            startPositions[i * 3 + 0] = x;
            startPositions[i * 3 + 1] = y;
            startPositions[i * 3 + 2] = z;
        }

        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(startPositions, 3));

        const mat = new THREE.PointsMaterial({
            color: color,
            size: 0.6,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.95
        });

        const points = new THREE.Points(geom, mat);
        points.userData.isParticles = true;
        points.userData.particleTargetPositions = targetPositions;
        points.userData.morphProgress = 0;
        points.userData.morphSpeed = 0.06; // higher is faster morph
        points.userData.finalTextSpec = { text, size, height, color, position };
        points.userData.rotation = {
            x: (Math.random() - 0.5) * 0.003,
            y: (Math.random() - 0.5) * 0.003,
            z: (Math.random() - 0.5) * 0.003
        };

        return points;
    }

    create3DImage(imageUrl, options = {}) {
        const {
            width = 8,
            height = 8,
            position = { x: 0, y: 0, z: 0 }
        } = options;

        // Create plane geometry
        const geometry = new THREE.PlaneGeometry(width, height);

        // Load texture with proper error handling
        console.log('📥 Loading texture from URL:', imageUrl);
        const texture = this.textureLoader.load(
            imageUrl,
            (loadedTexture) => {
                console.log('✅ Image texture loaded successfully:', imageUrl);
                // Ensure texture is properly configured
                loadedTexture.needsUpdate = true;
            },
            (progress) => {
                if (progress.lengthComputable) {
                    const percentComplete = progress.loaded / progress.total * 100;
                    console.log('📥 Texture loading progress:', Math.round(percentComplete) + '%');
                }
            },
            (error) => {
                console.error('❌ Error loading image texture:', error, imageUrl);
                console.error('❌ This might be a CORS issue or invalid URL');
            }
        );

        // Create material with texture
        // Note: Texture might not be loaded yet, but Three.js will update when ready
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: false,  // Changed to false for better visibility
            metalness: 0.2,
            roughness: 0.8
        });
        
        console.log('✅ Created 3D image material with texture');

        // Create mesh
        const imageMesh = new THREE.Mesh(geometry, material);
        imageMesh.position.set(position.x, position.y, position.z);

        // Add a frame/border using edges
        const edges = new THREE.EdgesGeometry(geometry);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
        const frame = new THREE.LineSegments(edges, lineMaterial);
        imageMesh.add(frame);

        // Add custom properties for animation (will be overridden in addFloatingMessage)
        imageMesh.userData.isImage = true;
        imageMesh.userData.imageUrl = imageUrl;

        return imageMesh;
    }

    addFloatingMessage(messageData) {
        // Handle both camelCase and underscore field names from backend
        const imageUrl = messageData.imageUrl || messageData.image_url;
        const imageStatus = messageData.imageGenerationStatus || messageData.image_generation_status;
        const isImage = imageUrl && imageStatus === 'success';
        
        console.log('📨 3D Scene - Image check:', {
            imageUrl: imageUrl,
            imageStatus: imageStatus,
            isImage: isImage,
            fullData: messageData
        });
        
        // New behavior: latest message appears big and centered; older ones float backward
        const startX = 0;
        const startY = 0;
        const startZ = 0; // Center front

        let object;

        if (isImage) {
            console.log('📨 Creating 3D image with URL:', imageUrl);
            object = this.create3DImage(imageUrl, {
                position: { x: startX, y: startY, z: startZ },
                width: 10,
                height: 10
            });
        } else {
            // Truncate text to 5 words
            let text = messageData.filtered || messageData.body || 'Message';
            const words = text.trim().split(/\s+/);
            if (words.length > 5) {
                text = words.slice(0, 5).join(' ') + '...';
            }

            // Create particle system that will morph into the 3D text
            const selectedColor = this.parseColorToInt(messageData.textColor || 0x2F24C1);
            object = this.createTextParticles(text, {
                position: { x: startX, y: startY, z: startZ },
                size: 6,
                height: 1.0,
                particleCount: 2000,
                color: selectedColor
            });
        }

        if (object) {
            // Queue-flow behavior: newest stays centered, older ones push backward
            object.userData.useQueueFlow = true;
            object.userData.velocity = {
                x: (Math.random() - 0.5) * 0.08,
                y: (Math.random() - 0.5) * 0.08,
                z: 0
            };
            object.userData.rotation = {
                x: (Math.random() - 0.5) * 0.006,
                y: (Math.random() - 0.5) * 0.006,
                z: (Math.random() - 0.5) * 0.006
            };
            object.userData.targetZ = 0;
            object.userData.targetScale = 1.0;
            object.userData.lifetime = 0;
            
            this.scene.add(object);
            this.floatingObjects.push(object);
            console.log(`✅ Added 3D ${isImage ? 'image' : 'text'} to scene at z=${startZ}`);

            // Push existing objects backward and slightly shrink them
            const pushBackStep = 20; // how far to move back per new message
            const minZ = -220;
            this.floatingObjects.forEach((obj) => {
                if (obj === object) return;
                if (!obj.userData) obj.userData = {};
                obj.userData.useQueueFlow = true;
                const currentTargetZ = (obj.userData.targetZ !== undefined) ? obj.userData.targetZ : obj.position.z;
                obj.userData.targetZ = Math.max(minZ, currentTargetZ - pushBackStep);
                const currentScale = obj.scale.x;
                obj.userData.targetScale = Math.max(0.4, currentScale * 0.9);
            });
        }
    }

    addEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Handle mouse events for interaction
        this.renderer.domElement.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.renderer.domElement.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.renderer.domElement.addEventListener('wheel', (e) => this.onMouseWheel(e), { passive: true });
        
        // Handle touch events for mobile
        this.renderer.domElement.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.renderer.domElement.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.renderer.domElement.addEventListener('touchend', (e) => this.onTouchEnd(e));
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseDown(event) {
        event.preventDefault();
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.floatingObjects);
        
        if (intersects.length > 0) {
            this.selectedObject = intersects[0].object;
            this.isDragging = true;
            this.renderer.domElement.style.cursor = 'grabbing';
            // Setup a drag plane through the object's current position, facing the camera
            this.dragPlane.setFromNormalAndCoplanarPoint(
                this.camera.getWorldDirection(new THREE.Vector3()).clone().negate(),
                this.selectedObject.position.clone()
            );
            // Compute initial intersection and offset to maintain relative grab point
            if (this.raycaster.ray.intersectPlane(this.dragPlane, this.dragIntersection)) {
                this.dragOffset.copy(this.selectedObject.position).sub(this.dragIntersection);
            } else {
                this.dragOffset.set(0, 0, 0);
            }
        } else {
            // Start orbit mode when clicking on empty space
            this.isOrbiting = true;
            this.lastMouse.x = event.clientX;
            this.lastMouse.y = event.clientY;
            this.renderer.domElement.style.cursor = 'grab';
        }
    }

    onMouseMove(event) {
        // Dragging an object: project ray to drag plane and move selected only
        if (this.isDragging && this.selectedObject) {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            this.raycaster.setFromCamera(this.mouse, this.camera);
            if (this.raycaster.ray.intersectPlane(this.dragPlane, this.dragIntersection)) {
                const newPos = this.dragIntersection.clone().add(this.dragOffset);
                this.selectedObject.position.copy(newPos);
            }
            return;
        }

        // Orbiting the scene when dragging empty space
        if (this.isOrbiting) {
            const dx = (event.clientX - this.lastMouse.x) || 0;
            const dy = (event.clientY - this.lastMouse.y) || 0;
            this.lastMouse.x = event.clientX;
            this.lastMouse.y = event.clientY;
            // Rotate the whole scene slightly
            this.scene.rotation.y += dx * 0.005;
            this.scene.rotation.x += dy * 0.005;
            // Clamp vertical rotation to avoid flipping
            const maxTilt = Math.PI / 2 - 0.1;
            this.scene.rotation.x = Math.max(-maxTilt, Math.min(maxTilt, this.scene.rotation.x));
        }
    }

    onMouseUp(event) {
        this.isDragging = false;
        this.selectedObject = null;
        this.isOrbiting = false;
        this.renderer.domElement.style.cursor = 'auto';
    }

    onMouseWheel(event) {
        // Scroll to zoom the camera in/out
        const zoomDelta = event.deltaY * 0.01;
        const minZ = 8;
        const maxZ = 150;
        this.camera.position.z = Math.max(minZ, Math.min(maxZ, this.camera.position.z + zoomDelta));
    }

    onTouchStart(event) {
        if (event.touches.length === 1) {
            const touch = event.touches[0];
            this.onMouseDown({ 
                clientX: touch.clientX, 
                clientY: touch.clientY,
                preventDefault: () => event.preventDefault()
            });
        }
    }

    onTouchMove(event) {
        if (event.touches.length === 1 && this.isDragging) {
            const touch = event.touches[0];
            const prevTouch = event.changedTouches[0];
            this.onMouseMove({ 
                clientX: touch.clientX, 
                clientY: touch.clientY,
                movementX: touch.clientX - prevTouch.clientX,
                movementY: touch.clientY - prevTouch.clientY
            });
        }
    }

    onTouchEnd(event) {
        this.onMouseUp(event);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update floating objects
        this.floatingObjects.forEach((object, index) => {
            if (!object.userData) return;
            
            // Increment lifetime
            object.userData.lifetime = (object.userData.lifetime || 0) + 1;

            // Particle morphing phase: move points toward target positions
            if (object.userData.isParticles) {
                const geom = object.geometry;
                const posAttr = geom.getAttribute('position');
                const positions = posAttr.array;
                const targets = object.userData.particleTargetPositions;
                const count = positions.length / 3;
                let reached = 0;
                const speed = object.userData.morphSpeed || 0.1;
                for (let i = 0; i < count; i++) {
                    const i3 = i * 3;
                    // Lerp toward target
                    const tx = targets[i3 + 0];
                    const ty = targets[i3 + 1];
                    const tz = targets[i3 + 2];
                    positions[i3 + 0] += (tx - positions[i3 + 0]) * speed;
                    positions[i3 + 1] += (ty - positions[i3 + 1]) * speed;
                    positions[i3 + 2] += (tz - positions[i3 + 2]) * speed;
                    // Check closeness
                    const dx = tx - positions[i3 + 0];
                    const dy = ty - positions[i3 + 1];
                    const dz = tz - positions[i3 + 2];
                    if ((dx*dx + dy*dy + dz*dz) < 0.04) reached++;
                }
                posAttr.needsUpdate = true;

                // Gentle rotation for visual interest
                if (object.userData.rotation) {
                    object.rotation.x += object.userData.rotation.x;
                    object.rotation.y += object.userData.rotation.y;
                    object.rotation.z += object.userData.rotation.z;
                }

                // When enough particles are close, swap to the final text mesh
                const completionRatio = reached / count;
                if (completionRatio > 0.92 || object.userData.lifetime > 240) {
                    const spec = object.userData.finalTextSpec;
                    const textMesh = this.create3DText(spec.text, {
                        position: spec.position,
                        size: spec.size,
                        height: spec.height,
                        color: spec.color
                    });
                    if (textMesh) {
                        // Carry over flow properties
                        textMesh.userData.useQueueFlow = true;
                        textMesh.userData.targetZ = object.userData.targetZ ?? 0;
                        textMesh.userData.targetScale = object.userData.targetScale ?? 1.0;
                        textMesh.userData.velocity = object.userData.velocity;
                        textMesh.userData.rotation = object.userData.rotation;
                        textMesh.userData.lifetime = object.userData.lifetime;

                        // Replace object in scene and list
                        this.scene.add(textMesh);
                        const idx = this.floatingObjects.indexOf(object);
                        if (idx !== -1) this.floatingObjects[idx] = textMesh;
                        this.scene.remove(object);
                        if (object.geometry) object.geometry.dispose();
                        if (object.material) object.material.dispose();
                        object = textMesh; // for subsequent logic if any
                    }
                }
            }

            if (object.userData.useQueueFlow) {
                // Smoothly move toward targetZ and targetScale
                const targetZ = (object.userData.targetZ !== undefined) ? object.userData.targetZ : object.position.z;
                object.position.z += (targetZ - object.position.z) * 0.12;

                const targetScale = object.userData.targetScale || 1.0;
                const newScale = object.scale.x + (targetScale - object.scale.x) * 0.12;
                object.scale.set(newScale, newScale, newScale);

                // Gentle drift
                if (object.userData.velocity) {
                    object.position.x += object.userData.velocity.x;
                    object.position.y += object.userData.velocity.y;
                }

                // Clamp bounds relative to camera
                const maxX = 50;
                const maxY = 35;
                object.position.x = Math.max(-maxX, Math.min(maxX, object.position.x));
                object.position.y = Math.max(-maxY, Math.min(maxY, object.position.y));

            } else if (object.userData.velocity) {
                // Legacy floating behavior
            // Phase 1: Come forward from deep inside (until z > -20)
            if (object.position.z < -20) {
                object.position.z += object.userData.velocity.z;
                object.position.x += object.userData.velocity.x * 0.3;
                object.position.y += object.userData.velocity.y * 0.3;
                if (object.position.z > -20) {
                    object.userData.hasReachedVisible = true;
                }
            } else {
                object.userData.hasReachedVisible = true;
                object.position.z += object.userData.velocity.z * 0.2;
                if (object.userData.orbitRadius) {
                    object.userData.orbitAngle += object.userData.orbitSpeed;
                    const orbitX = Math.cos(object.userData.orbitAngle) * object.userData.orbitRadius * 0.1;
                    const orbitY = Math.sin(object.userData.orbitAngle) * object.userData.orbitRadius * 0.1;
                    object.position.x += object.userData.velocity.x + orbitX;
                    object.position.y += object.userData.velocity.y + orbitY;
                } else {
                    object.position.x += object.userData.velocity.x;
                    object.position.y += object.userData.velocity.y;
                }
                const safeZ = Math.max(-15, Math.min(object.position.z, 25));
                    const zFactor = Math.abs(safeZ) / 30;
                    const maxX = 35 + zFactor * 15;
                    const maxY = 25 + zFactor * 10;
                if (object.position.x > maxX) {
                    object.position.x = maxX;
                    object.userData.velocity.x = Math.abs(object.userData.velocity.x) * -0.8;
                } else if (object.position.x < -maxX) {
                    object.position.x = -maxX;
                    object.userData.velocity.x = Math.abs(object.userData.velocity.x) * 0.8;
                }
                if (object.position.y > maxY) {
                    object.position.y = maxY;
                    object.userData.velocity.y = Math.abs(object.userData.velocity.y) * -0.8;
                } else if (object.position.y < -maxY) {
                    object.position.y = -maxY;
                    object.userData.velocity.y = Math.abs(object.userData.velocity.y) * 0.8;
                }
                if (object.position.z > 25) {
                    object.position.z = 25;
                        object.userData.velocity.z *= -0.5;
                } else if (object.position.z < -15) {
                    object.position.z = -15;
                    object.userData.velocity.z = Math.abs(object.userData.velocity.z);
                }
                const maxVelocity = 0.12;
                object.userData.velocity.x = Math.max(-maxVelocity, Math.min(maxVelocity, object.userData.velocity.x));
                object.userData.velocity.y = Math.max(-maxVelocity, Math.min(maxVelocity, object.userData.velocity.y));
                object.userData.velocity.z = Math.max(-maxVelocity * 0.5, Math.min(maxVelocity * 0.5, object.userData.velocity.z));
                if (object.userData.lifetime % 300 === 0) {
                    object.userData.velocity.x += (Math.random() - 0.5) * 0.01;
                    object.userData.velocity.y += (Math.random() - 0.5) * 0.01;
                    object.userData.velocity.x = Math.max(-maxVelocity, Math.min(maxVelocity, object.userData.velocity.x));
                    object.userData.velocity.y = Math.max(-maxVelocity, Math.min(maxVelocity, object.userData.velocity.y));
                    }
                }
            }
            
            // Auto-rotate (unless being dragged)
            if (object !== this.selectedObject && object.userData && object.userData.rotation) {
                object.rotation.x += object.userData.rotation.x;
                object.rotation.y += object.userData.rotation.y;
                object.rotation.z += object.userData.rotation.z;
            }
            
            // Remove if escapes bounds
            if (Math.abs(object.position.x) > 150 || 
                Math.abs(object.position.y) > 120 || 
                object.position.z < -260 || 
                object.position.z > 120) {
                console.warn('⚠️ Object escaped bounds, removing:', object.position);
                this.scene.remove(object);
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(mat => mat.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
                this.floatingObjects.splice(index, 1);
            }
        });
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }

    clearAllObjects() {
        this.floatingObjects.forEach(object => {
            this.scene.remove(object);
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(mat => mat.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });
        this.floatingObjects = [];
    }
}

// Export for use in other scripts
window.Scene3DManager = Scene3DManager;

