import vertShaderSrc from '../shaders/phong.vert.js';
import fragShaderSrc from '../shaders/phong.frag.js';

import Shader from '../shaders/shader.js';
import { HalfEdgeDS } from '../webgl/half-edge.js';

export default class Mesh {
  constructor(delta) {
    // model data structure
    this.heds = new HalfEdgeDS();

    // Matriz de modelagem
    this.angle = 0;
    this.delta = delta;
    this.model = mat4.create();
    
    // Shader program
    this.vertShd = null;
    this.fragShd = null;
    this.program = null;
    
    // Data location
    this.vaoLoc = -1;
    this.indicesLoc = -1;
    
    this.uModelLoc = -1;
    this.uViewLoc = -1;
    this.uProjectionLoc = -1;
    
  }

  async loadMeshV4() {
    const resp = await fetch('../assets/obj/armadillo.obj');
    const text = await resp.text();
    
    const txtList = text.split('\n');
    
    const coords = []; //v
    const normals = []; //vn
    const indices = []; //f
    
    for(let i = 0; i < txtList.length; i++){
      
      let subString = txtList[i].split(' ');

      if(subString[0] === 'v'){
        coords.push(parseFloat(subString[1]), parseFloat(subString[2]), parseFloat(subString[3]), 1);
      }else if(subString[0] === 'vn'){
        normals.push(parseFloat(subString[1]), parseFloat(subString[2]), parseFloat(subString[3]), 0);
      }else if(subString[0] === 'f'){
        let x = subString[1].split('//');
        let y = subString[2].split('//');
        let z = subString[3].split('//');
        indices.push(parseInt(x[0]) - 1, parseInt(y[0]) - 1, parseInt(z[0]) - 1);
      }
    }
    
    console.log(coords, indices, normals);
    this.heds.build(coords, indices, normals);

    this.addVertexSelectionListener();
  }

  addVertexSelectionListener() {
    const model1VertexInput = document.getElementById('model1-vertex');
    const model2VertexInput = document.getElementById('model2-vertex');

    model1VertexInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const model1Vertex = model1VertexInput.value;
        console.log('Vértice do Modelo 1:', model1Vertex);
      }
    });

    model2VertexInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const model2Vertex = model2VertexInput.value;
        console.log('Vértice do Modelo 2:', model2Vertex);
      }
    });
  }
  
  createShader(gl) {
    this.vertShd = Shader.createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);
    this.fragShd = Shader.createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
    this.program = Shader.createProgram(gl, this.vertShd, this.fragShd);

    gl.useProgram(this.program);
  }

  createUniforms(gl) {
    this.uModelLoc = gl.getUniformLocation(this.program, "u_model");
    this.uViewLoc = gl.getUniformLocation(this.program, "u_view");
    this.uProjectionLoc = gl.getUniformLocation(this.program, "u_projection");
  }

  createVAO(gl) {
    const vbos = this.heds.getVBOs();
    console.log(vbos);

    var coordsAttributeLocation = gl.getAttribLocation(this.program, "position");
    const coordsBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vbos[0]));

    var colorsAttributeLocation = gl.getAttribLocation(this.program, "color");
    const colorsBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vbos[1]));

    var normalsAttributeLocation = gl.getAttribLocation(this.program, "normal");
    const normalsBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vbos[2]));

    this.vaoLoc = Shader.createVAO(gl,
      coordsAttributeLocation, coordsBuffer, 
      colorsAttributeLocation, colorsBuffer, 
      normalsAttributeLocation, normalsBuffer);

    this.indicesLoc = Shader.createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(vbos[3]));
  }  

  init(gl, light) {
    this.createShader(gl);
    this.createUniforms(gl);
    this.createVAO(gl);

    light.createUniforms(gl, this.program);
  }

  updateModelMatrix() {
    this.angle += 0.005;

    mat4.identity( this.model );
    //mat4.translate(this.model, this.model, [this.delta, 0, 0]);
    // [1 0 0 delta, 0 1 0 0, 0 0 1 0, 0 0 0 1] * this.mat 

    mat4.rotateY(this.model, this.model, this.angle);
    // [ cos(this.angle) 0 -sin(this.angle) 0, 
    //         0         1        0         0, 
    //   sin(this.angle) 0  cos(this.angle) 0, 
    //         0         0        0         1]
    // * this.mat 

    //mat4.translate(this.model, this.model, [-0.25, -0.25, -0.25]);
    // [1 0 0 -0.5, 0 1 0 -0.5, 0 0 1 -0.5, 0 0 0 1] * this.mat 

    mat4.scale(this.model, this.model, [1, 1, 1]);
    // [5 0 0 0, 0 5 0 0, 0 0 5 0, 0 0 0 1] * this.mat 
  }

  draw(gl, cam, light) {
    // faces orientadas no sentido anti-horário
    gl.frontFace(gl.CCW);

    // face culling
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    gl.useProgram(this.program);

    // updates the model transformations
    this.updateModelMatrix();

    const model = this.model;
    const view = cam.getView();
    const proj = cam.getProj();
    
    gl.uniformMatrix4fv(this.uModelLoc, false, model);
    gl.uniformMatrix4fv(this.uViewLoc, false, view);
    gl.uniformMatrix4fv(this.uProjectionLoc, false, proj);

    gl.bindVertexArray(this.vaoLoc);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesLoc);

    gl.drawElements(gl.TRIANGLES, this.heds.faces.length * 3, gl.UNSIGNED_INT, 0);

    gl.disable(gl.CULL_FACE);
  }
}