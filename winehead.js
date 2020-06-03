// THREEJS RELATED VARIABLES
let scene, renderer, camera;

// 3D Models
let ground, world, disk;
let vel = 0;
let bootle

// Directional light movement
let lightParams = {
    object: null,
    helper: null,
    curve: null,
    position: 0,
    
};

window.onload = function init() {
    // set up the scene, the camera and the renderer
   // create an empty scene, that will hold all our elements such as objects, cameras and lights
    scene = new THREE.Scene();

    // create a camera, which defines where we're looking at
    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
  
    // position the camera
    camera.position.x = 0;
    camera.position.z = 50; //ALTERED: change from Z=2000 to Z=200
    camera.position.y = 120;

   
    // create a render and set the size
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // configure renderer clear color
    renderer.setClearColor("#01142F");

    // add the output of the renderer to the DIV with id "world"
    document.getElementById('world').appendChild(renderer.domElement);

    // listen to the screen: if the user resizes it we have to update the camera and the renderer size
    window.addEventListener('resize', handleWindowResize, false);

    scene.fog = new THREE.Fog(0xffffff, 100);


    // add the lights createLights();
    createLights()

    // add the objects
    createground();

    // add the bottle
    createBottle();

    // start a loop that will update the objects' positions 
    // and render the scene on each frame
    animate();

    document.addEventListener("keydown", doKey);
    document.addEventListener("keyup", doKeyUp);


    

}

//INIT THREE JS, SCREEN, SCENE, CAMERA AND MOUSE EVENTS
function createScene() {
    
    
   
}

function handleWindowResize() {
    // update height and width of the renderer and the camera
    const HEIGHT = window.innerHeight;
    const WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

function createLights() {
        // A hemisphere light is a gradient colored light 
    // Parameters: sky color, ground color, intensity of the light
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
    scene.add(hemisphereLight);

    // A directional light shines from a specific direction. 
    // It acts like the sun, that means that all the rays produced are parallel.
    lightParams.object = new THREE.DirectionalLight(0xffffff, .9);
    lightParams.object.position.set(130, 130, 50);

    /**************
     * SHADOWS
     **************/
    lightParams.object.castShadow = true;
    // define the visible area of the projected shadow
    lightParams.object.shadow.camera.left = -50;
    lightParams.object.shadow.camera.right = 50;
    lightParams.object.shadow.camera.top = 50;
    lightParams.object.shadow.camera.bottom = -50;


    // to activate the lights, just add them to the scene
    scene.add(lightParams.object);

   

    //HELPER to visualize the SHADOW area of influence
  

    
}



function createBottle(){

    //criação da garrafa
    bootle = new THREE.Object3D();

    var bootleMaterial = new THREE.MeshPhongMaterial( {color: 0x008080} );

    var geometryBase = new THREE.CylinderGeometry( 5, 5, 20, 32 );
    var bootleBase= new THREE.Mesh( geometryBase, bootleMaterial );
    bootleBase.position.set(0,120,-300)

    var geometryNeck = new THREE.CylinderGeometry( 2, 2, 20, 32 );
    var bootleNeck = new THREE.Mesh( geometryNeck, bootleMaterial );
    bootleNeck.position.set(0,128,-300)

    var geometryLid = new THREE.CylinderGeometry( 4, 4, 3, 32 );
    var bootleLid = new THREE.Mesh( geometryLid, bootleMaterial );
    bootleLid.position.set(0,139,-300)


    bootle.add( bootleBase, bootleNeck, bootleLid );

    scene.add( bootle );
    // bootle.rotation.z = Math.PI

    let arm = new THREE.Object3D();
    arm.rotation.set(0,0,0)
    arm.position.set(0,0,0)


    var armMaterial = new THREE.MeshPhongMaterial( {color: 0xffffff} );


    var geometry13 = new THREE.CylinderGeometry( 1.4, 1.2, 8, 8 );
    var cylinder13 = new THREE.Mesh( geometry13, armMaterial );
    cylinder13.position.set(3,122,-290)
    cylinder13.rotation.set(0,0,120)
    arm.add( cylinder13 );
  
    var geometry14 = new THREE.CylinderGeometry( 1.1, 1, 9, 9 );
    var cylinder14 = new THREE.Mesh( geometry14, armMaterial );
    cylinder13.add( cylinder14 );
    cylinder14.position.set(3.3,-3,0)
    cylinder14.rotation.set(0,0,30)


    bootle.add( arm );




}




function createground() {

    // create the geometry (shape) of the cylinder: radius top, radius bottom, height, number of segments on the radius, number of segments vertically
    let geometry = new THREE.CylinderGeometry(600, 600, 800, 300, 50);
    // rotate the geometry on the x axis (alters the vertices coordinates, DOES NOT alter the mesh axis coordinates )
    geometry.rotateX(-Math.PI / 2);

    // create the material
    let material = new THREE.MeshPhongMaterial({ color: 0x808080, transparent: true, opacity: 1, flatShading: true, wireframe: false }); //ALTERED: change wireframe=true to wireframe=false

    // create the mesh: geometry + material
    ground = new THREE.Mesh(geometry, material); // creates picket mesh

    // push it a little bit at the bottom of the scene
    ground.position.y = -500;

    
    var geometry2= new THREE.CircleBufferGeometry( 500, 80 );
    var material2 = new THREE.MeshBasicMaterial( { color: 0x696969, transparent: true, opacity: 1, side: THREE.DoubleSide } );
    disk = new THREE.Mesh( geometry2, material2 );
    scene.add( disk );  

    disk.position.z = -400;



    var geometry3= new THREE.PlaneGeometry( 100, 100 );
    var material3 = new THREE.MeshBasicMaterial( { color: 0x01142F, side: THREE.DoubleSide } );
    let window = new THREE.Mesh( geometry3, material3 );
    disk.add( window ); 
    window.position.set(250,0,0.1)

    var geometry4= new THREE.PlaneGeometry( 100, 100 );
    var material4 = new THREE.MeshBasicMaterial( { color: 0x01142F, side: THREE.DoubleSide } );
    let window2 = new THREE.Mesh( geometry4, material4 );
    disk.add( window2 );  
    window2.position.set(-250,0,0.1)

    
    
    var geometry5= new THREE.PlaneGeometry( 100, 100 );
    var material5 = new THREE.MeshBasicMaterial( { color: 0x01142F, side: THREE.DoubleSide } );
    let window3 = new THREE.Mesh( geometry5, material5 );
    disk.add( window3 );  
    window3.position.set(0,250,0.1)



    var geometry6= new THREE.PlaneGeometry( 100, 100 );
    var material6 = new THREE.MeshBasicMaterial( { color: 0x01142F, side: THREE.DoubleSide } );
    let window4 = new THREE.Mesh( geometry6, material6 );
    disk.add( window4 );  
    window4.position.set(0,-250,0.1)

    let axes = new THREE.AxesHelper(600);
    ground.add(axes)

    console.log("ground created")
    scene.add(ground);
}





function animate() {
    ground.rotation.z += 0.003;
    disk.rotation.z += 0.003;
    // pivot.rotation.z += 0.003;




    // render
    renderer.render(scene, camera);
    


    requestAnimationFrame(animate);
}


// key handling
function doKey(event) {
    let key = event.key;
    if (key == "z") {
        bootle.position.y += 50
    }
    if (key == "x") {
        bootle.position.y -= 10

    }
}

// key handling
function doKeyUp(event) {
    let key = event.key;
    if (key == "z") {
        bootle.position.y -= 50

    }
    if (key == "x") {
        bootle.position.y += 10
    }
}
   
