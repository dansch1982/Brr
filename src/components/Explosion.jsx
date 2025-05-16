import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const explode = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 1;
  }
  100% {
    transform: scale(6);
    opacity: 0;
  }
`;

const Particle = styled.div`
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: #ff4444;
  border-radius: 50%;
  animation: ${explode} 0.5s ease-out forwards;
  transform-origin: center center;
`;

const ExplosionContainer = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  transform: translate(-50%, -50%);
`;

const Explosion = ({ x, y }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Create 12 particles in a circle for a bigger effect
    const newParticles = Array.from({ length: 12 }, (_, i) => {
      const angle = (i * Math.PI * 2) / 12;
      return {
        id: i,
        style: {
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) rotate(${angle}rad) translateX(30px)`,
        }
      };
    });
    setParticles(newParticles);

    // Remove the explosion after animation
    const timer = setTimeout(() => {
      setParticles([]);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ExplosionContainer style={{ left: x, top: y }}>
      {particles.map(particle => (
        <Particle key={particle.id} style={particle.style} />
      ))}
    </ExplosionContainer>
  );
};

export default Explosion; 