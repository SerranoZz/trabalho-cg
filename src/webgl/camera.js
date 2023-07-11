export default class Camera {
  constructor(gl) {
    // Posição da camera
    this.eye = vec3.fromValues(1.0, 2.0, 5.0);
    this.at  = vec3.fromValues(0.0, 0.0, 0.0);
    this.up  = vec3.fromValues(0.0, 1.0, 0.0);

    // Parâmetros da projeção
    this.fovy = Math.PI / 2;
    this.aspect = gl.canvas.width / gl.canvas.height;

    this.near = 0;
    this.far = 5;

    // Matrizes View e Projection
    this.view = mat4.create();
    this.proj = mat4.create();
  }

  getView() {
    return this.view;
  }

  getProj() {
    return this.proj;
  }

  get pos() {
    return this.eye;
  }

  updateViewMatrix() {
    mat4.identity(this.view);
    mat4.lookAt(this.view, this.eye, this.at, this.up);
  }

  updateProjectionMatrix(type = '') {
    mat4.identity(this.proj);
    mat4.perspective(this.proj, this.fovy, this.aspect, this.near, this.far);
  }

  updateCam() {
    this.updateViewMatrix();
    this.updateProjectionMatrix();
  }
}