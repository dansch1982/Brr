# Gun Go Brrr

A retro-styled top-down auto-shooter game built with React.

## Features

- Retro-inspired UI with 80s color scheme
- Auto-shooting mechanics
- Power-ups that increase fire rate
- High score system
- Enemy spawning from all sides
- Responsive controls

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## How to Play

- Use arrow keys to move your character
- The character automatically shoots in the opposite direction of movement
- Collect purple K power-ups to increase fire rate temporarily
- Press P to pause the game
- Click MUTE button in top-right corner to toggle sound
- Avoid red enemies
- Try to survive as long as possible!

## Adding Background Music

To add background music:

1. Place your music file in the `public` directory
2. Uncomment the background music code in `src/components/Game.jsx`
3. Update the `src` path to point to your music file

## Technologies Used

- React
- Styled Components
- Howler.js (for audio)
- Vite

## Play Now

Visit https://dansch1982.github.io/Brr/ to play the game!
