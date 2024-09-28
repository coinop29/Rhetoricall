
const backgroundColor = 0xFFFFFF;
const textColor = 0x2F24C1;
const cursorColor = 0x3FD1CB;
const highlightColor = 0x3FD1CB;

/*////////////////////////////////////////*/

var renderCalls = [];
function render () {
  requestAnimationFrame( render );
  renderCalls.forEach((callback)=>{ callback(); });
}
render();

/*////////////////////////////////////////*/

var scene = new THREE.Scene();
scene.fog = new THREE.Fog(backgroundColor, 30, 300);

var camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 800 );
camera.position.z = 30;
camera.position.x = 5;
camera.position.y = -2;

var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( backgroundColor );//0x );
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = Math.pow( 0.94, 5.0 );

// if ( window.innerWidth > 500 ) {
//   renderer.shadowMap.enabled = true;
//   renderer.shadowMap.type = THREE.PCFShadowMap;
// }

window.addEventListener( 'resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}, false );

document.body.appendChild( renderer.domElement);

function renderScene(){ renderer.render( scene, camera ); }
renderCalls.push(renderScene);

/*////////////////////////////////////////*/

var pointer = {
  x: 0,
  y: 0,
};

document.addEventListener('mousemove', pointerMove);
document.addEventListener('touchmove', pointerMove);

document.body.addEventListener('mouseleave', pointerReset);
document.body.addEventListener('touchcancel', pointerReset);

function pointerReset(e){
  pointer.x = 0.5;
  pointer.y = 0.5;
}

function pointerMove(e){
  let pos = e.touches ? e.touches[0] : e;
  pointer.x = pos.clientX / window.innerWidth;
  pointer.y = pos.clientY / window.innerWidth;
};

let mousePos = { x: 0.25, y: 0.5 };
function trackMouse(e){
  let pointer = e.touches ? e.touches[0] : e;
  mousePos.x = ( pointer.clientX / window.innerWidth );
  mousePos.y = ( pointer.clientY / window.innerHeight );
};

function ease(current,target,ease){ return current + (target - current) * ( ease || 0.2 ); }


var ambientLight = new THREE.AmbientLight(0x222222);
scene.add(ambientLight);

var hemiLight = new THREE.HemisphereLight( 0xFFF7EB, 0xEBF7FD, 0.3 );
scene.add( hemiLight );

var light = new THREE.SpotLight( 0xffffff );
light.position.y = 40;
light.position.x = 0;
light.position.z = 200;
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 1;
light.shadow.camera.far = 800;
light.shadow.camera.fov = 40;
light.power = 1.5;
scene.add(light);

renderCalls.push(()=>{
  light.position.copy(camera.position);
});


var characters = {
  "0":[[0,0],[1,0],[2,0],[0,1],[2,1],[0,2],[2,2],[0,3],[2,3],[0,4],[1,4],[2,4]],
  "1":[[1,0],[0,1],[1,1],[1,2],[1,3],[1,4]],
  "2":[[0,0],[1,0],[2,1],[1,2],[0,3],[0,4],[1,4],[2,4]],
  "3":[[0,0],[1,0],[2,1],[1,2],[2,2],[2,3],[0,4],[1,4],[2,4]],
  "4":[[0,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2],[2,3],[2,4]],
  "5":[[0,0],[1,0],[2,0],[0,1],[0,2],[1,2],[2,2],[2,3],[0,4],[1,4]],
  "6":[[0,0],[1,0],[2,0],[0,1],[0,2],[1,2],[2,2],[0,3],[2,3],[0,4],[1,4],[2,4]],
  "7":[[0,0],[1,0],[2,0],[2,1],[2,2],[1,3],[1,4]],
  "8":[[0,0],[1,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2],[0,3],[2,3],[0,4],[1,4],[2,4]],
  "9":[[0,0],[1,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2],[2,3],[0,4],[1,4],[2,4]],
  "Z":[[0,0],[1,0],[2,0],[2,1],[1,2],[0,3],[0,4],[1,4],[2,4]],
  "Y":[[0,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2],[2,3],[0,4],[1,4]],
  "X":[[0,0],[2,0],[0,1],[2,1],[1,2],[0,3],[2,3],[0,4],[2,4]],
  "W":[[0,0],[4,0],[0,1],[2,1],[4,1],[0,2],[2,2],[4,2],[0,3],[2,3],[4,3],[1,4],[3,4]],
  "V":[[0,0],[2,0],[0,1],[2,1],[0,2],[2,2],[0,3],[2,3],[1,4]],
  "U":[[0,0],[2,0],[0,1],[2,1],[0,2],[2,2],[0,3],[2,3],[0,4],[1,4],[2,4]],
  "T":[[0,0],[1,0],[2,0],[1,1],[1,2],[1,3],[1,4]],
  "S":[[1,0],[2,0],[0,1],[1,2],[2,3],[0,4],[1,4]],
  "R":[[0,0],[1,0],[0,1],[2,1],[0,2],[2,2],[0,3],[1,3],[0,4],[2,4]],
  "Q":[[1,0],[0,1],[2,1],[0,2],[2,2],[0,3],[2,3],[1,4],[2,4],[3,4]],
  "P":[[0,0],[1,0],[0,1],[2,1],[0,2],[1,2],[2,2],[0,3],[0,4]],
  "O":[[1,0],[0,1],[2,1],[0,2],[2,2],[0,3],[2,3],[1,4]],
  "N":[[0,0],[1,0],[0,1],[2,1],[0,2],[2,2],[0,3],[2,3],[0,4],[2,4]],
  "M":[[0,0],[1,0],[2,0],[3,0],[0,1],[2,1],[4,1],[0,2],[2,2],[4,2],[0,3],[2,3],[4,3],[0,4],[4,4]],
  "L":[[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4]],
  "K":[[0,0],[2,0],[0,1],[2,1],[0,2],[1,2],[0,3],[2,3],[0,4],[2,4]],
  "J":[[2,0],[2,1],[0,2],[2,2],[0,3],[2,3],[1,4]],
  "I":[[0,0],[1,0],[2,0],[1,1],[1,2],[1,3],[0,4],[1,4],[2,4]],
  "H":[[0,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2],[0,3],[2,3],[0,4],[2,4]],
  "G":[[1,0],[2,0],[0,1],[0,2],[2,2],[0,3],[2,3],[0,4],[1,4],[2,4]],
  "F":[[0,0],[1,0],[2,0],[0,1],[0,2],[1,2],[0,3],[0,4]],
  "E":[[1,0],[2,0],[0,1],[0,2],[1,2],[0,3],[0,4],[1,4],[2,4]],
  "D":[[0,0],[1,0],[0,1],[2,1],[0,2],[2,2],[0,3],[2,3],[0,4],[1,4]],
  "C":[[1,0],[2,0],[0,1],[0,2],[0,3],[1,4],[2,4]],
  "B":[[0,0],[1,0],[0,1],[2,1],[0,2],[1,2],[0,3],[2,3],[0,4],[1,4]],
  "A":[[1,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2],[0,3],[2,3],[0,4],[2,4]],
  "}":[[0,0],[1,0],[1,1],[2,2],[1,3],[0,4],[1,4]],
  "{":[[1,0],[2,0],[1,1],[0,2],[1,3],[1,4],[2,4]],
  "]":[[0,0],[1,0],[1,1],[1,2],[1,3],[0,4],[1,4]],
  "[":[[0,0],[1,0],[0,1],[0,2],[0,3],[0,4],[1,4]],
  ")":[[0,0],[1,1],[1,2],[1,3],[0,4]],
  "(":[[1,0],[0,1],[0,2],[0,3],[1,4]],
  "—":[[0,2],[1,2],[2,2],[3,2]],
  "–":[[0,2],[1,2],[2,2]],
  "-":[[0,2],[1,2]],
  "`":[[0,0],[1,1]],
  "\"":[[0,0],[1,0],[3,0],[4,0],[1,1],[4,1],[0,2],[3,2]],
  "\\":[[0,0],[0,1],[1,2],[2,3],[2,4]],
  ",":[[1,3],[0,4]],
  ":":[[0,1],[0,3]],
  "^":[[2,0],[1,1],[3,1],[0,2],[4,2]],
  "!":[[0,0],[0,1],[0,2],[0,4]],
  "=":[[0,1],[1,1],[2,1],[0,3],[1,3],[2,3]],
  "|":[[0,0],[0,1],[0,2],[0,3],[0,4]],
  ".":[[0,4]],
  "%":[[0,0],[1,0],[4,0],[0,1],[1,1],[3,1],[2,2],[1,3],[3,3],[4,3],[0,4],[3,4],[4,4]],
  "'":[[0,0],[1,0],[1,1],[0,2]],
  "?":[[0,0],[1,0],[2,0],[2,1],[1,2],[1,4]],
  ";":[[0,1],[0,3],[0,4]],
  "/":[[2,0],[2,1],[1,2],[0,3],[0,4]],
  ">":[[0,0],[1,1],[2,2],[1,3],[0,4]],
  "_":[[0,4],[1,4],[2,4]],
  "+":[[1,1],[0,2],[1,2],[2,2],[1,3]],
  "<":[[2,0],[1,1],[0,2],[1,3],[2,4]],
  "~":[[1,0],[3,0],[0,1],[2,1]],
  "#":[[1,0],[3,0],[0,1],[1,1],[2,1],[3,1],[4,1],[1,2],[3,2],[0,3],[1,3],[2,3],[3,3],[4,3],[1,4],[3,4]],
  "@":[[1,0],[2,0],[3,0],[0,1],[2,1],[4,1],[0,2],[2,2],[3,2],[0,3],[1,4],[2,4],[3,4],[4,4]]
}


/*////////////////////////////////////////*/


var poxelGeometry = new THREE.BoxGeometry( 1, 1, 1 );
var poxelMaterial = new THREE.MeshPhongMaterial({
  color: 0xFF0000, //color || '#F00',
  shininess: 60
});

function Poxel(material){
  THREE.Mesh.call( this, poxelGeometry, poxelMaterial);
  this.castShadow = true;
  this.receiveShadow = true;
  return this;
}

CustomBounce.create("myBounce", {strength: 0.1, squash:0 });

Poxel.prototype = Object.assign(Object.create(THREE.Mesh.prototype), {
  constructor: Poxel,

  transitionOut(speed){
    speed = speed || 0.4 + Math.random() * 0.2;

    let tl = new TimelineLite({
      onStart: ()=> { this.animating = true; },
      onComplete: ()=> { this.animating = false; }
    });

    tl.to(this.position, speed, {
      z: -80,
      delay: Math.random(),
      ease: 'Power2.easeIn' //Bounce.easeOut
    },0);

    this.material = this.material.clone();
    this.material.transparent = true;

    tl.to(this.material, speed * 0.6, {
      opacity: 0,
      ease: 'Linear.easeNone'
    },speed * 0.6);

    return tl;
  },

  transitionIn(speed){
    speed = speed || 0.4 + Math.random() * 0.35;

    return TweenLite.from(this.position, speed, {
      z: 80,
      ease: 'myBounce',
      onStart: ()=> { this.animating = true; },
      onComplete: ()=> { this.animating = false; }
    },0);
  },

});



/*////////////////////////////////////////*/

function Character(name,opts){
  THREE.Object3D.call(this);
  this.name = name;
  for (var key in opts){ this[key] = opts[key]; }
  if ( !opts || !opts.poxelMaterial ) {
    this.poxelMaterial = new THREE.MeshPhongMaterial({
      color: this.color, //color || '#F00',
      transparent: true,
      emissive: this.color,
      emissiveIntensity: 0.6,
      opacity: 0.95,
      shininess: 120
    });
  }
  this.buildPoxels(name);
}

Character.prototype = Object.assign(Object.create(THREE.Object3D.prototype), {
  constructor: Character,

  color: textColor, //0x454545,

  buildPoxels(name){

    let pixels = characters[name];

    let i = pixels.length;

    let width = 0;
    let height = 0;

    while( i-- ){
      let pixel = pixels[i];
      let pixelCube = new Poxel();
      pixelCube.material = this.poxelMaterial;

      width = pixel[0] > width ? pixel[0] : width;
      height = pixel[1] > height ? pixel[1] : height;

      pixelCube.position.set(
        pixel[0],// - (this.spriteWidth/2),
        -pixel[1],// + (this.spriteHeight/2),
        0
      );
      this.add(pixelCube);
    }

    this.width = width+1;
    this.height = height+1;
  },

  transitionIn(delay, onComplete){

    onComplete = onComplete || function(){};

    let tl = new TimelineLite({
      onStart: ()=>{ this.animating = true; },
      onComplete: ()=>{
        this.animating = false;
        onComplete.call(this,this);
      },
      delay: delay
    });

    this.traverseVisible((child)=>{
      if ( child !== this ) { tl.add(child.transitionIn(),0); }
    });

    return tl;
  },

  transitionOut(delay, onComplete){

    onComplete = onComplete || function(){};

    //this.matrixAutoUpdate = false;
    // this.position.copy(this.getWorldPosition());
    // this.parent.remove(this);
    // scene.add(this);

    let tl = new TimelineLite({
      onStart: ()=>{ this.animating = true; },
      onComplete: ()=>{
        this.animating = false;
        onComplete.call(this,this);
      },
      delay: delay
    });


    this.traverseVisible((child)=>{
      if ( child !== this ) { tl.add(child.transitionOut(),0); }
    });

    return tl;
  }
});


/*////////////////////////////////////////*/

function ease(current,target,ease){ return current + (target - current) * ( ease || 0.2 ); }


var container = new THREE.Group();
scene.add(container);

var el = document.createElement('div');
document.body.appendChild(el);
var inputter = new Vue({
  el: el,
  data: ()=>({

    message: '',
    defaultMessage: "Start\nTyping",
    characters: [],

    offsetX: 0,
    offsetY: 0,
    group: new THREE.Group(),
    cursor: null
  }),
  template: '<textarea ref="input" type="text" v-model:value="message" style="position: absolute; bottom: 0; left: 0; right: 4em; max-width: 100%; width: calc(100% - 4em); opacity: 0.9; background: none; height: 3.5em;" />',

  mounted(){

    this.message = ( location.hash && decodeURI(location.hash.slice(1)) ) || this.defaultMessage;

    this.$refs.input.focus();
    //renderCalls.push(()=>{ this.$refs.input.focus(); });
    this.$nextTick(()=>{ this.$refs.input.select(); });

    document.addEventListener('focus', e=>{
      console.log('click!');
      this.$refs.input.focus();
    });

    // Cursor for tracking position in textarea
    this.cursor = new Character('|',{
      poxelMaterial: new THREE.MeshPhongMaterial({
        color: cursorColor,
        emissive: cursorColor,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.6
      })
    });
    this.cursor.visible = false;
    TweenMax.to({},0.7,{
      onRepeat: ()=>{
        // if ( !this.cursor.animate ) {
        //   return;
        // } else {
          this.cursor.visible = !this.cursor.visible;
        //}
      },
      repeat: -1
    });
    this.cursor.traverse((child)=>{ child.attractive = false });

    this.cursor.position.z = -1.1;
    this.group.add(this.cursor);

    // text highlight when selection is made
    this.highlight = new Poxel();
    this.highlight.material = new THREE.MeshPhongMaterial({
        color: highlightColor,
        emissive: highlightColor,
        emissiveIntensity: 0.6,
        transparent: true,
        opacity: 0.6
      });
    this.highlight.position.z = -2;
    container.add(this.highlight);

    container.add(this.group);

    // Keep some dimension to the group.
    let poxel = new Poxel();
    poxel.visible = false;
    this.group.add(poxel);

    // for sizing calculations
    this.helper = new THREE.BoundingBoxHelper(this.group, 0xff0000);
    this.helper.visible = false;
    container.add(this.helper);

    renderCalls.push( this.update );
  },

  watch: {

    message: function(val, oldVal){

      val = val && val.toUpperCase();
      oldVal = oldVal && oldVal.toUpperCase();
      if ( val === oldVal ) { return; }

      let len = Math.max(val.length, oldVal.length);
      let i = 0;
      let delay = 0;
      let tl = new TimelineLite();

      let oldChars = this.characters;
      let newChars = val.split('');

      for (; i< len; i++){
        let char = newChars[i];
        let oldChar = ( oldChars[i] && oldChars[i].name || oldChars[i] );

        if ( oldChar !== char ) {
          //console.log('not equal', i, char, oldChar);
          if ( oldChar ) { tl.add(this.removeChar(oldChars[i], i), delay += 0.05 ); }
          if ( char ) { tl.add(this.addChar(char, i), delay += 0.05 ); }
        }
      }

      //this.cursor.visible = true;
    },
  },

  methods: {

    addChar(char, i){

      let character = char.toUpperCase();
      let tl = function(){};

      if ( characters[character] ) {
        character = new Character(character);
        tl = character.transitionIn(null);
        this.group.add(character);
      }

      this.characters[i] = character;

      let pos = this.getPosition(i);
      if ( character.position ) {
        character.position.x = pos[0] - character.width;
        character.position.y = pos[1];
      }

      return tl;
    },

    removeChar(char, i){
      delete this.characters[i];
      if ( char && char.transitionOut ) {
        return char.transitionOut(null,(char)=>{
          if ( char.parent ) { char.parent.remove(char); }
        });
      } else { return function(){} }
    },

    getPosition(index){

      let offsetX = 0;
      let offsetY = 0;

      this.characters.forEach((char,i)=>{
        if ( index !== null && i > index ) { return false; }
        if ( char.match && char.match(/[\n\r]/) ) {
          offsetY -= 6;
          offsetX = 0;
        } else if ( char.width ) {
          offsetX += (char.width + 1);
        } else {
          offsetX += 4;
        }
      });

      this.offsetX = offsetX;
      this.offsetY = offsetY;

      return [offsetX, offsetY];
    },

    updateCursor(){

      let start = this.$refs.input.selectionStart;
      let end = this.$refs.input.selectionEnd;

      let cursorPos = this.getPosition(start-1);
      let cursorX = cursorPos[0] + 1;
      let cursorY = cursorPos[1];
      let scaleX = 1;
      let scaleY = 1;

      if ( start !== end ) {
        let cursorEnd = this.getPosition(end);
        cursorX = cursorEnd[0] - ((cursorEnd[0] - cursorPos[0])/2);

        this.cursor.visible = false;
        this.cursor.animate = false;
        this.updateHighlight();
      } else {
        this.highlight.visible = false;
        this.cursor.animate = true;
      }

      this.cursor.position.x = ease(this.cursor.position.x, cursorX, 0.2);
      this.cursor.position.y = ease(this.cursor.position.y, cursorY, 0.5);
      this.cursor.scale.x = ease( this.cursor.scale.x, scaleX, 0.2);
      this.cursor.scale.y = ease( this.cursor.scale.y, scaleY, 0.2);

    },

    updateHighlight(){
      this.highlight.visible = true;
      this.highlight.position.copy(this.group.position);
      this.highlight.scale.x = Math.abs(this.helper.box.max.x) + Math.abs(this.helper.box.min.x);
      this.highlight.position.x += this.highlight.scale.x/2;
      this.highlight.scale.y = Math.abs(this.helper.box.max.y) + Math.abs(this.helper.box.min.y);
      this.highlight.position.y -= this.highlight.scale.y/2;
      this.highlight.position.z -= 2;
    },

    update(){

      this.helper.position.copy(this.group.position);
      this.helper.position.z = -1;
      this.helper.update();

      this.updateCursor();

      let centerX = (( this.helper.box.max.x + this.helper.box.min.x ))/2;
      let centerY = (( this.helper.box.max.y + this.helper.box.min.y ))/1.5;


      this.group.position.x = ease(this.group.position.x, (- this.offsetX) - centerX, 0.05);
      this.group.position.y = ease(this.group.position.y, -this.offsetY - centerY, 0.05);
      this.group.position.z = ease(this.group.position.z, -this.characters.length / 2, 0.05);

    }
  }
});

/*////////////////////////////////////////*/

