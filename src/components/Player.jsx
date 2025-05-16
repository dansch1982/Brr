import React from 'react';
import styled from 'styled-components';

const PlayerContainer = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  transform: translate(-50%, -50%);
`;

const PlayerBody = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #ffd700;
  border-radius: 50%;
  box-shadow: 0 0 10px #ffd700;
`;

const Gun = styled.div`
  position: absolute;
  width: 20px;
  height: 6px;
  background-color: #800080;
  box-shadow: 0 0 5px #800080;
  ${props => {
    const distance = 15; // Distance from center of player to center of gun
    
    // Special handling for horizontal movement
    if (Math.abs(props.direction.y) < 0.0001) {
      // For left/right directions
      const offsetX = props.direction.x * distance;
      // If moving left (x = 1), angle should be 0, if moving right (x = -1), angle should be Math.PI
      const angle = props.direction.x < 0 ? Math.PI : 0;
      return `
        left: calc(50% + ${offsetX}px);
        top: 50%;
        transform: translate(-50%, -50%) rotate(${angle}rad);
      `;
    }
    
    // For all other directions
    const angle = Math.atan2(props.direction.y, props.direction.x);
    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance;
    
    return `
      left: calc(50% + ${offsetX}px);
      top: calc(50% + ${offsetY}px);
      transform: translate(-50%, -50%) rotate(${angle}rad);
    `;
  }}
`;

const Player = ({ x, y, direction }) => {
  // Calculate the opposite direction for the gun
  const gunDirection = {
    x: -direction.x,
    y: -direction.y || (direction.x ? 0 : -1)  // Use -direction.y if it exists, otherwise use 0 for horizontal movement or -1 as default
  };

  // Normalize the direction vector
  const magnitude = Math.sqrt(gunDirection.x * gunDirection.x + gunDirection.y * gunDirection.y);
  const normalizedDirection = magnitude === 0 ? { x: 0, y: -1 } : {
    x: gunDirection.x / magnitude,
    y: gunDirection.y / magnitude
  };

  return (
    <PlayerContainer style={{ left: x, top: y }}>
      <PlayerBody>
        <Gun direction={normalizedDirection} />
      </PlayerBody>
    </PlayerContainer>
  );
};

export default Player; 