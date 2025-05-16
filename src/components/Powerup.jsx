import React from 'react';
import styled from 'styled-components';

const PowerupContainer = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  transform: translate(-50%, -50%);
`;

const PowerupBody = styled.div`
  width: 100%;
  height: 100%;
  background-color: #7543ba;
  border-radius: 50%;
  box-shadow: 0 0 15px #7543ba;
  animation: pulse 1.5s ease-in-out infinite;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: Arial, sans-serif;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 0 15px #7543ba;
    }
    50% {
      transform: scale(1.1);
      box-shadow: 0 0 25px #7543ba;
    }
  }
`;

const Powerup = ({ x, y }) => {
  return (
    <PowerupContainer style={{ left: x, top: y }}>
      <PowerupBody>K</PowerupBody>
    </PowerupContainer>
  );
};

export default Powerup; 