import React from 'react';
import styled from 'styled-components';

const PowerupContainer = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  transform: translate(-50%, -50%);
`;

const PowerupBody = styled.div`
  width: 100%;
  height: 100%;
  background-color: #00ff00;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ff00;
  animation: pulse 1.5s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 10px #00ff00;
    }
    50% {
      transform: scale(1.1);
      box-shadow: 0 0 15px #00ff00;
    }
  }
`;

const Powerup = ({ x, y }) => {
  return (
    <PowerupContainer style={{ left: x, top: y }}>
      <PowerupBody />
    </PowerupContainer>
  );
};

export default Powerup; 