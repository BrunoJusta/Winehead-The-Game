// ------------------------------------ Variables ------------------------------- 
// ------------------------------------------------------------------------------
let scene, renderer, camera;
let ground, bottleBase, bottleSpiritBase, wall, obstacle, obstacles, lamps = [];
let armSpeed = 0.08
let legSpeed = 0.08
let ObstacleMove = 0.008
let rotationSpeed = 0.007
let speedTXT = 1
let lapTXT = 1
let scoreTXT = 0
let lives = 3
let hemisphereLight
let pause = false

// ------------------------------ Materials ------------------------------------- 
// ------------------------------------------------------------------------------
var bottleMaterial = new THREE.MeshPhongMaterial({
    color: 0x3a88d2,
    transparent: true,
    opacity: 0.95
});
var spiritWhiteMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0
});
var spiritRedMaterial = new THREE.MeshPhongMaterial({
    color: 0xF93943,
    transparent: true,
    opacity: 0,
});
var spiritEyesMaterial = new THREE.MeshPhongMaterial({
    color: 0xffd62a,
    transparent: true,
    opacity: 0,
});
var bottleSpiritMaterial = new THREE.MeshPhongMaterial({
    color: 0x3a88d2,
    transparent: true,
    opacity: 0,
});
var ceilingMaterial = new THREE.MeshBasicMaterial({
    color: 0X2F3A54,
    side: THREE.DoubleSide
});
var wallMaterial = new THREE.MeshBasicMaterial({
    color: 0x374058,
    side: THREE.DoubleSide
});

window.onload = function init() {

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor("#01142F");
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 5000);

    camera.position.set(0, 30, 220)

    // let controls = new THREE.OrbitControls(camera);
    // controls.addEventListener('change', function () {
    //     renderer.render(scene, camera);
    // });

    window.addEventListener('resize', handleWindowResize, false);

    scene.fog = new THREE.Fog(0xffffff, 100);

    createLights();

    createRoom();

    createLamps();

    createObstacles();

    createBottle();

    createBottleSpirit();

    document.addEventListener("keydown", doKey);
    document.addEventListener("keyup", doKeyUp);

    animate();

}

function handleWindowResize() {

    const HEIGHT = window.innerHeight;
    const WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();

}


// -------------------------- Create Objects Functions -------------------------- 
// ------------------------------------------------------------------------------

function createLights() {

    hemisphereLight = new THREE.HemisphereLight(0xffffff, 0.8);
    hemisphereLight.intensity = 1
    scene.add(hemisphereLight)

}

