var W=1200, H=640;//размеры холста

// W=parseInt(document.body.clientWidth);
// H=parseInt(document.body.clientHeight);

var scene = new THREE.Scene();//создание новой сцены
var camera = new THREE.PerspectiveCamera(1, W/H, 1, 1000);
// создание камеры с параметрами(почитай)

var renderer = new THREE.WebGLRenderer();
// рендер сцены и елементов
renderer.setSize(W, H);
document.body.appendChild(renderer.domElement);//создание дом елемента в боди

//texture
var load = new THREE.TextureLoader().load("image/e.jpg");//подгрузка текстуры
load.anisotropy = 8;
var material = new THREE.MeshBasicMaterial({
    map: load,
    overdraw: true
});//создание "материала" для фигуры(заливка)

//light
var spotLight = new THREE.SpotLight( 0xffffff );//добавление прямого белого света
spotLight.position.set( -40, 60, -10 );//позиция источника света на сцене
scene.add(spotLight );//добавление света на сцену

var pointLight = new THREE.PointLight( 0xff0000, 1, 100 );//добавление точечного источника красного света
pointLight.position.set( 10, 10, 10 );//позиция источника
scene.add( pointLight );

//texture for skybox
var imagePrefix = "image/";
var directions  = ["right", "left", "front", "back", "down","top" ];
var imageSuffix = ".png";

var materialArray = [];
for (var i = 0; i < 6; i++)
    materialArray.push( new THREE.MeshBasicMaterial({
        map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
        side: THREE.BackSide
    }));
//skybox
var skyGeometry = new THREE.CubeGeometry( 25, 25, 25 );//создание геометрии куба со сторонами 25 25 25
var skyMaterial = new THREE.MeshFaceMaterial( materialArray );//закраска куба в текстуру
var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );//создание куба
skyBox.rotation.x += Math.PI/2;
scene.add( skyBox );

function getRandomInt(min, max){return Math.floor(Math.random() * (max - min));}//функция рандома

function CreateOctahedron(){//реализация списков через массивы(в WEBGl нет списков)
    var octahedrons = Array();
    for (var i=0; i <= 2; i++) {
        var rand = getRandomInt(0,i*0.5)
        //octahedron
        var octahedronGeometry = new THREE.OctahedronGeometry(2,1);
        var octahedronMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
        var octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial);

        octahedron.position.y =1;
        octahedron.position.x = -Math.PI*(i+rand);
        octahedron.position.z = -Math.PI*(rand-2);

        scene.add(octahedron);
        octahedrons.push(octahedron);
    }

    return octahedrons;
}

//surfaceGeometry
var surfaceGeometry = new THREE.ParametricGeometry(surfaceFunction, 64, 64);//создание геометрии поверхности за функцией и указывание ее размеров на сцене
// var material1 = new THREE.LineBasicMaterial( {color: 0xFFCF40, wireframe: true} );
var surface = new THREE.Mesh( surfaceGeometry, material );//создание поверхности
scene.add(surface);//добавление ее на сцену

function CreateDodecahedron(){
    var dodecahedrons = Array();
    for (var i=0; i < 2; i++) {
        var rand =getRandomInt(0,i+1);
        //dodecahedron
        var dodecahedronGeometry = new THREE.DodecahedronGeometry(2,1);
        // var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
        var material = new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: true } );
        var dodecahedron = new THREE.SkinnedMesh(dodecahedronGeometry,material);

        dodecahedron.position.x=-3.5*rand;
        dodecahedron.position.z=1.96+Math.PI*(i-2);
        dodecahedron.position.y=1.96;
        dodecahedron.rotation.y += 0.005;
        dodecahedron.rotation.x += 0.0075;
        scene.add(dodecahedron);
        dodecahedrons.push(dodecahedron);
    }
    return dodecahedrons;
}




function surfaceFunction( u, v ) {//функция, которая математически описывает нашу поверхность
    var x,y,z;  // A point on the surface, calculated from u,v.
    // u  and v range from 0 to 1.
    x = 20 * (u - 0.5);  // x and z range from -10 to 10
    y = -20 * (v - 0.5);
    z = (Math.sin (x) * Math.sqrt (y));//изменить только это значение, поменявши у на z
    return new THREE.Vector3( x, y, z );
}

camera.position.z = 500;//позиция камеры на сцене
// camera.position.y = 200;

var x=0, y=0;//позиция мышки

document.addEventListener('mousemove', function(event){
    x=parseInt(event.offsetX);
    y=parseInt(event.offsetY);
    spotLight.position.set( -40+x, 60, -10 );//вращение источника света за мышкой
});

var render = function () {
    requestAnimationFrame(render);

    CreateOctahedron();
    CreateDodecahedron();

    camera.position.x=x;//вращение камеры за мышкой
    camera.position.y=y;//вращение камеры за мышкой
    camera.lookAt( surface.position );//предмет слежения камеры - поверхность

    spotLight.rotation.y=+0.002;
    spotLight.rotation.x=-0.0004;

    renderer.render(scene, camera);//рендер камеры и сцены
};

render();