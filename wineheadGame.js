// THREEJS RELATED VARIABLES
let scene, renderer, camera;

// 3D Models
let ground, bottleBase, arm, disk, obstacle;
let vel = 0;

// Directional light movement
let lightParams = {
    object: null,
    helper: null,
    curve: null,
    position: 0,

};

window.onload = function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#01142F");
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 5000);

    camera.position.set(0, 20, 200)

    let controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', function () {
        renderer.render(scene, camera);
    });

    window.addEventListener('resize', handleWindowResize, false);

    scene.fog = new THREE.Fog(0xffffff, 100);

    createLights()

    createground();

    createBottle();

    createObstacles();

    animate();


    document.addEventListener("keydown", doKey);
    document.addEventListener("keyup", doKeyUp);

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
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);
    scene.add(hemisphereLight);
    lightParams.object = new THREE.DirectionalLight(0xffffff, .9);
    lightParams.object.position.set(0, 50, 50);
    lightParams.object.castShadow = true;
    lightParams.object.shadow.camera.left = -50;
    lightParams.object.shadow.camera.right = 50;
    lightParams.object.shadow.camera.top = 50;
    lightParams.object.shadow.camera.bottom = -50;
    scene.add(lightParams.object);
}

function createObstacles() {
    obstacles = new THREE.Object3D();
    obstacles.position.y = 0;
    const obstacleGeometry = new THREE.CylinderGeometry(3, 3, 40, 90);
    const obstacleMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000
    });
    let numObs = 6
    const stepAngle1 = Math.PI * 2 / numObs;
    for (let i = 0; i < numObs; i++) {
        let claw = new THREE.Object3D();
        for (let j = 0; j < 1; j++) {
            let m = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
            m.position.x = j * 10;
            m.position.y = 15;
            m.position.z = 50;
            claw.add(m);
            let mtlClaw = new THREE.MTLLoader();
            mtlClaw.load('./models/claw.mtl', function (materials) {
                materials.preload();
                let loader = new THREE.OBJLoader();
                loader.setMaterials(materials);
                loader.load('./models/claw.obj', function (object) {
                    obstacle = object;
                    obstacle.scale.set(0.3, 0.3, 0.3);
                    obstacle.position.set(-0.6, -4, 50.3)
                    obstacle.rotation.set(Math.PI, 0, 0)
                    obstacle.castShadow = true;
                    claw.add(obstacle)
                });

            });
        }
        let a = stepAngle1 * i;
        let h = 120
        claw.position.y = Math.sin(a) * h;
        claw.position.x = Math.cos(a) * h;
        claw.rotation.z = a + Math.PI / 2;
        ground.add(claw);



        
    }
    const stepAngle = Math.PI *2 /numObs;
    for (let i = 0; i < numObs; i++) {
        let claw2 = new THREE.Object3D();
        for (let j = 0; j < 1; j++) {
            let m2 = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
            m2.position.x = j * 10;
            m2.position.y = -30;
            m2.position.z = 50;
            claw2.add(m2);
            let mtlClaw2 = new THREE.MTLLoader();
            mtlClaw2.load('./models/claw.mtl', function (materials) {
                materials.preload();
                let loader2 = new THREE.OBJLoader();
                loader2.setMaterials(materials);
                loader2.load('./models/claw.obj', function (object) {
                    obstacle2 = object;
                    obstacle2.scale.set(0.3, 0.3, 0.3);
                    obstacle2.position.set(-0.6, -12, 50.3)
                    obstacle2.rotation.set(0, 0, 0)
                    obstacle2.castShadow = true;
                    claw2.add(obstacle2)
                });

            });
        }
        let a = stepAngle * i+10;
        let h = 120
        claw2.position.y = Math.sin(a) * h;
        claw2.position.x = Math.cos(a) * h;
        claw2.rotation.z = a + Math.PI / 2;
        
        ground.add(claw2);



        
    }


    scene.add(obstacles);

}