function createRoom() {

    // -------------------------- Ground -------------------------- 
    let groundGeometry = new THREE.CylinderGeometry(100, 100, 200, 300);
    groundGeometry.rotateX(-Math.PI / 2);
    let groundMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888,
    });
    ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = -90;
    ground.castShadow = true;
    ground.receiveShadow = true
    scene.add(ground)

    // -------------------------- Walls -------------------------- 
    var wallGeometry = new THREE.CircleBufferGeometry(200, 80);
    wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.set(0, 0, -20)
    ground.add(wall);

    // -------------------------- Ceiling -------------------------- 
    var ceilingGeometry = new THREE.CylinderGeometry(200, 200, 200, 80, 80, true);
    ceilingGeometry.rotateX(-Math.PI / 2);
    ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ground.add(ceiling);

    // -------------------------- Windows -------------------------- 
    windows = new THREE.Object3D();
    let starMap = new THREE.TextureLoader().load('images/stars.png');
    let starMaterial = new THREE.MeshPhongMaterial({
        map: starMap,
        transparent: true
    });
    windows.position.y = 0;
    const windowGeometry = new THREE.PlaneGeometry(50, 50);
    const frame1Geometry = new THREE.PlaneGeometry(53, 53);
    const frame2Geometry = new THREE.PlaneGeometry(2, 52);
    const frame3Geometry = new THREE.PlaneGeometry(52, 2);
    let woodMap = new THREE.TextureLoader().load('images/wood.jpg');
    let woodMaterial = new THREE.MeshPhongMaterial({
        map: woodMap,
        transparent: true
    });
    let numWindows = 6
    const stepAngle = Math.PI * 2 / numWindows;
    for (let i = 0; i < numWindows; i++) {
        let window = new THREE.Object3D();
        for (let j = 0; j < 1; j++) {
            let stars = new THREE.Mesh(windowGeometry, starMaterial);
            let frame1 = new THREE.Mesh(frame1Geometry, woodMaterial);
            let frame2 = new THREE.Mesh(frame2Geometry, woodMaterial);
            let frame3 = new THREE.Mesh(frame3Geometry, woodMaterial);
            stars.position.set(j * 10, 10, 0.1)
            frame1.position.set(j * 10, 10, 0.05)
            frame2.position.set(j * 10, 10, 0.2)
            frame3.position.set(j * 10, 10, 0.2)
            window.add(stars, frame1, frame2, frame3);
        }
        let a = stepAngle * i;
        window.position.y = Math.sin(a) * 150;
        window.position.x = Math.cos(a) * 150;
        window.rotation.z = a + Math.PI / 2;
        wall.add(window);
    }

    // -------------------------- Paintings -------------------------- 
    let numPaintings = 6
    const paintGeometry = new THREE.PlaneGeometry(20, 30);

    let paintMap = new THREE.TextureLoader().load('images/paint.jpg');
    let paintMaterial = new THREE.MeshPhongMaterial({
        map: paintMap,
        transparent: true
    });

    let paintMap2 = new THREE.TextureLoader().load('images/paint2.jpg');
    let paintMaterial2 = new THREE.MeshPhongMaterial({
        map: paintMap2,
        transparent: true
    });

    const stepAngle2 = Math.PI * 2 / numPaintings;
    for (let i = 0; i < numPaintings; i++) {
        let painting = new THREE.Object3D();
        for (let j = 0; j < 1; j++) {
            if (i % 2 == 0) {
                let paint = new THREE.Mesh(paintGeometry, paintMaterial);
                paint.position.set(j * 10, 10, 0.1)
                painting.add(paint);
            } else {
                let paint = new THREE.Mesh(paintGeometry, paintMaterial2);
                paint.position.set(j * 10, 10, 0.1)
                painting.add(paint);
            }
        }
        let a = stepAngle2 * i + 10;
        painting.position.y = Math.sin(a) * 150;
        painting.position.x = Math.cos(a) * 150;
        painting.rotation.z = a + Math.PI / 2;
        wall.add(painting);
    }
    scene.add(windows);

}

function createLamps() {

    // -------------------------- Lamps Abajur -------------------------- 
    const lampGeometry = new THREE.CylinderGeometry(4, 1, 10, 90);
    const lampMaterial = new THREE.MeshPhongMaterial({
        color: 0x989898
    });

    // -------------------------- Lamps Support -------------------------- 
    const lamp2Geometry = new THREE.CylinderGeometry(0.5, 0.5, 50, 90);
    const lamp2Material = new THREE.MeshPhongMaterial({
        color: 0x1B2845
    });

    let numObs = 12
    const stepAngle1 = Math.PI * 2 / numObs;
    for (let i = 0; i < numObs; i++) {
        let lamp = new THREE.Object3D();
        let spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(0, -50, 50);
        spotLight.castShadow = true;
        spotLight.distance = 300;
        spotLight.angle = 0.2
        spotLight.target = ground
        spotLight.intensity = 0.8
        spotLight.penumbra = 0.4
        for (let j = 0; j < 1; j++) {
            let m = new THREE.Mesh(lampGeometry, lampMaterial);
            let m2 = new THREE.Mesh(lamp2Geometry, lamp2Material);
            m.position.x = j * 10;
            m.position.y = -40;
            m.position.z = 50;
            m2.position.y = -21;
            m.add(spotLight, m2);
            lamp.add(m);
        }
        let a = stepAngle1 * i + 5;
        let h = 120
        lamp.position.y = Math.sin(a) * h;
        lamp.position.x = Math.cos(a) * h;
        lamp.rotation.z = a + Math.PI / 2;
        lamp.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        ground.add(lamp);
        lamps.push(lamp)
    }

}

