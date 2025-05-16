import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const GameOverContainer = styled.div`
  background-color: #1a1a2e;
  padding: 2rem;
  border-radius: 10px;
  border: 2px solid #ffd700;
  text-align: center;
  color: #ffd700;
  font-family: 'Press Start 2P', cursive;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #ff4444;
`;

const Stats = styled.div`
  margin: 1rem 0;
  font-size: 1.2rem;
  line-height: 2;
`;

const OkButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.2rem;
  background-color: #800080;
  color: #ffd700;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Press Start 2P', cursive;
  margin-top: 2rem;
  
  &:hover {
    background-color: #9a009a;
  }
`;

const GameOverScreen = ({ time, kills, powerups, onOk }) => {
  return (
    <Overlay>
      <GameOverContainer>
        <Title>GAME OVER</Title>
        <Stats>
          Time Survived: {time} seconds<br />
          Enemies Killed: {kills}<br />
          Powerups Collected: {powerups}
        </Stats>
        <OkButton onClick={onOk}>OK</OkButton>
      </GameOverContainer>
    </Overlay>
  );
};

export default GameOverScreen; 