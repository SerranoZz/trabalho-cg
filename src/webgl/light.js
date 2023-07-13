export default class Light {
  constructor(position, color) {
    this.pos = vec4.fromValues(position[0], position[1], position[2], 1.0);
    this.angle = 0;

    this.amb_c = vec4.fromValues(color[0], color[1], color[2], color[3]);
    this.amb_k = 0.2;

    this.dif_c = vec4.fromValues(color[0], color[1], color[2], 1.0);
    this.dif_k = 0.55;

    this.esp_c = vec4.fromValues(color[0], color[1], color[2], 1.0);
    this.esp_k = 0.25;
    this.esp_p = 100;
  }

  createUniforms(gl, program, name){
    const posLoc = gl.getUniformLocation(program, `light_pos_${name}`);
    gl.uniform4fv(posLoc, this.pos);

    const ambCLoc = gl.getUniformLocation(program, `light_amb_c_${name}`);
    gl.uniform4fv(ambCLoc, this.amb_c);
    const ambKLoc = gl.getUniformLocation(program, `light_amb_k_${name}`)
    gl.uniform1f(ambKLoc, this.amb_k);

    const difCLoc = gl.getUniformLocation(program, `light_dif_c_${name}`);
    gl.uniform4fv(difCLoc, this.dif_c);
    const difKLoc = gl.getUniformLocation(program, `light_dif_k_${name}`);
    gl.uniform1f(difKLoc, this.dif_k);

    const espCLoc = gl.getUniformLocation(program, `light_esp_c_${name}`);
    gl.uniform4fv(espCLoc, this.pos);
    const espKLoc = gl.getUniformLocation(program, `light_esp_k_${name}`);
    gl.uniform1f(espKLoc, this.esp_k);
    const espPLoc = gl.getUniformLocation(program, `light_esp_p_${name}`);
    gl.uniform1f(espPLoc, this.esp_p);
  }

  setPos(x, y, z){
    this.pos = vec4.fromValues(x, y, z, 1.0);
  }
}