function createObstacles() {

    obstacles = new THREE.Object3D();
    obstacles.position.y = -100;
    const obstacleGeometry = new THREE.CylinderGeometry(3, 3, 40, 90);

    // -------------------------- Obstacles textures -------------------------- 
    let machineMap = new THREE.TextureLoader().load('images/machine.jpg');
    let machineMaterial = new THREE.MeshPhongMaterial({
        map: machineMap,
        transparent: true
    });
    machineMap.wrapS = THREE.RepeatWrapping;
    machineMap.wrapT = THREE.RepeatWrapping;
    machineMap.repeat.set(1, 2);


    let machineMap2 = new THREE.TextureLoader().load('images/machine.jpg');
    let machineMaterial2 = new THREE.MeshPhongMaterial({
        map: machineMap2,
        transparent: true
    });
    machineMap2.wrapS = THREE.RepeatWrapping;
    machineMap2.wrapT = THREE.RepeatWrapping;
    machineMap2.repeat.set(1, 3);

    // -------------------------- Obstacles floor -------------------------- 
    let numObs = 6
    const stepAngle1 = Math.PI * 2 / numObs;
    for (let i = 0; i < numObs; i++) {
        let claw = new THREE.Object3D();
        for (let j = 0; j < 1; j++) {
            let m = new THREE.Mesh(obstacleGeometry, machineMaterial);
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
        claw.castShadow = true
        obstacles.add(claw);

    }

    // -------------------------- Obstacles ceiling -------------------------- 
    const obstacleGeometry2 = new THREE.CylinderGeometry(3, 3, 40, 90);
    const obstacleGeometry22 = new THREE.CylinderGeometry(3, 3, 80, 90);
    const stepAngle = Math.PI * 2 / numObs;
    for (let i = 0; i < numObs; i++) {
        let claw2 = new THREE.Object3D();
        for (let j = 0; j < 1; j++) {
            let m2 = new THREE.Mesh(obstacleGeometry2, machineMaterial);
            let m3 = new THREE.Mesh(obstacleGeometry22, machineMaterial2);
            m3.rotateX(-Math.PI / 2);
            m3.position.z = 10;
            m3.position.y = -47;
            m2.position.x = j * 10;
            m2.position.y = -30;
            m2.position.z = 50;
            claw2.add(m2, m3);
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
        let a = stepAngle * i + 10;
        let h = 130
        claw2.position.y = Math.sin(a) * h;
        claw2.position.x = Math.cos(a) * h;
        claw2.rotation.z = a + Math.PI / 2;
        claw2.castShadow = true
        obstacles.add(claw2);
    }

    obstacles.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    scene.add(obstacles);

}

function createBottle() {

    // -------------------------- GARRAFA -------------------------------------------------------------------------------   
    var geometryBase = new THREE.CylinderGeometry(3, 3, 10, 32);
    bottleBase = new THREE.Mesh(geometryBase, bottleMaterial);
    bottleBase.position.set(0, 22, 50)

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

    bottleBase.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    scene.add(bottleBase);

    // -------------------------- OLHOS ------------------------------------------------------------------------------   
    var eyesMaterial = new THREE.MeshPhongMaterial({
        color: 0xffd62a
    });
    var geometryEye = new THREE.BoxGeometry(0.1, 3, 0.5);
    var eye = new THREE.Mesh(geometryEye, eyesMaterial);
    eye.position.set(3, 4, 2)
    eye.rotateX(2.3)

    var eye2 = new THREE.Mesh(geometryEye, eyesMaterial);
    eye2.position.set(3, 4, 2)
    eye2.rotateX(-2.3)

    var eye3 = new THREE.Mesh(geometryEye, eyesMaterial);
    eye3.position.set(3, 4, -2)
    eye3.rotateX(2.3)

    var eye4 = new THREE.Mesh(geometryEye, eyesMaterial);
    eye4.position.set(3, 4, -2)
    eye4.rotateX(-2.3)

    bottleBase.add(eye, eye2, eye3, eye4)

    // -------------------------- BRAÇO-1 ------------------------------------------------------------------------------   
    arm = new THREE.Object3D();
    arm.position.set(0, 3.5, 3)
    bottleBase.add(arm);
    var whiteMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff
    });
    bottleBase.add(arm);
    var redMaterial = new THREE.MeshPhongMaterial({
        color: 0xF93943
    });
    bottleBase.add(arm);

    var upperArmGeo = new THREE.CylinderGeometry(1, 1, 4, 10);
    var upperArm = new THREE.Mesh(upperArmGeo, bottleMaterial);
    upperArm.position.set(0, -2, 0)
    arm.add(upperArm);

    var LowerArmGeo = new THREE.CylinderGeometry(0.9, 0.9, 5, 10);
    var lowerArm = new THREE.Mesh(LowerArmGeo, bottleMaterial);
    lowerArm.position.set(1.8, -2.7, 0)
    lowerArm.rotation.set(0, 0, 45)
    upperArm.add(lowerArm);

    var handGeo = new THREE.SphereGeometry(1.5, 5, 10);
    var hand = new THREE.Mesh(handGeo, whiteMaterial);
    hand.position.set(0, -2.7, 0)
    hand.rotation.set(0, 0, 45)
    lowerArm.add(hand);

    // -------------------------- BRAÇO-2 -------------------------------------------------------------------------------   
    arm2 = new THREE.Object3D();
    arm2.position.set(0, 3.5, -3)
    bottleBase.add(arm2);

    var upperArm2 = new THREE.Mesh(upperArmGeo, bottleMaterial);
    upperArm2.position.set(0, -2, 0)
    arm2.add(upperArm2);

    var lowerArm2 = new THREE.Mesh(LowerArmGeo, bottleMaterial);
    lowerArm2.position.set(1.8, -2.7, 0)
    lowerArm2.rotation.set(0, 0, 45)
    upperArm2.add(lowerArm2);

    var hand2 = new THREE.Mesh(handGeo, whiteMaterial);
    hand2.position.set(0, -2.7, 0)
    hand2.rotation.set(0, 0, 45)
    lowerArm2.add(hand2);

    arm.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    arm2.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    // -------------------------- PERNA-1 ------------------------------------------------------------------------------   
    leg = new THREE.Object3D();
    leg.position.set(0, -5.3, 2.5)
    bottleBase.add(leg);

    var upperLegGeo = new THREE.CylinderGeometry(1, 1, 5, 10);
    var upperLeg = new THREE.Mesh(upperLegGeo, bottleMaterial);
    upperLeg.position.set(1, 0, 0)
    upperLeg.rotation.set(0, 0, 45)
    leg.add(upperLeg);

    var LowerLegGeo = new THREE.CylinderGeometry(0.8, 0.9, 5, 10);
    var lowerLeg = new THREE.Mesh(LowerLegGeo, bottleMaterial);
    lowerLeg.position.set(-2, -2.7, 0)
    lowerLeg.rotation.set(0, 0, 8)
    upperLeg.add(lowerLeg);

    var footGeo = new THREE.CylinderGeometry(1, 1, 3, 10);
    var foot = new THREE.Mesh(footGeo, redMaterial);
    foot.position.set(-0.6, 2, 0)
    foot.rotation.set(0, 0, 8)
    lowerLeg.add(foot);

    // -------------------------- PERNA-2 -------------------------------------------------------------------------------   
    leg2 = new THREE.Object3D();
    leg2.position.set(0, -5.3, -2.5)
    bottleBase.add(leg2);

    var upperLeg2 = new THREE.Mesh(upperLegGeo, bottleMaterial);
    upperLeg2.position.set(1, 0, 0)
    upperLeg2.rotation.set(0, 0, 45)
    leg2.add(upperLeg2);

    var lowerLeg2 = new THREE.Mesh(LowerLegGeo, bottleMaterial);
    lowerLeg2.position.set(-2, -2.7, 0)
    lowerLeg2.rotation.set(0, 0, 8)
    upperLeg2.add(lowerLeg2);

    var foot2 = new THREE.Mesh(footGeo, redMaterial);
    foot2.position.set(-0.6, 2, 0)
    foot2.rotation.set(0, 0, 8)
    lowerLeg2.add(foot2);

    leg.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    leg2.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

}

