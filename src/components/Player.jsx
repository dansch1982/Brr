import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 15px #ffd700, 0 0 25px #ffd700;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 0 20px #ffd700, 0 0 30px #ffd700, 0 0 40px #ff8c00;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    box-shadow: 0 0 15px #ffd700, 0 0 25px #ffd700;
  }
`;

const rotate = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 200% 50%;
  }
`;

const PlayerContainer = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  transform: translate(-50%, -50%);
`;

const PlayerBody = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 100%;
  background: ${props => props.$isPoweredUp ? 
    'radial-gradient(circle, #ffd700 30%, #ffb700 100%)' : 
    '#ffd700'
  };
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: ${props => props.$isPoweredUp ?
    '0 0 15px #ffd700, 0 0 25px #ffd700' :
    '0 0 10px #ffd700'
  };
  animation: ${props => props.$isPoweredUp ? pulse : 'none'} 1.5s ease-in-out infinite;
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: ${props => props.$isPoweredUp ?
      'linear-gradient(90deg, #ffd700, #ffb700, #ffd700, #ffb700, #ffd700)' :
      'none'
    };
    background-size: 200% 100%;
    opacity: ${props => props.$isPoweredUp ? 1 : 0};
    animation: ${rotate} 3s linear infinite;
    z-index: -1;
    filter: blur(2px);
  }
`;

const Gun = styled.div`
  position: absolute;
  width: 20px;
  height: 6px;
  background-color: ${props => props.$isPoweredUp ? '#9400d3' : '#800080'};
  box-shadow: ${props => props.$isPoweredUp ?
    '0 0 8px #9400d3, 0 0 12px #800080' :
    '0 0 5px #800080'
  };
  z-index: 2;

  ${props => {
    const distance = 15;
    
    if (Math.abs(props.direction.y) < 0.0001) {
      const offsetX = props.direction.x * distance;
      const angle = props.direction.x < 0 ? Math.PI : 0;
      return `
        left: calc(50% + ${offsetX}px);
        top: 50%;
        transform: translate(-50%, -50%) rotate(${angle}rad);
      `;
    }
    
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

const Player = ({ x, y, direction, isPoweredUp = false }) => {
  const gunDirection = {
    x: -direction.x,
    y: -direction.y || (direction.x ? 0 : -1)
  };

  const magnitude = Math.sqrt(gunDirection.x * gunDirection.x + gunDirection.y * gunDirection.y);
  const normalizedDirection = magnitude === 0 ? { x: 0, y: -1 } : {
    x: gunDirection.x / magnitude,
    y: gunDirection.y / magnitude
  };

  return (
    <PlayerContainer style={{ left: x, top: y }}>
      <PlayerBody $isPoweredUp={isPoweredUp}>
        <Gun direction={normalizedDirection} $isPoweredUp={isPoweredUp} />
      </PlayerBody>
    </PlayerContainer>
  );
};

export default Player; 