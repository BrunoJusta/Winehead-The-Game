// THREEJS RELATED VARIABLES
let scene, renderer, camera;
let speed = 0.06
let speed2 = 0.06
let armMove = 0.05

// 3D Models
let ground, bottleBase, arm, disk, obstacle, obstacles, leg, leg2, lamps;
let vel = 0;

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
    window.addEventListener('resize', handleWindowResize, false);
    scene.fog = new THREE.Fog(0xffffff, 100);
    createLights()
    createground();
    createBottle();
    createLamps()
    document.addEventListener("keydown", doKey)
    animate();
}

function handleWindowResize() {
    const HEIGHT = window.innerHeight;
    const WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

function createLights() {
    hemisphereLight = new THREE.HemisphereLight(0xffffff, .8);
    scene.add(hemisphereLight);
}

function createLamps() {

    lamps = new THREE.Object3D();
    lamps.position.y = 0;
    const lampGeometry = new THREE.CylinderGeometry(4, 1, 10, 90);
    const lampMaterial = new THREE.MeshPhongMaterial({
        color: 0xB6B6B6
    });
    const lamp2Geometry = new THREE.CylinderGeometry(0.5, 0.5, 50, 90);
    const lamp2Material = new THREE.MeshPhongMaterial({
        color: 0x1B2845
    });
    let numObs = 12
    const stepAngle1 = Math.PI * 2 / numObs;
    for (let i = 0; i < numObs; i++) {
        let lamp = new THREE.Object3D();
        let spotLight = new THREE.SpotLight(0xffffff);
        spotLight.position.set(0, 0, 30);
        spotLight.castShadow = true;
        spotLight.angle = 0.3
        spotLight.target = ground
        spotLight.intensity = 0.8
        spotLight.penumbra = 0.5
        spotLight.shadow.camera.left = -50;
        spotLight.shadow.camera.right = 50;
        spotLight.shadow.camera.top = 50;
        spotLight.shadow.camera.bottom = -50;
        for (let j = 0; j < 1; j++) {
            let m = new THREE.Mesh(lampGeometry, lampMaterial);
            let m2 = new THREE.Mesh(lamp2Geometry, lamp2Material);
            m.position.x = j * 10;
            m.position.y = -40;
            m.position.z = 50;
            m2.position.y = -20;
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
    }
}

function createBottle() {

    // -------------------------- GARRAFA -------------------------------------------------------------------------------   

    var bottleMaterial = new THREE.MeshPhongMaterial({
        color: 0x3a88d2,
        transparent: true,
        opacity: 0.95,
    });

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

    // -------------------------- BRAÇOS -------------------------------------------------------------------------------   
    // -----------------------------------------------------------------------------------------------------------------   
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
    // -------------------------- PERNAS -------------------------------------------------------------------------------   
    // -----------------------------------------------------------------------------------------------------------------   
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

    // let axes = new THREE.AxesHelper(600);
    // leg.add(axes)

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

function createground() {

    //Ground
    let geometry = new THREE.CylinderGeometry(100, 100, 200, 300);
    geometry.rotateX(-Math.PI / 2);
    let material = new THREE.MeshPhongMaterial({
        color: 0x888888,
        transparent: true,
        opacity: 1,
        flatShading: true,
        wireframe: false
    }); //ALTERED: change wireframe=true to wireframe=false
    ground = new THREE.Mesh(geometry, material);
    ground.position.y = -90;
    ground.castShadow = true;
    ground.receiveShadow = true
    scene.add(ground)

    //Wall
    var geometry2 = new THREE.CircleBufferGeometry(200, 80);
    var geometryDisk2 = new THREE.CircleBufferGeometry(300, 80);
    let starMap = new THREE.TextureLoader().load('images/stars.png');
    let starMaterial = new THREE.MeshPhongMaterial({
        map: starMap,
        transparent: true
    });
    var material2 = new THREE.MeshBasicMaterial({
        color: 0x374058,
        transparent: true,
        opacity: 1,
        side: THREE.DoubleSide
    });
    disk = new THREE.Mesh(geometry2, material2);
    let disk2 = new THREE.Mesh(geometryDisk2, starMaterial);
    disk.position.set(0, 0, -20)
    disk2.position.set(0, 0, -21)
    ground.add(disk, disk2);


    //teto
    var torusGeometry = new THREE.CylinderGeometry(200, 200, 200, 80, 80, true);
    var ffffffff = new THREE.MeshBasicMaterial({
        color: 0X2F3A54,
        side: THREE.DoubleSide
    });
    torusGeometry.rotateX(-Math.PI / 2);
    torus = new THREE.Mesh(torusGeometry, ffffffff);

    ground.add(torus);

    //Windows
    windows = new THREE.Object3D();
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
        disk.add(window);
    }

    //Paintings
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
        disk.add(painting);
    }
    scene.add(windows);
}

function animate() {
    // Rotation Animate
    ground.rotation.z += 0.006;

    // Arm Rotation
    arm.rotation.z += speed
    arm2.rotation.z -= speed
    if (arm.rotation.z >= 2 * Math.PI / 4 || arm.rotation.z <= -2 * Math.PI / 4) {
        speed = -speed
    }

    // leg Rotation
    leg.rotation.z -= speed2
    leg2.rotation.z += speed2
    if (leg.rotation.z >= 2 * Math.PI / 4 || leg.rotation.z <= -2 * Math.PI / 4) {
        speed2 = -speed2
    }

    // render
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function doKey(event) {
    let key = event.key;
    if (key == "s") {
        window.location.href = "wineheadGame.html"
    }

}