function createBottleSpirit() {

    // -------------------------- GARRAFA -------------------------------------------------------------------------------   
    var geometryBase = new THREE.CylinderGeometry(3, 3, 10, 32);
    bottleSpiritBase = new THREE.Mesh(geometryBase, bottleSpiritMaterial);
    bottleSpiritBase.position.set(0, 22, 50)

    var geometryNeck = new THREE.CylinderGeometry(1, 3, 3, 32);
    var bottleNeck = new THREE.Mesh(geometryNeck, bottleSpiritMaterial);
    bottleNeck.position.set(0, 6.5, 0)
    bottleSpiritBase.add(bottleNeck)

    var geometryNeck2 = new THREE.CylinderGeometry(1, 1, 3, 32);
    var bottleNeck2 = new THREE.Mesh(geometryNeck2, bottleSpiritMaterial);
    bottleNeck2.position.set(0, 3, 0)
    bottleNeck.add(bottleNeck2)

    var geometryLid = new THREE.CylinderGeometry(1.4, 1.4, 1, 32);
    var bottleLid = new THREE.Mesh(geometryLid, bottleSpiritMaterial);
    bottleLid.position.set(0, 1.5, 0)
    bottleNeck2.add(bottleLid)


    scene.add(bottleSpiritBase);
    bottleSpiritBase.rotation.z = Math.PI / 2
    bottleSpiritBase.position.y = 13
    bottleSpiritBase.position.z = 40


    // -------------------------- OLHOS ------------------------------------------------------------------------------   
    var geometryEye = new THREE.BoxGeometry(0.1, 3, 0.5);
    var eye = new THREE.Mesh(geometryEye, spiritEyesMaterial);
    eye.position.set(3, 4, 2)
    eye.rotateX(2.3)

    var eye2 = new THREE.Mesh(geometryEye, spiritEyesMaterial);
    eye2.position.set(3, 4, 2)
    eye2.rotateX(-2.3)

    var eye3 = new THREE.Mesh(geometryEye, spiritEyesMaterial);
    eye3.position.set(3, 4, -2)
    eye3.rotateX(2.3)

    var eye4 = new THREE.Mesh(geometryEye, spiritEyesMaterial);
    eye4.position.set(3, 4, -2)
    eye4.rotateX(-2.3)

    bottleSpiritBase.add(eye, eye2, eye3, eye4)

    // -------------------------- BRAÇO-1 ------------------------------------------------------------------------------   
    arms = new THREE.Object3D();
    arms.position.set(0, 3.5, 3)
    bottleSpiritBase.add(arms);

    bottleSpiritBase.add(arms);

    var upperArmGeo = new THREE.CylinderGeometry(1, 1, 4, 10);
    var upperArm = new THREE.Mesh(upperArmGeo, bottleSpiritMaterial);
    upperArm.position.set(0, -2, 0)
    arms.add(upperArm);

    var LowerArmGeo = new THREE.CylinderGeometry(0.9, 0.9, 5, 10);
    var lowerArm = new THREE.Mesh(LowerArmGeo, bottleSpiritMaterial);
    lowerArm.position.set(1.8, -2.7, 0)
    lowerArm.rotation.set(0, 0, 45)
    upperArm.add(lowerArm);

    var handGeo = new THREE.SphereGeometry(1.5, 5, 10);
    var hand = new THREE.Mesh(handGeo, spiritWhiteMaterial);
    hand.position.set(0, -2.7, 0)
    hand.rotation.set(0, 0, 45)
    lowerArm.add(hand);

    // -------------------------- BRAÇO-2 -------------------------------------------------------------------------------   
    arm2s = new THREE.Object3D();
    arm2s.position.set(0, 3.5, -3)
    bottleSpiritBase.add(arm2s);

    var upperArm2 = new THREE.Mesh(upperArmGeo, bottleSpiritMaterial);
    upperArm2.position.set(0, -2, 0)
    arm2s.add(upperArm2);

    var lowerArm2 = new THREE.Mesh(LowerArmGeo, bottleSpiritMaterial);
    lowerArm2.position.set(1.8, -2.7, 0)
    lowerArm2.rotation.set(0, 0, 45)
    upperArm2.add(lowerArm2);

    var hand2 = new THREE.Mesh(handGeo, spiritWhiteMaterial);
    hand2.position.set(0, -2.7, 0)
    hand2.rotation.set(0, 0, 45)
    lowerArm2.add(hand2);

    // -------------------------- PERNA-1 ------------------------------------------------------------------------------   
    legs = new THREE.Object3D();
    legs.position.set(0, -5.3, 2.5)
    bottleSpiritBase.add(legs);

    var upperLegGeo = new THREE.CylinderGeometry(1, 1, 5, 10);
    var upperLeg = new THREE.Mesh(upperLegGeo, bottleSpiritMaterial);
    upperLeg.position.set(1, 0, 0)
    upperLeg.rotation.set(0, 0, 45)
    legs.add(upperLeg);

    var LowerLegGeo = new THREE.CylinderGeometry(0.8, 0.9, 5, 10);
    var lowerLeg = new THREE.Mesh(LowerLegGeo, bottleSpiritMaterial);
    lowerLeg.position.set(-2, -2.7, 0)
    lowerLeg.rotation.set(0, 0, 8)
    upperLeg.add(lowerLeg);

    var footGeo = new THREE.CylinderGeometry(1, 1, 3, 10);
    var foot = new THREE.Mesh(footGeo, spiritRedMaterial);
    foot.position.set(-0.6, 2, 0)
    foot.rotation.set(0, 0, 8)
    lowerLeg.add(foot);

    // -------------------------- PERNA-2 -------------------------------------------------------------------------------   
    leg2s = new THREE.Object3D();
    leg2s.position.set(0, -5.3, -2.5)
    bottleSpiritBase.add(leg2s);

    var upperLeg2 = new THREE.Mesh(upperLegGeo, bottleSpiritMaterial);
    upperLeg2.position.set(1, 0, 0)
    upperLeg2.rotation.set(0, 0, 45)
    leg2s.add(upperLeg2);

    var lowerLeg2 = new THREE.Mesh(LowerLegGeo, bottleSpiritMaterial);
    lowerLeg2.position.set(-2, -2.7, 0)
    lowerLeg2.rotation.set(0, 0, 8)
    upperLeg2.add(lowerLeg2);

    var foot2 = new THREE.Mesh(footGeo, spiritRedMaterial);
    foot2.position.set(-0.6, 2, 0)
    foot2.rotation.set(0, 0, 8)
    lowerLeg2.add(foot2);

}


