import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { Howl } from 'howler';
import Player from './Player';
import Enemy from './Enemy';
import Powerup from './Powerup';
import GameOverScreen from './GameOverScreen';
import Explosion from './Explosion';
import brrMusic from '../assets/brr.mp3';

const GameWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0f0f1a;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const GameContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 1600px;
  max-height: 900px;
  aspect-ratio: 16 / 9;
  margin: auto;
  background-color: #1a1a2e;
  overflow: hidden;
  border: 4px solid #800080;
  border-radius: 12px;
  box-shadow: 
    0 0 10px #800080,
    inset 0 0 20px #800080;
  animation: borderPulse 2s ease-in-out infinite;

  /* Grid pattern using linear gradients */
  background-image: 
    linear-gradient(rgba(128, 0, 128, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(128, 0, 128, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  background-position: center center;

  /* Add subtle glow to grid lines */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 8px;
    background-image: 
      linear-gradient(rgba(255, 215, 0, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 215, 0, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    background-position: center center;
    pointer-events: none;
  }

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

const StatsOverlay = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: #ffd700;
  font-family: 'Press Start 2P', cursive;
  font-size: 1.2rem;
  z-index: 100;
`;

const MuteButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: 2px solid #800080;
  padding: 8px 16px;
  cursor: pointer;
  z-index: 100;
  transition: all 0.3s ease;
  box-shadow: 0 0 5px #800080;
  color: #ffd700;
  font-family: 'Press Start 2P', cursive;
  font-size: 0.8rem;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
    box-shadow: 0 0 10px #800080;
    border-color: #ffd700;
  }
`;

const PauseOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PauseContent = styled.div`
  color: #ffd700;
  font-family: 'Press Start 2P', cursive;
  font-size: 3rem;
  text-align: center;
  text-shadow: 0 0 10px #800080;
  animation: pulsePause 2s ease-in-out infinite;

  @keyframes pulsePause {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.1);
    }
  }
`;

const INITIAL_ENEMY_SPAWN_INTERVAL = 1000;
const MIN_ENEMY_SPAWN_INTERVAL = 300; // Faster minimum spawn rate
const ENEMY_SCALING_START_TIME = 15; // Start scaling earlier
const MAX_ENEMIES_PER_SPAWN = 5; // Allow more enemies per spawn
const POWERUP_SPAWN_MIN_INTERVAL = 10000;
const POWERUP_SPAWN_MAX_INTERVAL = 15000;
const POWERUP_DURATION = 10000;
const POWERUP_VISIBLE_DURATION = 10000;
const BASE_FIRE_RATE = 3;
const POWERUP_FIRE_RATE_MULTIPLIER = 2.5; // Increased from 1.5
const BASE_EXPLOSION_RADIUS = 50;
const POWERUP_EXPLOSION_RADIUS = 75; // New larger explosion radius when powered up
const BULLET_SPEED = 5;
const MAX_BULLETS = 50;

// Calculate dynamic spawn interval based on game time
const calculateSpawnInterval = (gameTime) => {
  if (gameTime < ENEMY_SCALING_START_TIME) return INITIAL_ENEMY_SPAWN_INTERVAL;
  
  // Exponential decay with a logarithmic component
  const timeFactor = Math.log10(gameTime + 1);
  const exponentialFactor = Math.exp(-gameTime / 120); // Decay over 2 minutes
  const baseInterval = INITIAL_ENEMY_SPAWN_INTERVAL * exponentialFactor;
  
  // Add logarithmic scaling
  const scaledInterval = baseInterval / (1 + timeFactor);
  
  return Math.max(MIN_ENEMY_SPAWN_INTERVAL, scaledInterval);
};

// Calculate number of enemies to spawn based on game time
const calculateEnemyCount = (gameTime) => {
  if (gameTime < ENEMY_SCALING_START_TIME) return 1;
  
  // Exponential growth with a cap
  const baseCount = 1;
  const timeFactor = Math.log10(gameTime + 1);
  const additionalEnemies = Math.floor(timeFactor * 1.5); // More aggressive scaling
  
  return Math.min(baseCount + additionalEnemies, MAX_ENEMIES_PER_SPAWN);
};

const Game = ({ onGameOver }) => {
  const [playerPosition, setPlayerPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [playerDirection, setPlayerDirection] = useState({ x: 0, y: -1 });
  const [bullets, setBullets] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [powerups, setPowerups] = useState([]);
  const [gameTime, setGameTime] = useState(0);
  const [kills, setKills] = useState(0);
  const [powerupsCollected, setPowerupsCollected] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [fireRate, setFireRate] = useState(BASE_FIRE_RATE);
  const [explosionRadius, setExplosionRadius] = useState(BASE_EXPLOSION_RADIUS);
  const [isPoweredUp, setIsPoweredUp] = useState(false);
  const lastFireRef = useRef(0);
  const [explosions, setExplosions] = useState([]);
  const [currentSpawnInterval, setCurrentSpawnInterval] = useState(INITIAL_ENEMY_SPAWN_INTERVAL);
  const [isPaused, setIsPaused] = useState(false);
  const [gameSize, setGameSize] = useState({ width: 0, height: 0 });
  const gameContainerRef = useRef(null);
  const backgroundMusicRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);

  // Initialize background music
  useEffect(() => {
    backgroundMusicRef.current = new Howl({
      src: [brrMusic],
      loop: true,
      volume: 0.5,
      mute: isMuted
    });

    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.stop();
      }
    };
  }, []);

  // Handle game over
  useEffect(() => {
    if (isGameOver && backgroundMusicRef.current) {
      backgroundMusicRef.current.stop();
    }
  }, [isGameOver]);

  // Handle pause state
  useEffect(() => {
    if (backgroundMusicRef.current) {
      if (isPaused) {
        backgroundMusicRef.current.pause();
      } else {
        backgroundMusicRef.current.play();
      }
    }
  }, [isPaused]);

  // Calculate and update game size
  const updateGameSize = useCallback(() => {
    const padding = 40; // Padding from viewport edges
    const maxWidth = window.innerWidth - padding;
    const maxHeight = window.innerHeight - padding;
    const aspectRatio = 16 / 9; // Maintain 16:9 aspect ratio

    let width = maxWidth;
    let height = width / aspectRatio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    setGameSize({ width, height });
  }, []);

  // Initialize and update game size
  useEffect(() => {
    updateGameSize();
    window.addEventListener('resize', updateGameSize);
    return () => window.removeEventListener('resize', updateGameSize);
  }, [updateGameSize]);

  // Update player position constraints
  const constrainPlayerPosition = useCallback((position) => {
    const padding = 20; // Padding from game container edges
    const containerRect = gameContainerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return position;

    return {
      x: Math.min(Math.max(padding, position.x), containerRect.width - padding),
      y: Math.min(Math.max(padding, position.y), containerRect.height - padding)
    };
  }, []);

  // Modify handleMovement to use constrained position
  const handleMovement = useCallback((keys) => {
    setPlayerPosition(prev => {
      const speed = 5;
      let newX = prev.x;
      let newY = prev.y;
      let newDirection = { x: 0, y: 0 };

      if (keys.ArrowUp) {
        newY = prev.y - speed;
        newDirection.y = -1;
      }
      if (keys.ArrowDown) {
        newY = prev.y + speed;
        newDirection.y = 1;
      }
      if (keys.ArrowLeft) {
        newX = prev.x - speed;
        newDirection.x = -1;
      }
      if (keys.ArrowRight) {
        newX = prev.x + speed;
        newDirection.x = 1;
      }

      if (newDirection.x !== 0 || newDirection.y !== 0) {
        setPlayerDirection(newDirection);
      }

      const constrained = constrainPlayerPosition({ x: newX, y: newY });
      return constrained;
    });
  }, [constrainPlayerPosition]);

  // Initialize player position at center of game container
  useEffect(() => {
    setPlayerPosition({
      x: gameSize.width / 2,
      y: gameSize.height / 2
    });
  }, [gameSize]);

  const spawnEnemy = useCallback(() => {
    const side = Math.floor(Math.random() * 4);
    const containerRect = gameContainerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    const createEnemy = () => {
      let x, y;
      let offsetRange = 150;
      const { width, height } = containerRect;

      switch (side) {
        case 0: // top
          x = Math.random() * width;
          y = -20;
          break;
        case 1: // right
          x = width + 20;
          y = Math.random() * height;
          break;
        case 2: // bottom
          x = Math.random() * width;
          y = height + 20;
          break;
        case 3: // left
          x = -20;
          y = Math.random() * height;
          break;
      }

      x += (Math.random() - 0.5) * offsetRange;
      y += (Math.random() - 0.5) * offsetRange;

      return { x, y, id: Date.now() + Math.random() };
    };

    const enemiesToSpawn = calculateEnemyCount(gameTime);
    const newEnemies = Array(enemiesToSpawn).fill(null).map(() => createEnemy());
    setEnemies(prev => [...prev, ...newEnemies]);
  }, [gameTime]);

  const spawnPowerup = useCallback(() => {
    const containerRect = gameContainerRef.current?.getBoundingClientRect();
    
    if (!containerRect) return;
    
    const padding = 40;
    const x = Math.random() * (containerRect.width - 2 * padding) + padding;
    const y = Math.random() * (containerRect.height - 2 * padding) + padding;
    const spawnTime = Date.now();

    setPowerups(prev => [...prev, { x, y, id: Date.now(), spawnTime }]);
  }, []);

  useEffect(() => {
    const keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
    };

    const handleKeyDown = (e) => {
      if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = true;
      }
    };

    const handleKeyUp = (e) => {
      if (keys.hasOwnProperty(e.key)) {
        keys[e.key] = false;
      }
    };

    const gameLoop = setInterval(() => {
      handleMovement(keys);
    }, 16);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleMovement]);

  // Handle pause key
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.toLowerCase() === 'p') {
        setIsPaused(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Modify game timer to respect pause
  useEffect(() => {
    if (isGameOver || isPaused) return;
    
    const timer = setInterval(() => {
      setGameTime(t => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver, isPaused]);

  // Update enemy spawn interval based on game time
  useEffect(() => {
    const newInterval = calculateSpawnInterval(gameTime);
    setCurrentSpawnInterval(newInterval);
  }, [gameTime]);

  // Modify enemy spawning to respect pause
  useEffect(() => {
    if (isGameOver || isPaused) return;
    
    const enemySpawner = setInterval(spawnEnemy, currentSpawnInterval);
    return () => clearInterval(enemySpawner);
  }, [spawnEnemy, isGameOver, currentSpawnInterval, isPaused]);

  // Modify powerup spawning to respect pause
  useEffect(() => {
    if (isGameOver || isPaused) return;
    
    const spawnNewPowerup = () => {
      spawnPowerup();
      const nextSpawn = Math.random() * (POWERUP_SPAWN_MAX_INTERVAL - POWERUP_SPAWN_MIN_INTERVAL) + POWERUP_SPAWN_MIN_INTERVAL;
      setTimeout(spawnNewPowerup, nextSpawn);
    };

    const initialSpawn = setTimeout(spawnNewPowerup, POWERUP_SPAWN_MIN_INTERVAL);
    return () => clearTimeout(initialSpawn);
  }, [spawnPowerup, isGameOver, isPaused]);

  const fireBullet = useCallback(() => {
    const now = Date.now();
    if (now - lastFireRef.current < 1000 / fireRate) {
      return; // Too soon to fire again
    }
    
    lastFireRef.current = now;
    
    let bulletDirection = {
      x: -playerDirection.x,
      y: -playerDirection.y,
    };
    
    // Normalize the direction vector
    const magnitude = Math.sqrt(bulletDirection.x * bulletDirection.x + bulletDirection.y * bulletDirection.y);
    if (magnitude === 0) {
      bulletDirection = { x: 0, y: -1 }; // Default shooting upward
    } else {
      bulletDirection.x = bulletDirection.x / magnitude;
      bulletDirection.y = bulletDirection.y / magnitude;
    }

    const newBullet = {
      x: playerPosition.x,
      y: playerPosition.y,
      dx: bulletDirection.x * BULLET_SPEED,
      dy: bulletDirection.y * BULLET_SPEED,
      id: Date.now(),
      createdAt: now
    };

    setBullets(prev => prev.length >= MAX_BULLETS ? prev : [...prev, newBullet]);
  }, [playerPosition, playerDirection, fireRate]);

  // Modify game update loop to respect pause
  useEffect(() => {
    if (isGameOver || isPaused) return;
    
    const updateGame = () => {
      fireBullet();

      setBullets(prev => {
        const now = Date.now();
        const activeBullets = prev
          .filter(bullet => {
            const isOnScreen = bullet.x >= 0 && bullet.x <= gameSize.width &&
                             bullet.y >= 0 && bullet.y <= gameSize.height;
            const isNotTooOld = now - bullet.createdAt < 5000;
            return isOnScreen && isNotTooOld;
          })
          .map(bullet => ({
            ...bullet,
            x: bullet.x + bullet.dx,
            y: bullet.y + bullet.dy
          }));
        return activeBullets;
      });

      setEnemies(prevEnemies => {
        const updatedEnemies = prevEnemies
          .map(enemy => {
            const dx = playerPosition.x - enemy.x;
            const dy = playerPosition.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const speed = 2;
            
            return {
              ...enemy,
              x: enemy.x + (dx / distance) * speed,
              y: enemy.y + (dy / distance) * speed
            };
          })
          .filter(enemy => {
            // Check if enemy is hit by bullet
            const hitByBullet = bullets.some(bullet => {
              const dx = enemy.x - bullet.x;
              const dy = enemy.y - bullet.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              return distance < 20;
            });

            // Check if enemy is caught in an explosion
            const caughtInExplosion = explosions.some(explosion => {
              const dx = enemy.x - explosion.x;
              const dy = enemy.y - explosion.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              return distance < explosionRadius; // Use dynamic explosion radius
            });

            if (hitByBullet || caughtInExplosion) {
              setKills(k => k + 1);
              // Create new explosion at enemy position
              setExplosions(prev => [...prev, {
                x: enemy.x,
                y: enemy.y,
                id: Date.now() + Math.random(),
                createdAt: Date.now()
              }]);
              return false;
            }
            return true;
          });

        // Update explosions with timing
        setExplosions(prev => prev.filter(explosion => {
          const age = Date.now() - explosion.id;
          return age < 500; // Explosion duration
        }));

        return updatedEnemies;
      });

      enemies.forEach(enemy => {
        const dx = playerPosition.x - enemy.x;
        const dy = playerPosition.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 20) {
          setIsGameOver(true);
        }
      });

      setPowerups(prev => {
        return prev.filter(powerup => {
          const dx = playerPosition.x - powerup.x;
          const dy = playerPosition.y - powerup.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 30) {
            // Set powered up state
            setIsPoweredUp(true);
            // Increase fire rate
            setFireRate(r => r * POWERUP_FIRE_RATE_MULTIPLIER);
            // Increase explosion radius
            setExplosionRadius(BASE_EXPLOSION_RADIUS * 1.5);
            setPowerupsCollected(p => p + 1);
            
            // Reset after duration
            setTimeout(() => {
              setIsPoweredUp(false);
              setFireRate(r => r / POWERUP_FIRE_RATE_MULTIPLIER);
              setExplosionRadius(BASE_EXPLOSION_RADIUS);
            }, POWERUP_DURATION);
            return false;
          }
          
          if (Date.now() - powerup.spawnTime > POWERUP_VISIBLE_DURATION) {
            return false;
          }
          
          return true;
        });
      });
    };

    const gameLoop = setInterval(updateGame, 16);
    return () => clearInterval(gameLoop);
  }, [playerPosition, enemies, playerDirection, fireBullet, bullets, isGameOver, isPaused, gameSize]);

  // Handle mute toggle
  const handleMuteToggle = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.mute(newMuted);
      }
      return newMuted;
    });
  }, []);

  if (isGameOver) {
    return (
      <GameOverScreen
        time={gameTime}
        kills={kills}
        powerups={powerupsCollected}
        onOk={() => {
          onGameOver({
            time: gameTime,
            kills: kills,
            powerups: powerupsCollected
          });
        }}
      />
    );
  }

  return (
    <GameWrapper>
      <GameContainer ref={gameContainerRef} width={gameSize.width} height={gameSize.height}>
        <StatsOverlay>
          Time: {gameTime}s<br />
          Kills: {kills}<br />
          Powerups: {powerupsCollected}
        </StatsOverlay>
        <MuteButton onClick={handleMuteToggle}>
          {isMuted ? 'UNMUTE' : 'MUTE'}
        </MuteButton>
        <Player 
          x={playerPosition.x} 
          y={playerPosition.y} 
          direction={playerDirection}
          isPoweredUp={isPoweredUp}
        />
        {enemies.map(enemy => (
          <Enemy key={enemy.id} x={enemy.x} y={enemy.y} />
        ))}
        {bullets.map(bullet => (
          <div
            key={bullet.id}
            style={{
              position: 'absolute',
              left: bullet.x,
              top: bullet.y,
              width: '4px',
              height: '4px',
              backgroundColor: '#ffd700',
              borderRadius: '50%',
            }}
          />
        ))}
        {powerups.map(powerup => (
          <Powerup key={powerup.id} x={powerup.x} y={powerup.y} />
        ))}
        {explosions.map(explosion => (
          <Explosion key={explosion.id} x={explosion.x} y={explosion.y} />
        ))}
        {isPaused && (
          <PauseOverlay>
            <PauseContent>PAUSED</PauseContent>
          </PauseOverlay>
        )}
      </GameContainer>
    </GameWrapper>
  );
};

export default Game; 