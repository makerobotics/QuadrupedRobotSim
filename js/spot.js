class Pvector{
    constructor(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
    }

    print(){
        return String("("+this.x.toFixed(2).toString()+" "+
        this.y.toFixed(2).toString()+" "+
        this.z.toFixed(2).toString()+")");
    }
}

class Segment{
    constructor(length, position, theta){
        this.length = length;
        this.theta = theta*Math.PI/180;
        this.position = position;
    }

    /**
     * @param {any} updatedPosition
     */
    set Position(updatedPosition){
        this.position = updatedPosition;
    }
    
    /**
     * @param {number} updatedTheta
     */
    set Theta(updatedTheta){
        this.theta = updatedTheta;
    }

    getB(){
        return new Pvector(this.length*Math.sin(this.theta),
            0,
            this.length*Math.cos(this.theta)
            );
    }
}

class Leg{
    constructor(segment){
        this.segments = new Array(segment);
    }

    add(segment){
        this.segments.push(segment);
    }

    getLastAttachment(){
        return this.segments[this.segments.length-1].getB();
    }

    goto(x, y, z){
        // inverse kinematics
    }

    move(theta0, theta1){
        this.segments[0].theta = theta0*Math.PI/180;
        this.segments[1].theta = theta1*Math.PI/180;
        this.segments[1].position = this.segments[0].getB();
        console.log("Target: "+this.segments[1].position.print());
    }

    info(index){
        this.segments.forEach(element => {
            console.log("Segment length: "+element.length.toString());
            console.log("A Position: "+element.position.print());
            console.log("B Position: "+element.getB().print());
        });
    }
}

function main(){
    let seg = new Segment(10, new Pvector(0,0,0), 45);
    let l = new Leg(seg);
    l.add(new Segment(15, l.getLastAttachment(), 0));
    l.info();
    l.move(50, 10);
    l.move(50, 15);
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor('rgb(60, 60, 255)');
    document.body.appendChild( renderer.domElement );
    let controls = new THREE.OrbitControls(camera, renderer.domElement);
    let floor = generateFloor(30, 30);
    let pointLight = generatePointLight(0xffffff, 1);
    pointLight.position.z = 40;
    camera.position.x = 20;
    camera.position.y = 20;
    camera.position.z = 10;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.up.set( 0, 0, 1 );
    const axesHelper = new THREE.AxesHelper( 50 );
    scene.add( axesHelper );

    let spot ={
        bodyLength:10,
        bodyWidth:5,
        bodyDepth:2,
        bodyHeight:15
    }
    
    let spotBody = drawBody(spot);
    let spotLegFL = drawLegs(new THREE.Vector3(0,0,0),new THREE.Vector3(4,5,3));
    drawAxis(scene);

    scene.add( spotBody );
    scene.add( spotLegFL );
    scene.add( floor );
    scene.add(pointLight);
        
    update(renderer, scene, camera, controls);
}

function drawBody(spot){
    let geometry = new THREE.BoxGeometry(spot.bodyWidth, spot.bodyHeight, spot.bodyDepth);
    let material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    let mesh = new THREE.Mesh( geometry, material );
    mesh.position.z = spot.bodyHeight;
    return mesh;
}

function drawLegs(p1, p2){
    let mat = new THREE.LineBasicMaterial({color:0xffff00});
    let points = [];
    points.push( new THREE.Vector3( - 10, 0, 0 ) );
    points.push( new THREE.Vector3( 0, 10, 0 ) );
    points.push( new THREE.Vector3( 10, 0, 0 ) );
    
    let geometry = new THREE.BufferGeometry().setFromPoints( points );
    let line = new THREE.Line( geometry, mat );
    return line;
}

function drawAxis(scene){
    let mat_r = new THREE.LineBasicMaterial({color:0xff0000, linewidth: 5});
    let points = [];
    points.push( new THREE.Vector3( 0, 0, 0 ) );
    points.push( new THREE.Vector3( 10, 0, 0 ) );
    let geometry = new THREE.BufferGeometry().setFromPoints( points );
    let line = new THREE.Line( geometry, mat_r );
    scene.add(line);

    let mat_g = new THREE.LineBasicMaterial({color:0x00ff00, linewidth: 5});
    points.push( new THREE.Vector3( 0, 0, 0 ) );
    points.push( new THREE.Vector3( 0, 10, 0 ) );
    geometry = new THREE.BufferGeometry().setFromPoints( points );
    line = new THREE.Line( geometry, mat_g );
    scene.add(line);

    let mat_b = new THREE.LineBasicMaterial({color:0x0000ff, linewidth: 5});
    points.push( new THREE.Vector3( 0, 0, 0 ) );
    points.push( new THREE.Vector3( 0, 0, 10 ) );
    geometry = new THREE.BufferGeometry().setFromPoints( points );
    line = new THREE.Line( geometry, mat_b );
    scene.add(line);
}

function generateFloor(w, d){
    let geo = new THREE.PlaneGeometry(w,d);
    let mat = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    let mesh = new THREE.Mesh(geo, mat);
    mat.side = THREE.DoubleSide;
    return mesh;
}

function generatePointLight(color, intensity){
    return new THREE.PointLight(color, intensity);
}

function update(renderer, scene, camera, controls){
//    spotBody.rotation.x += 0.01;
//    spotBody.rotation.y += 0.01;

    renderer.render( scene, camera );
    controls.update();
    requestAnimationFrame(function(){
        update(renderer, scene, camera, controls);
    })
}

main();