// -------------------------- Animate Objects Functions --------------------------
// ------------------------------------------------------------------------------- 

function WorldRotation(){

    // -------------------------- Rotation Aimation -------------------------- 
    ground.rotation.z += rotationSpeed;
    obstacles.rotation.z += rotationSpeed;

 }
 

function bottleAnimation() {

    // -------------------------- Arm Rotation --------------------------
    arm.rotation.z += armSpeed
    arm2.rotation.z -= armSpeed
    if (arm.rotation.z >= 2 * Math.PI / 4 || arm.rotation.z <= -2 * Math.PI / 4) {
        armSpeed = -armSpeed
    }

    // -------------------------- leg Rotation --------------------------
    leg.rotation.z -= legSpeed
    leg2.rotation.z += legSpeed
    if (leg.rotation.z >= 2 * Math.PI / 4 || leg.rotation.z <= -2 * Math.PI / 4) {
        legSpeed = -legSpeed
    }

}

function clawsAnimation() {

    let clawSpeed = 0.008

    // -------------------------- Obstacles Movment --------------------------
    obstacles.position.y += ObstacleMove
    if (obstacles.position.y <= -100 || obstacles.position.y >= -99) {
        ObstacleMove = -ObstacleMove
    }

    // -------------------------- Claws Movment --------------------------  
    for (let i = 0; i < 6; i++) {

        if (obstacles.children[i].children[1].children[0].rotation.x >= 0.1) {
            obstacles.children[i].children[1].children[0].rotation.x += -0.4
            obstacles.children[i].children[1].children[1].rotation.x += 0.4
            obstacles.children[i].children[1].children[2].rotation.z += 0.4
            obstacles.children[i].children[1].children[3].rotation.z += -0.4
        } else {
            obstacles.children[i].children[1].children[0].rotation.x += clawSpeed
            obstacles.children[i].children[1].children[1].rotation.x += -clawSpeed
            obstacles.children[i].children[1].children[2].rotation.z += -clawSpeed
            obstacles.children[i].children[1].children[3].rotation.z += clawSpeed
        }

    }

    for (let i = 6; i < 12; i++) {

        if (obstacles.children[i].children[2].children[0].rotation.x >= 0.1) {
            obstacles.children[i].children[2].children[0].rotation.x += -0.4
            obstacles.children[i].children[2].children[1].rotation.x += 0.4
            obstacles.children[i].children[2].children[2].rotation.z += 0.4
            obstacles.children[i].children[2].children[3].rotation.z += -0.4
        } else {
            obstacles.children[i].children[2].children[0].rotation.x += clawSpeed
            obstacles.children[i].children[2].children[1].rotation.x += -clawSpeed
            obstacles.children[i].children[2].children[2].rotation.z += -clawSpeed
            obstacles.children[i].children[2].children[3].rotation.z += clawSpeed
        }
    }

}

