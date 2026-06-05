/**
 * shaders.ts
 * Centralized GLSL shader definitions for all celestial bodies.
 * Keep all shader source strings here to make them easy to maintain
 * and diff independently from component logic.
 */

// ── Shared GLSL helpers ───────────────────────────────────────────────────────
export const SHARED_HASH_FN = `
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p) {
    vec2 i=floor(p); vec2 f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<4;i++){v+=a*noise(p);p*=2.0;a*=0.5;} return v; }
`;

// Shared vertex shader used by all planet materials
export const PLANET_VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;

// ── Per-planet fragment shaders ───────────────────────────────────────────────
// Each planet has a distinct colour palette mapped to the same lava-crack base.

export const PLANET_FRAGMENT_SHADERS: Record<string, string> = {
  /** Teal lava world */
  projects: `
    ${SHARED_HASH_FN}
    uniform float time;
    varying vec2 vUv; varying vec3 vNormal;
    void main() {
      float t = time * 0.1;
      float cracks = fbm(vUv * 8.0 + t);
      float lava   = fbm(vUv * 3.0 - t * 0.4);
      float hot    = step(0.6, cracks);
      float limb   = pow(clamp(dot(vNormal,vec3(0,0,1)),0.0,1.0),0.4);
      vec3 rock    = mix(vec3(0.12,0.32,0.30), vec3(0.25,0.52,0.48), lava);
      vec3 glow    = mix(vec3(0.35,0.85,0.80), vec3(0.65,1.00,0.96), cracks);
      vec3 col     = mix(rock, glow, hot * 0.8);
      col += vec3(0.1,0.50,0.46) * (1.0 - limb) * 0.45;
      col *= (0.75 + 0.25*limb);
      gl_FragColor = vec4(col, 1.0);
    }
  `,

  /** Amber forge world */
  tech_stack: `
    ${SHARED_HASH_FN}
    uniform float time;
    varying vec2 vUv; varying vec3 vNormal;
    void main() {
      float t = time * 0.1;
      float cracks = fbm(vUv * 8.0 + t);
      float lava   = fbm(vUv * 3.0 - t * 0.4);
      float hot    = step(0.6, cracks);
      float limb   = pow(clamp(dot(vNormal,vec3(0,0,1)),0.0,1.0),0.4);
      vec3 rock    = mix(vec3(0.38,0.24,0.10), vec3(0.58,0.38,0.18), lava);
      vec3 glow    = mix(vec3(0.95,0.60,0.15), vec3(1.0,0.92,0.40), cracks);
      vec3 col     = mix(rock, glow, hot * 0.8);
      col += vec3(0.5,0.25,0.05) * (1.0 - limb) * 0.4;
      col *= (0.75 + 0.25*limb);
      gl_FragColor = vec4(col, 1.0);
    }
  `,

  /** Orange gas giant */
  academics: `
    ${SHARED_HASH_FN}
    uniform float time;
    varying vec2 vUv; varying vec3 vNormal;
    void main() {
      float t = time * 0.1;
      float cracks = fbm(vUv * 8.0 + t);
      float lava   = fbm(vUv * 3.0 - t * 0.4);
      float hot    = step(0.6, cracks);
      float limb   = pow(clamp(dot(vNormal,vec3(0,0,1)),0.0,1.0),0.4);
      vec3 rock    = mix(vec3(0.42,0.20,0.10), vec3(0.62,0.32,0.16), lava);
      vec3 glow    = mix(vec3(0.96,0.45,0.15), vec3(1.0,0.78,0.45), cracks);
      vec3 col     = mix(rock, glow, hot * 0.8);
      col += vec3(0.55,0.22,0.05) * (1.0 - limb) * 0.45;
      col *= (0.75 + 0.25*limb);
      gl_FragColor = vec4(col, 1.0);
    }
  `,

  /** Cyan ocean world */
  socials: `
    ${SHARED_HASH_FN}
    uniform float time;
    varying vec2 vUv; varying vec3 vNormal;
    void main() {
      float t = time * 0.1;
      float cracks = fbm(vUv * 8.0 + t);
      float lava   = fbm(vUv * 3.0 - t * 0.4);
      float hot    = step(0.6, cracks);
      float limb   = pow(clamp(dot(vNormal,vec3(0,0,1)),0.0,1.0),0.4);
      vec3 rock    = mix(vec3(0.18,0.32,0.48), vec3(0.32,0.52,0.72), lava);
      vec3 glow    = mix(vec3(0.40,0.85,0.96), vec3(0.80,0.98,1.00), cracks);
      vec3 col     = mix(rock, glow, hot * 0.8);
      col += vec3(0.15,0.48,0.72) * (1.0 - limb) * 0.45;
      col *= (0.75 + 0.25*limb);
      gl_FragColor = vec4(col, 1.0);
    }
  `,

  /** Violet nebula world */
  resume: `
    ${SHARED_HASH_FN}
    uniform float time;
    varying vec2 vUv; varying vec3 vNormal;
    void main() {
      float t = time * 0.1;
      float cracks = fbm(vUv * 8.0 + t);
      float lava   = fbm(vUv * 3.0 - t * 0.4);
      float hot    = step(0.6, cracks);
      float limb   = pow(clamp(dot(vNormal,vec3(0,0,1)),0.0,1.0),0.4);
      vec3 rock    = mix(vec3(0.28,0.20,0.42), vec3(0.46,0.32,0.65), lava);
      vec3 glow    = mix(vec3(0.65,0.48,0.96), vec3(0.88,0.75,1.00), cracks);
      vec3 col     = mix(rock, glow, hot * 0.8);
      col += vec3(0.45,0.20,0.75) * (1.0 - limb) * 0.45;
      col *= (0.75 + 0.25*limb);
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

// ── Fresnel (atmosphere glow) shader ─────────────────────────────────────────
export const FRESNEL_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const FRESNEL_FRAGMENT_SHADER = `
  uniform vec3 color;
  uniform float time;
  uniform float hoverOpacity;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vec3 normal  = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float rim    = 1.0 - max(dot(viewDir, normal), 0.0);
    rim = smoothstep(0.3, 1.0, rim);
    float pulse = 1.0 + sin(time * 1.5) * 0.15;
    gl_FragColor = vec4(color, rim * pulse * (0.5 + hoverOpacity));
  }
`;

// ── Sun shaders ───────────────────────────────────────────────────────────────
export const SUN_VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const SUN_FRAGMENT_SHADER = `
  uniform float time;
  uniform vec3 colorA;
  uniform vec3 colorB;
  uniform vec3 colorC;
  varying vec2 vUv;
  varying vec3 vNormal;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1,0)), f.x),
      mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
      f.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for(int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float t  = time * 0.12;
    float n  = fbm(uv * 4.0 + vec2(t, t * 0.7));
    float n2 = fbm(uv * 8.0 - vec2(t * 1.3, t * 0.5));
    float n3 = fbm(uv * 2.0 + vec2(t * 0.4, -t * 0.9));
    float turbulence = n * 0.5 + n2 * 0.3 + n3 * 0.2;

    float limb = dot(vNormal, vec3(0.0, 0.0, 1.0));
    limb = clamp(limb, 0.0, 1.0);
    float dark = pow(limb, 0.4);

    vec3 col = mix(colorC, colorB, turbulence);
    col = mix(col, colorA, turbulence * turbulence * dark);
    col *= (0.7 + 0.3 * dark);

    float spots = step(0.72, fbm(uv * 12.0 + vec2(t * 2.0, 0.0)));
    col += vec3(0.3, 0.15, 0.0) * spots * dark;

    gl_FragColor = vec4(col, 1.0);
  }
`;
