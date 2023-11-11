precision mediump float;
varying vec3 vVertexColor;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform bool uEnableTexture;
uniform bool uEnableLighting;
varying vec3 vNormalEye;
varying vec3 vVertexPositionEye3;

void main() {
    gl_FragColor = vec4(0.5, 0, 0, 1);
}