export default
`#version 300 es
precision highp float;

uniform vec4 light_pos_white;
uniform vec4 light_pos_yellow;

uniform vec4 light_amb_c_white;
uniform float light_amb_k_white;

uniform vec4 light_amb_c_yellow;
uniform float light_amb_k_yellow;

uniform vec4 light_dif_c_white;
uniform float light_dif_k_white;

uniform vec4 light_dif_c_yellow;
uniform float light_dif_k_yellow;

uniform vec4 light_esp_c_white;
uniform float light_esp_k_white;
uniform float light_esp_p_white;

uniform vec4 light_esp_c_yellow;
uniform float light_esp_k_yellow;
uniform float light_esp_p_yellow;

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
  vec4 viewLightPosWhite = u_view * light_pos_white;
  vec4 viewLightPosYellow = u_view * light_pos_yellow;

  // direção da luz
  vec4 lightDirWhite = normalize(viewLightPosWhite - viewPosition);
  vec4 lightDirYellow = normalize(viewLightPosYellow - viewPosition);

  // direção da camera (camera está na origem)
  vec4 cameraDir = normalize(-viewPosition);

  // fator da componente difusa
  float fatorDifWhite = max(0.0, dot(lightDirWhite, viewNormal));
  float fatorDifYellow = max(0.0, dot(lightDirYellow, viewNormal));

  // fator da componente especular
  vec4 halfVecWhite = normalize(lightDirWhite + cameraDir);
  float fatorEspWhite = pow(max(0.0, dot(halfVecWhite, viewNormal)), light_esp_p_white);
  vec4 halfVecYellow = normalize(lightDirYellow + cameraDir);
  float fatorEspYellow = pow(max(0.0, dot(halfVecYellow, viewNormal)), light_esp_p_yellow);

  // cor final do vértice
  minhaColor = 0.25 * fColor + 0.75 * (light_amb_k_white * light_amb_c_white + fatorDifWhite * light_dif_k_white * light_dif_c_white + fatorEspWhite * light_esp_k_white * light_esp_c_white) + 0.25 * fColor + 0.75 * (light_amb_k_yellow * light_amb_c_yellow + fatorDifYellow * light_dif_k_yellow * light_dif_c_yellow + fatorEspYellow * light_esp_k_yellow * light_esp_c_yellow);

  
}`