function bottleSpiritAimation(){

    if (bottleBase.position.y == 13) {
        bottleSpiritBase.position.y += 0.3
        bottleSpiritMaterial.opacity = 0.4
        spiritWhiteMaterial.opacity = 0.4
        spiritRedMaterial.opacity = 0.4
        spiritEyesMaterial.opacity = 0.4
    }

}

// -------------------------- Gameplay Functions -------------------------- 
// ------------------------------------------------------------------------ 


function count() {

    // -------------------------- Count Rotations -------------------------- 
    if (ground.rotation.z >= 6.26) {
        ground.rotation.z = 0
        obstacles.rotation.z = 0
        lapTXT += 1
        if (lapTXT % 2 == 0) {
            if (rotationSpeed <= 0.013) {
                speedTXT += 1
                rotationSpeed = rotationSpeed + 0.002
            }
        }
        if (lapTXT % 3 == 0) {
            hemisphereLight.intensity = 0
            ceilingMaterial.color.setHex(0x000000)
            wallMaterial.color.setHex(0x000000)
        } else if (lapTXT % 3 != 0) {
            hemisphereLight.intensity = 1
            ceilingMaterial.color.setHex(0X2F3A54)
            wallMaterial.color.setHex(0x374058)
        }
        scoreTXT += 100
    }

}

