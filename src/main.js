import Camera from './webgl/camera.js';
import Light from './webgl/light.js';
import Mesh from './webgl/mesh.js';

class Scene {
  constructor(gl) {
    this.cam = new Camera(gl);

    this.whiteLight = new Light(this.cam.pos, [1.0, 1.0, 1.0, 1.0]);
    this.yellowLight = new Light([0.0, 5.0, 0.0], [1.0, 1.0, 0.0, 0.5])
  }
  
  async init(gl) {
    this.armadillo = new Mesh([0, 0, 0], [1,1,1], 0.007, 0);
    await this.armadillo.loadMeshV4(gl, '../../assets/obj/armadillo.obj');
    this.armadillo.init(gl, this.whiteLight, this.yellowLight);
    
    this.bunny = new Mesh([-3.5, 0, 0], [(this.armadillo.lengthX/3) * (1/3.11398), (this.armadillo.lengthY/3) * (1/3.086672), (this.armadillo.lengthZ/3) * (1/2.4134659999999997)], 0, 0.007);
    await this.bunny.loadMeshV4(gl, '../../assets/obj/bunny.obj');
    this.bunny.init(gl, this.whiteLight, this.yellowLight);

    this.armadillo.addVertexSelectionListener(gl, 'model1-vertex');
    this.bunny.addVertexSelectionListener(gl, 'model2-vertex');
  }

  draw(gl) {  
    this.cam.updateCam();
    let pos = this.cam.pos;
    this.whiteLight.setPos(pos[0], pos[1], pos[2], gl, this.armadillo.program, this.bunny.program, 'white');

    this.armadillo.draw(gl, this.cam);
    this.bunny.draw(gl, this.cam);
  }
}

class Main {
  constructor() {
    const canvas = document.querySelector("#glcanvas");

    this.gl = canvas.getContext("webgl2");
    this.setViewport();

    this.scene = new Scene(this.gl);
    this.scene.init(this.gl).then(() => {
      this.draw();
    });
  }

  setViewport() {
    var devicePixelRatio = window.devicePixelRatio || 1;
    this.gl.canvas.width = 1024 * devicePixelRatio;
    this.gl.canvas.height = 768 * devicePixelRatio;

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }

  draw() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.scene.draw(this.gl);

    requestAnimationFrame(this.draw.bind(this));
  }
}

window.onload = () => {
  const app = new Main();
  app.draw();
}