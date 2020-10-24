import * as THREE from './three.js-master/build/three.module.js';
import Stats from './three.js-master/examples/jsm/libs/stats.module.js';
import { GUI } from './three.js-master/examples/jsm/libs/dat.gui.module.js';
import { TrackballControls } from './three.js-master/examples/jsm/controls/TrackballControls.js';

var perspectiveCamera, orthographicCamera, controls, scene, renderer, stats;
var params = {
    orthographicCamera: false
};
var frustumSize = 400;

let octahedron;
let dodecahedron;
let camera;

init();
animate();

function init() {
    var aspect = window.innerWidth / window.innerHeight;
    perspectiveCamera = new THREE.PerspectiveCamera( 60, aspect, 1, 10000 );
    perspectiveCamera.position.z = 200;
    orthographicCamera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );
    orthographicCamera.position.z = 200;

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xcccccc );

    var dodecahedronGeometry = new THREE.DodecahedronGeometry( 50 );
    var material = new THREE.MeshPhongMaterial( { color: 0xffff00, wireframe: true } );
    dodecahedron = new THREE.Mesh(dodecahedronGeometry, material);
    dodecahedron.position.y = -100;
    dodecahedron.position.x = 0;
    dodecahedron.position.z = 0;
    dodecahedron.updateMatrix()
    dodecahedron.matrixAutoUpdate = true
    scene.add(dodecahedron)

    var octahedronGeometry = new THREE.OctahedronGeometry( 50 );
    var octahedronMaterial = new THREE.MeshPhongMaterial({color: 0xff0000});
    octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);
    octahedron.position.y = 100;
    octahedron.position.x = 0;
    octahedron.position.z = 0;
    octahedron.updateMatrix();
    octahedron.matrixAutoUpdate = true
    scene.add(octahedron)

    var planeGeo = new THREE.PlaneGeometry( 500, 500 );

    var planeTop = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
    planeTop.position.y = 250;
    planeTop.rotateX( Math.PI / 2 );
    scene.add( planeTop );

    var planeBottom = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xffffff } ) );
    planeBottom.position.y = -250;
    planeBottom.rotateX( - Math.PI / 2 );
    scene.add( planeBottom );

    var planeFront = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x7f7fff } ) );
    planeFront.position.z = 250;
    planeFront.position.y = 0;
    planeFront.rotateY( Math.PI );
    scene.add( planeFront );

    var planeBack = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x7f7fff } ) );
    planeFront.position.z = -250;
    planeFront.position.y = 0;
    planeFront.rotateY( Math.PI );
    scene.add( planeFront );

    var planeRight = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0x00ff00 } ) );
    planeRight.position.x = 250;
    planeRight.position.y = 0;
    planeRight.rotateY( - Math.PI / 2 );
    scene.add( planeRight );

    var planeLeft = new THREE.Mesh( planeGeo, new THREE.MeshPhongMaterial( { color: 0xff0000 } ) );
    planeLeft.position.x = - 250;
    planeLeft.position.y = 0;
    planeLeft.rotateY( Math.PI / 2 );
    scene.add( planeLeft );

    var geometry = new THREE.ParametricGeometry( CreatePlot(100, 100), 200, 200 );
    var material = new THREE.MeshPhongMaterial( {
        color: 0xa4a4a4,
        side: THREE.DoubleSide,
    } );
    var plot = new THREE.Mesh( geometry, material );
    plot.doubleSided = true;
    scene.add( plot );

    var light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    scene.add( light );
    var light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( - 1, - 1, - 1 );
    scene.add( light );
    var light = new THREE.AmbientLight( 0x555555 );
    scene.add( light );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
    stats = new Stats();
    document.body.appendChild( stats.dom );

    var gui = new GUI();
    gui.add( params, 'orthographicCamera' ).name( 'use orthographic' ).onChange( function ( value ) {
        controls.dispose();
        createControls( value ? orthographicCamera : perspectiveCamera );
    } );

    window.addEventListener( 'resize', onWindowResize, false );
    createControls( perspectiveCamera );
}

function createControls( camera ) {
    controls = new TrackballControls( camera, renderer.domElement );
    controls.rotateSpeed = 4.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
}

function onWindowResize() {
    var aspect = window.innerWidth / window.innerHeight;
    perspectiveCamera.aspect = aspect;
    perspectiveCamera.updateProjectionMatrix();
    orthographicCamera.left = - frustumSize * aspect / 2;
    orthographicCamera.right = frustumSize * aspect / 2;
    orthographicCamera.top = frustumSize / 2;
    orthographicCamera.bottom = - frustumSize / 2;
    orthographicCamera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    controls.handleResize();
}

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    stats.update();
    camera = ( params.orthographicCamera ) ? orthographicCamera : perspectiveCamera;
    renderer.render( scene, camera );
}

document.onkeypress = e => {
    let changed = false
    let x_axis, y_axis, quaternion
    switch (e.code) {
        case 'KeyW':
            x_axis = new THREE.Vector3( 1, 0, 0 );
            quaternion = new THREE.Quaternion;
            camera.position.applyQuaternion(quaternion.setFromAxisAngle(x_axis, 0.5));
            camera.up.applyQuaternion(quaternion.setFromAxisAngle(x_axis, 0.5));
            break
        case 'KeyS':
            x_axis = new THREE.Vector3( -1, 0, 0 );
            quaternion = new THREE.Quaternion;
            camera.position.applyQuaternion(quaternion.setFromAxisAngle(x_axis, 0.5));
            camera.up.applyQuaternion(quaternion.setFromAxisAngle(x_axis, 0.5));
            break
        case 'KeyA':
            y_axis = new THREE.Vector3( 0, 1, 0 );
            quaternion = new THREE.Quaternion;
            camera.position.applyQuaternion(quaternion.setFromAxisAngle(y_axis, 0.5));
            camera.up.applyQuaternion(quaternion.setFromAxisAngle(y_axis, 0.5));
            break
        case 'KeyD':
            y_axis = new THREE.Vector3( 0, -1, 0 );
            quaternion = new THREE.Quaternion;
            camera.position.applyQuaternion(quaternion.setFromAxisAngle(y_axis, 0.5));
            camera.up.applyQuaternion(quaternion.setFromAxisAngle(y_axis, 0.5));
            break
    }
}

function CreatePlot(w, h) {

    return (posX, posY, target) => {
        let x = posX * w
        let y = posY * h
        let z

        z = Math.sin(x) * Math.sqrt(y)

        y = y - h / 2;
        x = x - w / 2

        target.set(x, y, z)
    }
}