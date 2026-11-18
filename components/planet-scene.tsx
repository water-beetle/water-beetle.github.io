'use client';
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
type Drag = { x: number; y: number };
const vertex = `varying vec3 p; varying vec3 n; varying vec3 view; void main(){p=position;n=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);view=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`;
const fragment = `varying vec3 p;varying vec3 n;varying vec3 view;
float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=.5,r=0.;for(int i=0;i<5;i++){r+=a*noise(p);p=p*2.1+vec3(7.1,3.4,2.8);a*=.5;}return r;}
void main(){vec3 s=normalize(p);float h=fbm(s*3.8);float land=smoothstep(.43,.55,h);vec3 ocean=vec3(.025,.105,.16);vec3 earth=mix(vec3(.12,.23,.18),vec3(.44,.48,.31),smoothstep(.49,.72,h));vec3 color=mix(ocean,earth,land);float detail=fbm(s*35.);color*=.8+.5*detail;float light=max(dot(normalize(n),normalize(vec3(-.7,.65,1.))),0.);float rim=pow(1.-max(dot(normalize(n),normalize(view)),0.),3.);gl_FragColor=vec4(color*(.14+light*1.9)+vec3(.13,.38,.48)*rim*.7,1.);}`;
function World({ drag }: { drag: React.RefObject<Drag> }) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef(0);
  const stars = useMemo(() => {
    const a = new Float32Array(420 * 3);
    let seed = 731;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 420; i++) {
      a[i * 3] = (random() - 0.5) * 19;
      a[i * 3 + 1] = (random() - 0.5) * 15;
      a[i * 3 + 2] = -3 - random() * 8;
    }
    return a;
  }, []);
  useFrame((_, dt) => {
    if (!group.current) return;
    spin.current += Math.min(dt, 0.05) * 0.045;
    group.current.rotation.y = spin.current + drag.current.x;
    group.current.rotation.x = 0.22 + drag.current.y;
  });
  return (
    <>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#b2cfdf"
          size={0.014}
          sizeAttenuation
          transparent
          opacity={0.65}
        />
      </points>
      <group ref={group}>
        <mesh>
          <sphereGeometry args={[1.76, 96, 64]} />
          <shaderMaterial vertexShader={vertex} fragmentShader={fragment} />
        </mesh>
        <mesh scale={1.025}>
          <sphereGeometry args={[1.76, 64, 48]} />
          <shaderMaterial
            vertexShader={vertex}
            fragmentShader={`varying vec3 n;varying vec3 view;void main(){float f=pow(1.-abs(dot(normalize(n),normalize(view))),3.5);gl_FragColor=vec4(.21,.55,.67,f*.32);}`}
            transparent
            depthWrite={false}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    </>
  );
}
export default function PlanetScene({ active }: { active: boolean }) {
  const drag = useRef<Drag>({ x: 0, y: 0 });
  const pointer = useRef<{ x: number; y: number } | null>(null);
  return (
    <div
      className="planet-canvas"
      role="img"
      aria-label="드래그로 회전하는 장식용 행성"
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        pointer.current = { x: e.clientX, y: e.clientY };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!pointer.current) return;
        drag.current.x += (e.clientX - pointer.current.x) * 0.006;
        drag.current.y = THREE.MathUtils.clamp(
          drag.current.y + (e.clientY - pointer.current.y) * 0.003,
          -0.45,
          0.45,
        );
        pointer.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        pointer.current = null;
        if (e.currentTarget.hasPointerCapture(e.pointerId))
          e.currentTarget.releasePointerCapture(e.pointerId);
      }}
      onPointerCancel={() => {
        pointer.current = null;
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5.3], fov: 45 }}
        dpr={[1, 1.5]}
        frameloop={active ? 'always' : 'never'}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      >
        <World drag={drag} />
      </Canvas>
    </div>
  );
}