function createBottle() {

    // -------------------------- GARRAFA -------------------------------------------------------------------------------   

    var bottleMaterial = new THREE.MeshPhongMaterial({
        color: 0x008080
    });

    var geometryBase = new THREE.CylinderGeometry(3, 3, 10, 32);
    bottleBase = new THREE.Mesh(geometryBase, bottleMaterial);
    bottleBase.position.set(0, 20, 50)

    var geometryNeck = new THREE.CylinderGeometry(1, 3, 3, 32);
    var bottleNeck = new THREE.Mesh(geometryNeck, bottleMaterial);
    bottleNeck.position.set(0, 6.5, 0)
    bottleBase.add(bottleNeck)

    var geometryNeck2 = new THREE.CylinderGeometry(1, 1, 3, 32);
    var bottleNeck2 = new THREE.Mesh(geometryNeck2, bottleMaterial);
    bottleNeck2.position.set(0, 3, 0)
    bottleNeck.add(bottleNeck2)

    var geometryLid = new THREE.CylinderGeometry(1.4, 1.4, 1, 32);
    var bottleLid = new THREE.Mesh(geometryLid, bottleMaterial);
    bottleLid.position.set(0, 1.5, 0)
    bottleNeck2.add(bottleLid)


    scene.add(bottleBase);

    // -------------------------- BRAÇOS -------------------------------------------------------------------------------   
    // -----------------------------------------------------------------------------------------------------------------   
    // -------------------------- BRAÇO-1 ------------------------------------------------------------------------------   

    arm = new THREE.Object3D();
    arm.position.set(0, 3.5, 4)
    var armMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff
    });
    bottleBase.add(arm);

    var upperArmGeo = new THREE.CylinderGeometry(1, 1, 6, 8);
    var upperArm = new THREE.Mesh(upperArmGeo, armMaterial);
    upperArm.position.set(0, -2, 0)
    arm.add(upperArm);

    var LowerArmGeo = new THREE.CylinderGeometry(1, 1, 5, 8);
    var lowerArm = new THREE.Mesh(LowerArmGeo, armMaterial);
    lowerArm.position.set(1.6, -3.6, 0)
    lowerArm.rotation.set(0, 0, 45)
    upperArm.add(lowerArm);

    // -------------------------- BRAÇO-2 -------------------------------------------------------------------------------   

    arm2 = new THREE.Object3D();
    arm2.position.set(0, 3.5, -4)
    bottleBase.add(arm2);

    var upperArm2 = new THREE.Mesh(upperArmGeo, armMaterial);
    upperArm2.position.set(0, -2, 0)
    arm2.add(upperArm2);

    var lowerArm2 = new THREE.Mesh(LowerArmGeo, armMaterial);
    lowerArm2.position.set(1.6, -3.6, 0)
    lowerArm2.rotation.set(0, 0, 45)
    upperArm2.add(lowerArm2);

    // let axes = new THREE.AxesHelper(600);
    // arm2.add(axes)
}




function createground() {

    let geometry = new THREE.CylinderGeometry(100, 100, 200, 300);
    geometry.rotateX(-Math.PI / 2);
    let material = new THREE.MeshPhongMaterial({
        color: 0xab9383,
        transparent: true,
        opacity: 1,
        flatShading: true,
        wireframe: false
    }); //ALTERED: change wireframe=true to wireframe=false
    ground = new THREE.Mesh(geometry, material);
    ground.position.y = -90;
    ground.castShadow = true;

    scene.add(ground)

    var geometry2 = new THREE.CircleBufferGeometry(200, 80);
    var material2 = new THREE.MeshBasicMaterial({
        color: 0x808080,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide
    });
    disk = new THREE.Mesh(geometry2, material2);
    disk.position.set(0, 0, -20)
    ground.add(disk);




    windows = new THREE.Object3D();
    windows.position.y = 0;
    const geometry33 = new THREE.PlaneGeometry(50, 50);
    let starMap = new THREE.TextureLoader().load('images/stars.png');
    let starMaterial = new THREE.MeshPhongMaterial({
        map: starMap,
        transparent: true
    });
    const geometry332 = new THREE.PlaneGeometry(53, 53);
    const frameMaterial = new THREE.MeshPhongMaterial({
        color: 0x582812
    });
    const geometry3322 = new THREE.PlaneGeometry(2, 52);
    const geometry3323 = new THREE.PlaneGeometry(52, 2);
    let numWindows = 6
    const stepAngle = Math.PI * 2 / numWindows;
    for (let i = 0; i < numWindows; i++) {
        let window = new THREE.Object3D();
        for (let j = 0; j < 1; j++) {
            let stars = new THREE.Mesh(geometry33, starMaterial);
            let frame1 = new THREE.Mesh(geometry332, frameMaterial);
            let frame2 = new THREE.Mesh(geometry3322, frameMaterial);
            let frame3 = new THREE.Mesh(geometry3323, frameMaterial);
            stars.position.set(j * 10,10,0.1)
            frame1.position.set(j * 10,10,0.05)
            frame2.position.set(j * 10,10,0.2)
            frame3.position.set(j * 10,10,0.2)
            window.add(stars, frame1, frame2, frame3);
        }
        let a = stepAngle * i;
        window.position.y = Math.sin(a) * 150;
        window.position.x = Math.cos(a) * 150;
        window.rotation.z = a + Math.PI / 2;
        disk.add(window);
    }
    scene.add(windows);

}





function animate() {
    ground.rotation.z += 0.005;
    arm.rotation.z == 0
    arm.rotation.z += -0.03
    if (arm.rotation.z <= 2 * Math.PI / 45) {
        arm.rotation.z += 1.7
    }
    if (arm.rotation.z >= 2 * Math.PI / -45) {
        arm.rotation.z -= 0.03
    }

    arm2.rotation.z == 0
    arm2.rotation.z += -0.03
    if (arm2.rotation.z <= 2 * Math.PI / 45) {
        arm2.rotation.z += 1.7
    }
    if (arm2.rotation.z >= 2 * Math.PI / -45) {

        arm2.rotation.z -= 0.03
    }


    // render
    renderer.render(scene, camera);



    requestAnimationFrame(animate);
}


// key handling
function doKey(event) {
    let key = event.key;
    if (key == "z") {
        bottleBase.position.y = 50
    }
    if (key == "x") {
        bottleBase.position.y = 20
        bottleBase.rotation.z = Math.PI / 2

    }

}

// key handling
function doKeyUp(event) {
    let key = event.key;
    if (key == "z") {
        bottleBase.position.y = 20

    }
    if (key == "x") {
        bottleBase.position.y = 20
        bottleBase.rotation.z = 0

    }
}