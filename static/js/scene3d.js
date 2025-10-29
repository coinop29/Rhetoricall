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
        
        // Random starting position - deep inside the screen coming toward viewer
        // Cover entire screen width and height
        const startX = (Math.random() - 0.5) * 100;  // Wider range for full screen
        const startY = (Math.random() - 0.5) * 80;   // Full height range
        const startZ = -150 - Math.random() * 50;     // Start deep in the screen (-150 to -200)

        let object;

        if (isImage) {
            console.log('📨 Creating 3D image with URL:', imageUrl);
            object = this.create3DImage(imageUrl, {
                position: { x: startX, y: startY, z: startZ },
                width: 8,
                height: 8
            });
        } else {
            // Truncate text to 5 words
            let text = messageData.filtered || messageData.body || 'Message';
            const words = text.trim().split(/\s+/);
            if (words.length > 5) {
                text = words.slice(0, 5).join(' ') + '...';
            }

            object = this.create3DText(text, {
                position: { x: startX, y: startY, z: startZ },
                size: 2,
                height: 0.5
            });
        }

        if (object) {
            // Set velocity - slower, smoother movement
            // Come forward slowly, then float around
            object.userData.velocity = {
                x: (Math.random() - 0.5) * 0.08,      // Gentle horizontal drift
                y: (Math.random() - 0.5) * 0.08,      // Gentle vertical drift
                z: 0.08 + Math.random() * 0.05        // Slow forward movement (0.08 to 0.13)
            };
            
            // Store initial position for orbiting
            object.userData.initialPosition = { x: startX, y: startY, z: startZ };
            object.userData.orbitRadius = 5 + Math.random() * 10;
            object.userData.orbitSpeed = 0.001 + Math.random() * 0.002;
            object.userData.orbitAngle = Math.random() * Math.PI * 2;
            
            // Smooth rotation
            object.userData.rotation = {
                x: (Math.random() - 0.5) * 0.005,
                y: (Math.random() - 0.5) * 0.005,
                z: (Math.random() - 0.5) * 0.005
            };
            
            // Track when object reached visible area
            object.userData.hasReachedVisible = false;
            object.userData.lifetime = 0;
            
            this.scene.add(object);
            this.floatingObjects.push(object);
            console.log(`✅ Added 3D ${isImage ? 'image' : 'text'} to scene at z=${startZ}`);
        }
    }

    addEventListeners() {
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Handle mouse events for interaction
        this.renderer.domElement.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.renderer.domElement.addEventListener('mouseup', (e) => this.onMouseUp(e));
        
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
        }
    }

    onMouseMove(event) {
        if (!this.isDragging || !this.selectedObject) return;
        
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Rotate the selected object based on mouse movement
        const rotationSpeed = 0.5;
        this.selectedObject.rotation.y += event.movementX * 0.01 * rotationSpeed;
        this.selectedObject.rotation.x += event.movementY * 0.01 * rotationSpeed;
    }

    onMouseUp(event) {
        this.isDragging = false;
        this.selectedObject = null;
        this.renderer.domElement.style.cursor = 'auto';
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
            if (!object.userData || !object.userData.velocity) return;
            
            // Increment lifetime
            object.userData.lifetime++;
            
            // Phase 1: Come forward from deep inside (until z > -20)
            if (object.position.z < -20) {
                // Still emerging - keep moving forward
                object.position.z += object.userData.velocity.z;
                
                // Add some gentle drift
                object.position.x += object.userData.velocity.x * 0.3;
                object.position.y += object.userData.velocity.y * 0.3;
                
                // Mark when it reaches visible area
                if (object.position.z > -20) {
                    object.userData.hasReachedVisible = true;
                }
            } else {
                // Phase 2: Object is visible - float around smoothly
                object.userData.hasReachedVisible = true;
                
                // Reduce forward movement significantly
                object.position.z += object.userData.velocity.z * 0.2;
                
                // Add orbital motion for more natural floating
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
                
                // Strict boundary constraints - keep objects within visible screen bounds
                // Based on camera FOV 90 and position z=30, visible area is roughly:
                // X: -35 to +35 (at z=0)
                // Y: -25 to +25 (at z=0)
                // These bounds scale with z position
                const safeZ = Math.max(-15, Math.min(object.position.z, 25));
                const zFactor = Math.abs(safeZ) / 30; // Normalize based on camera distance
                
                // Calculate visible bounds based on current z position
                const maxX = 35 + zFactor * 15;  // Wider when closer
                const maxY = 25 + zFactor * 10;  // Taller when closer
                
                // Strict boundary enforcement - clamp position and reverse velocity
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
                
                // Keep object in visible z range (between -15 and 25)
                if (object.position.z > 25) {
                    object.position.z = 25;
                    object.userData.velocity.z *= -0.5; // Reverse and slow down
                } else if (object.position.z < -15) {
                    object.position.z = -15;
                    object.userData.velocity.z = Math.abs(object.userData.velocity.z);
                }
                
                // Prevent velocity from accumulating too much
                const maxVelocity = 0.12;
                object.userData.velocity.x = Math.max(-maxVelocity, Math.min(maxVelocity, object.userData.velocity.x));
                object.userData.velocity.y = Math.max(-maxVelocity, Math.min(maxVelocity, object.userData.velocity.y));
                object.userData.velocity.z = Math.max(-maxVelocity * 0.5, Math.min(maxVelocity * 0.5, object.userData.velocity.z));
                
                // Add slight random drift changes for more organic movement
                if (object.userData.lifetime % 300 === 0) {
                    object.userData.velocity.x += (Math.random() - 0.5) * 0.01;
                    object.userData.velocity.y += (Math.random() - 0.5) * 0.01;
                    // Clamp velocity after drift change
                    object.userData.velocity.x = Math.max(-maxVelocity, Math.min(maxVelocity, object.userData.velocity.x));
                    object.userData.velocity.y = Math.max(-maxVelocity, Math.min(maxVelocity, object.userData.velocity.y));
                }
            }
            
            // Auto-rotate (unless being dragged)
            if (object !== this.selectedObject && object.userData.rotation) {
                object.rotation.x += object.userData.rotation.x;
                object.rotation.y += object.userData.rotation.y;
                object.rotation.z += object.userData.rotation.z;
            }
            
            // Messages stay forever - only remove if they somehow escape bounds (safety check)
            // This should rarely happen now with strict boundary clamping
            if (Math.abs(object.position.x) > 100 || 
                Math.abs(object.position.y) > 100 || 
                object.position.z < -250 || 
                object.position.z > 100) {
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