function checkCollisions() {

    // -------------------------- Collisions Ground Obstacles-------------------------- 
    if (bottleBase.position.y >= 22 && bottleBase.position.y <= 49) {
        if (ground.rotation.z >= 0.52 && ground.rotation.z <= 0.53) {
            checkLives()
            changeColor()
            setTimeout(changeColor2, 200);
        }
        if (ground.rotation.z >= 1.55 && ground.rotation.z <= 1.56) {
            checkLives()
            changeColor()
            setTimeout(changeColor2, 200);
        }
        if (ground.rotation.z >= 2.61 && ground.rotation.z <= 2.6179) {
            checkLives()
            changeColor()
            setTimeout(changeColor2, 200);
        }
        if (ground.rotation.z >= 3.65 && ground.rotation.z <= 3.66) {
            checkLives()
            changeColor()
            setTimeout(changeColor2, 200);
        }
        if (ground.rotation.z >= 4.69 && ground.rotation.z <= 4.7) {
            checkLives()
            changeColor()
            setTimeout(changeColor2, 200);
        }
        if (ground.rotation.z >= 5.742 && ground.rotation.z <= 5.752) {
            checkLives()
            changeColor()
            setTimeout(changeColor2, 200);
        }
    }

    // -------------------------- Collisions Ceilling Obstacles-------------------------- 
    if (bottleBase.rotation.z == 0) {
        if (ground.rotation.z >= 1.042 && ground.rotation.z <= 1.049) {
            checkLives()
            changeColor()
            setTimeout(changeColor2, 200);
        }
        if (ground.rotation.z >= 2.08 && ground.rotation.z <= 2.09) {
            checkLives()
            changeColor()
            setTimeout(changeColor2, 200);
        }
        if (ground.rotation.z >= 3.1 && ground.rotation.z <= 3.107) {
            checkLives()
            changeColor()
            setTimeout(changeColor2, 200);
        }
        if (ground.rotation.z >= 4.175 && ground.rotation.z <= 4.18) {
            checkLives()
            changeColor()
            setTimeout(changeColor2, 200);
        }
        if (ground.rotation.z >= 5.22 && ground.rotation.z <= 5.228) {
            checkLives()
            changeColor()
            setTimeout(changeColor2, 200);
        }
        if (ground.rotation.z >= 6.25 && ground.rotation.z <= 6.256) {
            checkLives()
            changeColor()
            setTimeout(changeColor2, 200);
        }
    }

}

function checkLives() {

    // -------------------------- 0 Lives -------------------------- 
    if (lives == 0) {

        // -------------------------- Stops the Animations -------------------------- 
        rotationSpeed = 0
        ground.rotation.z = 0.75;
        obstacles.rotation.z = 0.75;
        armSpeed = 0
        legSpeed = 0
        arm.rotation.z = 0
        arm2.rotation.z = 0
        leg.rotation.z = 0
        leg2.rotation.z = 0
        bottleBase.rotation.z = Math.PI / 2
        bottleBase.position.y = 13
        bottleSpiritBase.position.z = 50

        // -------------------------- Set Info Invisible -------------------------- 
        document.getElementById("lives").style.display = "none"
        document.getElementById("speed").style.display = "none"
        document.getElementById("laps").style.display = "none"
        document.getElementById("score").style.display = "none"
        document.getElementById("controller").style.display = "none"

        // -------------------------- Set GameOver visible -------------------------- 
        document.getElementById("gameover").style = "block"
        document.getElementById("finalScore").style.display = "block"
        document.getElementById("finalScore").innerHTML = "SCORE: " + scoreTXT

        // -------------------------- Turns Off the Lights -------------------------- 
        hemisphereLight.intensity = 0
        for (let i = 0; i < lamps.length; i++) {
            if (i != 4) {
                lamps[i].visible = false
            }
        }

        ceilingMaterial.color.setHex(0x000000)
        wallMaterial.color.setHex(0x000000)

        // -------------------------- Set obstacles Invisible -------------------------- 
        obstacles.visible = false
    } 
    else {
        lives -= 1
        bottleBase.position.y == 22
        bottleBase.rotation.z == 0
    }

}

