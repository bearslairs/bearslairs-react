import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from 'react-three-fiber';

function Box(props) {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(props.active);

  useEffect(() => {
    mesh.current.rotation.y = -(Math.PI / 6);
    setActive(props.active);
  }, [props.active]);
  return (
    <mesh
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      ref={mesh}
      onClick={(e) => {
        setActive(!active);
        props.onClick();
      }}
      onPointerOver={(e) => setHover(true)}
      onPointerOut={(e) => setHover(false)}>
      <boxBufferGeometry attach="geometry" args={[props.geometry.width, props.geometry.depth, props.geometry.height]} />
      <meshStandardMaterial attach="material" color={(hovered) ? props.color.hover : ((active) ? props.color.active : props.color.default)} wireframe={true} />
    </mesh>
  )
}

function LockerAnimation(props) {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box geometry={props.geometry} color={props.color} onClick={props.onClick} active={props.active} />
    </Canvas>
  )
}

export default LockerAnimation;