export default class Light {
  constructor(position, color) {
    this.pos = vec4.fromValues(position[0], position[1], position[2], 1.0);

    this.amb_c = vec4.fromValues(color[0], color[1], color[2], 1.0);
    this.amb_k = 0.4;

    this.dif_c = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.dif_k = 0.5;

    this.esp_c0 = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.esp_k = 0.4;
    this.esp_p = 5.0;
  }

  createUniforms(gl, program){
    const posLoc0 = gl.getUniformLocation(program, "light_pos0");
    gl.uniform4fv(posLoc0, this.pos);
    const posLoc1 = gl.getUniformLocation(program, "light_pos1");
    gl.uniform4fv(posLoc1, this.pos);


    const ambCLoc = gl.getUniformLocation(program, "light_amb_c");
    gl.uniform4fv(ambCLoc, this.amb_c);
    const ambKLoc = gl.getUniformLocation(program, "light_amb_k")
    gl.uniform1f(ambKLoc, this.amb_k);

    const difCLoc0 = gl.getUniformLocation(program, "light_dif_c0");
    gl.uniform4fv(difCLoc0, this.dif_c);
    const difCLoc1 = gl.getUniformLocation(program, "light_dif_c1");
    gl.uniform4fv(difCLoc1, this.dif_c);
    const difKLoc = gl.getUniformLocation(program, "light_dif_k")
    gl.uniform1f(difKLoc, this.dif_k);

    const espCLoc = gl.getUniformLocation(program, "light_esp_c0");
    gl.uniform4fv(espCLoc, this.pos);
    const espCLoc = gl.getUniformLocation(program, "light_esp_c0");
    gl.uniform4fv(espCLoc, this.pos);
    const espKLoc = gl.getUniformLocation(program, "light_esp_k")
    gl.uniform1f(espKLoc, this.esp_k);
    const espPLoc = gl.getUniformLocation(program, "light_esp_p")
    gl.uniform1f(espPLoc, this.esp_p);
  }

  updateLight(position) {
    this.pos = vec4.fromValues(position[0], position[1], position[2], 1.0);
  }
}