function changeColor() {

    bottleMaterial.color.setHex(0xff0000)
    hemisphereLight.color.setHex(0xff0000)

}

function changeColor2() {

    bottleMaterial.color.setHex(0x3a88d2)
    hemisphereLight.color.setHex(0xffffff)

}

function updateValues() {

    // --------------------- Change Lives Image -------------------
    if (lives == 3) {
        document.getElementById("lives").src = "./images/3lives.png"
    }
    if (lives == 2) {
        document.getElementById("lives").src = "./images/2lives.png"
    }
    if (lives == 1) {
        document.getElementById("lives").src = "./images/1life.png"
    }
    if (lives == 0) {
        document.getElementById("lives").src = "./images/0lives.png"
    }

    // -------------------------- Infos -------------------------- 
    document.getElementById("lives").innerHTML = "LIVES: " + lives
    document.getElementById("speed").innerHTML = "SPEED: " + speedTXT
    document.getElementById("laps").innerHTML = "LAPS: " + lapTXT
    document.getElementById("score").innerHTML = "SCORE: " + scoreTXT

}

function restart() {

    // -------------------------- Starts the Animations -------------------------- 
    rotationSpeed = 0.007
    ground.rotation.z = 0
    obstacles.rotation.z = 0
    armSpeed = 0.08
    legSpeed = 0.08
    bottleBase.position.y = 22
    bottleBase.rotation.z = 0

    // -------------------------- Restarts the values -------------------------- 
    scoreTXT = 0
    lapTXT = 1
    speedTXT = 1
    lives = 3

    // -------------------------- Restarts the Bottle Spirit -------------------------- 
    bottleSpiritMaterial.opacity = 0
    spiritWhiteMaterial.opacity = 0
    spiritRedMaterial.opacity = 0
    spiritEyesMaterial.opacity = 0
    bottleSpiritBase.position.y = 13
    bottleSpiritBase.position.z = 40
    
    // -------------------------- Set Info Visible -------------------------- 
    document.getElementById("lives").style.display = "block"
    document.getElementById("speed").style.display = "block"
    document.getElementById("laps").style.display = "block"
    document.getElementById("score").style.display = "block"
    document.getElementById("controller").style.display = "block"

    // -------------------------- Set GameOver Invisible -------------------------- 

    document.getElementById("gameover").style.display = "none"
    document.getElementById("finalScore").style.display = "none"


    // -------------------------- Turns On the Lights -------------------------- 
    hemisphereLight.intensity = 1
    for (let i = 0; i < lamps.length; i++) {
        lamps[i].visible = true
    }
    ceilingMaterial.color.setHex(0X2F3A54)
    wallMaterial.color.setHex(0x374058)

    // -------------------------- Set obstacles Visible -------------------------- 
    obstacles.visible = true

}


// -------------------------------- ANIMATE -------------------------------
// ------------------------------------------------------------------------ 

function animate() {

    if (!pause) {
     
        WorldRotation()

        bottleAnimation()

        count()

        checkCollisions()

        updateValues()

        setTimeout(clawsAnimation, 100);
    }

    bottleSpiritAimation()

    // -------------------------- Render -------------------------- 
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// -------------------------- Keyboard Events -----------------------------
// ------------------------------------------------------------------------ 

function doKey(event) {

    let key = event.key;

    if (!pause) {

        if (document.getElementById("gameover").style.display == "none") {

            if (key == "z") {
                if (event.repeat) {
                    bottleBase.position.y = 22
                } else {
                    bottleBase.position.y = 50
                }
            }

            if (key == "x") {
                if (event.repeat) {
                    bottleBase.rotation.z = 0
                } else {
                    bottleBase.rotation.z = Math.PI / 2
                }

            }

        }
    }

    if (key === "h") {
        window.location.href = "index.html"
    }

    if (key == "r") {
        restart()
    }

    if (key == "c") {
        if (pause) {
            pause = false
        } else {
            pause = true
        }
    }

}

function doKeyUp(event) {

    let key = event.key;

    if (!pause) {

        if (document.getElementById("gameover").style.display == "none") {

            if (key == "z") {
                bottleBase.position.y = 22
            }

            if (key == "x") {
                bottleBase.rotation.z = 0
            }
        }
    }

}