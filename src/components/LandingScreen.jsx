import React, { useState } from 'react';
import styled from 'styled-components';
import brr from '../assets/brr.png';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ffd700;
  font-family: 'Press Start 2P', cursive;
  background-image: url(${brr});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  margin-top: 33vh; /* Push buttons down by 1/3 of viewport height */
  padding-bottom: 2rem;
`;

const StyledButton = styled.button`
  width: 100%;
  padding: 1.2rem 3rem;
  font-size: 1.5rem;
  background-color: rgba(0, 0, 0, 0.75);
  color: #fff;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  font-family: 'Press Start 2P', cursive;
  position: relative;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  box-shadow: 
    0 0 10px #800080,
    inset 0 0 10px #800080;
  text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #800080;
  animation: buttonPulse 2s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(90deg, 
      #800080, 
      #ff00ff, 
      #800080, 
      #ff00ff, 
      #800080
    );
    background-size: 300% 100%;
    border-radius: 2px;
    z-index: -1;
    animation: borderGlow 3s linear infinite;
  }
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.85);
    transform: scale(1.05);
    box-shadow: 
      0 0 20px #800080,
      inset 0 0 15px #800080;
    
    &::before {
      animation: borderGlow 1.5s linear infinite;
    }
  }

  @keyframes buttonPulse {
    0%, 100% {
      box-shadow: 
        0 0 10px #800080,
        inset 0 0 10px #800080;
    }
    50% {
      box-shadow: 
        0 0 20px #800080,
        inset 0 0 15px #800080;
    }
  }

  @keyframes borderGlow {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 150% 0;
    }
  }
`;

const StartButton = styled(StyledButton)``;

const HighScoreButton = styled(StyledButton)``;

const CloseButton = styled(StyledButton)`
  padding: 0.8rem 2rem;
  font-size: 1rem;
  margin-top: 2rem;
  max-width: 200px;
`;

const HighscoreContainer = styled.div`
  background-color: rgba(26, 26, 46, 0.9);
  padding: 2rem;
  border-radius: 10px;
  border: 4px solid #800080;
  box-shadow: 
    0 0 10px #800080,
    inset 0 0 20px #800080;
  animation: borderPulse 2s ease-in-out infinite;

  @keyframes borderPulse {
    0%, 100% {
      border-color: #800080;
      box-shadow: 
        0 0 10px #800080,
        inset 0 0 20px #800080;
    }
    50% {
      border-color: #ffd700;
      box-shadow: 
        0 0 15px #ffd700,
        inset 0 0 25px #ffd700;
    }
  }
`;

const HighscoreTitle = styled.h2`
  color: #ffd700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px #800080;
  font-size: 1.8rem;
  text-align: center;
`;

const HighscoreList = styled.ul`
  list-style: none;
  padding: 0;
`;

const HighscoreItem = styled.li`
  color: #ffd700;
  margin: 0.5rem 0;
  font-size: 1.2rem;
  text-shadow: 1px 1px #800080;
`;

const InfoText = styled.div`
  color: #ffd700;
  font-size: 1rem;
  line-height: 1.6;
  text-align: left;
  padding: 1rem;
  text-shadow: 0 0 5px #800080;

  br {
    margin-bottom: 0.5rem;
  }
`;

const LandingScreen = ({ onStartGame, highscores }) => {
  const [showHighScores, setShowHighScores] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <Container>
      {showHighScores ? (
        <>
          <HighscoreContainer>
            <HighscoreTitle>High Scores</HighscoreTitle>
            <HighscoreList>
              {highscores.map((score, index) => (
                <HighscoreItem key={index}>
                  {index + 1}. {score.time} seconds - {score.kills} kills
                </HighscoreItem>
              ))}
            </HighscoreList>
          </HighscoreContainer>
          <CloseButton onClick={() => setShowHighScores(false)}>
            BACK
          </CloseButton>
        </>
      ) : showInfo ? (
        <>
          <HighscoreContainer>
            <HighscoreTitle>How to Play</HighscoreTitle>
            <InfoText>
              🎮 Controls:<br />
              ↑↓←→ Arrow Keys to Move<br />
              P to Pause<br /><br />
              
              🎯 Gameplay:<br />
              • Auto-shooting in direction of movement<br />
              • Collect green powerups for increased fire rate and explosion radius<br />
              • Chain explosions to clear groups of enemies<br />
              • Survive as long as possible!<br /><br />
              
              ⚠️ Watch Out:<br />
              • Don't let enemies touch you<br />
              • Enemies spawn faster over time<br />
              • More enemies appear as time passes
            </InfoText>
          </HighscoreContainer>
          <CloseButton onClick={() => setShowInfo(false)}>
            BACK
          </CloseButton>
        </>
      ) : (
        <ButtonContainer>
          <StartButton onClick={onStartGame}>START</StartButton>
          <HighScoreButton onClick={() => setShowHighScores(true)}>
            HIGH SCORES
          </HighScoreButton>
          <HighScoreButton onClick={() => setShowInfo(true)}>
            INFO
          </HighScoreButton>
        </ButtonContainer>
      )}
    </Container>
  );
};

export default LandingScreen; 