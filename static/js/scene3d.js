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
        
        // Add texture loader
        this.textureLoader = new THREE.TextureLoader();
        
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

        // Load texture
        const texture = this.textureLoader.load(
            imageUrl,
            (loadedTexture) => {
                console.log('✅ Image texture loaded:', imageUrl);
            },
            undefined,
            (error) => {
                console.error('❌ Error loading image texture:', error);
            }
        );

        // Create material with some depth effect
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
            metalness: 0.2,
            roughness: 0.8
        });

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
        const isImage = messageData.imageUrl && messageData.image_generation_status === 'success';
        
        // Random starting position - deep inside the screen coming toward viewer
        // Cover entire screen width and height
        const startX = (Math.random() - 0.5) * 100;  // Wider range for full screen
        const startY = (Math.random() - 0.5) * 80;   // Full height range
        const startZ = -150 - Math.random() * 50;     // Start deep in the screen (-150 to -200)

        let object;

        if (isImage) {
            object = this.create3DImage(messageData.imageUrl, {
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
                
                // Smooth boundary handling - slow down near edges instead of bouncing
                const boundaryX = 70;
                const boundaryY = 50;
                
                if (Math.abs(object.position.x) > boundaryX * 0.7) {
                    // Smoothly reverse direction near boundary
                    const factor = (Math.abs(object.position.x) - boundaryX * 0.7) / (boundaryX * 0.3);
                    object.userData.velocity.x *= (1 - factor * 0.1);
                    if (Math.abs(object.position.x) > boundaryX) {
                        object.userData.velocity.x *= -0.8; // Reverse direction smoothly
                    }
                }
                
                if (Math.abs(object.position.y) > boundaryY * 0.7) {
                    const factor = (Math.abs(object.position.y) - boundaryY * 0.7) / (boundaryY * 0.3);
                    object.userData.velocity.y *= (1 - factor * 0.1);
                    if (Math.abs(object.position.y) > boundaryY) {
                        object.userData.velocity.y *= -0.8; // Reverse direction smoothly
                    }
                }
                
                // Keep object in visible range (z between -20 and 40)
                if (object.position.z > 40) {
                    // Slow down forward movement and maintain position
                    object.userData.velocity.z *= 0.95;
                    object.position.z = Math.min(object.position.z, 40);
                }
                
                // Add slight random drift changes for more organic movement
                if (object.userData.lifetime % 300 === 0) {
                    object.userData.velocity.x += (Math.random() - 0.5) * 0.02;
                    object.userData.velocity.y += (Math.random() - 0.5) * 0.02;
                    // Clamp velocity to reasonable range
                    object.userData.velocity.x = Math.max(-0.15, Math.min(0.15, object.userData.velocity.x));
                    object.userData.velocity.y = Math.max(-0.15, Math.min(0.15, object.userData.velocity.y));
                }
            }
            
            // Auto-rotate (unless being dragged)
            if (object !== this.selectedObject && object.userData.rotation) {
                object.rotation.x += object.userData.rotation.x;
                object.rotation.y += object.userData.rotation.y;
                object.rotation.z += object.userData.rotation.z;
            }
            
            // Messages stay forever - only remove if they go way too far (safety check)
            // Only remove if object somehow goes way off screen or becomes invalid
            if (Math.abs(object.position.x) > 200 || 
                Math.abs(object.position.y) > 200 || 
                object.position.z < -300 || 
                object.position.z > 200) {
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
                console.log('🗑️ Removed object that went off-screen');
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

