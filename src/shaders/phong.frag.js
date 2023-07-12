export default
`#version 300 es
precision highp float;

uniform vec4 light_pos0;
uniform vec4 light_pos1;

uniform vec4 light_amb_c;
uniform float light_amb_k;

uniform vec4 light_dif_c0;
uniform vec4 light_dif_c1;
uniform float light_dif_k;

uniform vec4 light_esp_c0;
uniform vec4 light_esp_c1;
uniform float light_esp_k;
uniform float light_esp_p;

uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

in vec4 fPosition;
in vec4 fColor;
in vec4 fNormal;

out vec4 minhaColor;

void main()
{
  mat4 modelView = u_view * u_model;

  // posição do vértice no sistema da câmera
  vec4 viewPosition = modelView * fPosition;

  // posição final do vertice  
  // normal do vértice no sistema da câmera
  vec4 viewNormal = transpose(inverse(modelView)) * fNormal;
  viewNormal = normalize(viewNormal);

  // posição da luz no sistema da câmera
  // vec4 viewLightPos0 = u_view * light_pos0;
  vec4 viewLightPos1 = u_view * light_pos1;

  // direção da luz
  vec4 lightDir0 = normalize(light_pos0 - viewPosition);
  vec4 lightDir1 = normalize(viewLightPos1 - viewPosition);

  // direção da camera (camera está na origem)
  vec4 cameraDir = normalize(-viewPosition);

  // fator da componente difusa
  float fatorDif0 = max(0.0, dot(lightDir0, viewNormal));
  float fatorDif1 = max(0.0, dot(lightDir1, viewNormal));

  // fator da componente especular
  vec4 halfVec0 = normalize(lightDir0 + cameraDir);
  vec4 halfVec1 = normalize(lightDir1 + cameraDir);
  float fatorEsp0 = pow(max(0.0, dot(halfVec0, viewNormal)), light_esp_p);
  float fatorEsp1 = pow(max(0.0, dot(halfVec1, viewNormal)), light_esp_p);

  // cor final do vértice
  minhaColor = 0.25 * fColor + 0.75 * (light_amb_k * light_amb_c + (fatorDif0 * light_dif_k * light_dif_c0 + fatorDif1 * light_dif_k * light_dif_c1)/2.0  + (fatorEsp0 * light_esp_k * light_esp_c0 + fatorEsp1 * light_esp_k * light_esp_c1)/2.0);
}`