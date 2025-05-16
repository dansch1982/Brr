import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import LandingScreen from './components/LandingScreen';
import Game from './components/Game';
import './App.css';

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background: radial-gradient(
    circle at 50% 70%,
    #0f0024 0%,
    #0f0021 50%,
    #0c001c 100%
  );
`;

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [highscores, setHighscores] = useState([]);

  useEffect(() => {
    // Load highscores from localStorage
    const savedHighscores = localStorage.getItem('highscores');
    if (savedHighscores) {
      setHighscores(JSON.parse(savedHighscores));
    }
  }, []);

  const handleGameOver = (gameStats) => {
    // Add new score to highscores
    const newHighscores = [...highscores, gameStats]
      .sort((a, b) => b.time - a.time)
      .slice(0, 5); // Keep only top 5 scores

    setHighscores(newHighscores);
    localStorage.setItem('highscores', JSON.stringify(newHighscores));
    setIsPlaying(false);
  };

  return (
    <AppContainer>
      {isPlaying ? (
        <Game onGameOver={handleGameOver} />
      ) : (
        <LandingScreen
          onStartGame={() => setIsPlaying(true)}
          highscores={highscores}
        />
      )}
    </AppContainer>
  );
};

export default App;
