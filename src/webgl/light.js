export default class Light {
  constructor(position, color) {
    this.pos = vec4.fromValues(position[0], position[1], position[2], 1.0);
    this.angle = 0;

    this.amb_c = vec4.fromValues(color[0], color[1], color[2], 1.0);
    this.amb_k = 0.2;

    this.dif_c = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.dif_k = 0.5;

    this.esp_c = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.esp_k = 0.4;
    this.esp_p = 5.0;
  }

  createUniforms(gl, program){
    const posLoc = gl.getUniformLocation(program, "light_pos");
    gl.uniform4fv(posLoc, this.pos);

    const ambCLoc = gl.getUniformLocation(program, "light_amb_c");
    gl.uniform4fv(ambCLoc, this.amb_c);
    const ambKLoc = gl.getUniformLocation(program, "light_amb_k")
    gl.uniform1f(ambKLoc, this.amb_k);

    const difCLoc = gl.getUniformLocation(program, "light_dif_c");
    gl.uniform4fv(difCLoc, this.dif_c);
    const difKLoc = gl.getUniformLocation(program, "light_dif_k")
    gl.uniform1f(difKLoc, this.dif_k);

    const espCLoc = gl.getUniformLocation(program, "light_esp_c");
    gl.uniform4fv(espCLoc, this.pos);
    const espKLoc = gl.getUniformLocation(program, "light_esp_k")
    gl.uniform1f(espKLoc, this.esp_k);
    const espPLoc = gl.getUniformLocation(program, "light_esp_p")
    gl.uniform1f(espPLoc, this.esp_p);
  }

  updateLight() {
    const radius = 5.0; // Raio da órbita
    const speed = 0.01; // Velocidade de rotação

    // Atualiza o ângulo
    this.angle += speed;

    // Calcula a nova posição eye com base no ângulo
    this.pos[0] = radius * Math.sin(this.angle);
    this.pos[2] = radius * Math.cos(this.angle);
  }
}