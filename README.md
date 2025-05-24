# Browser Tetris

A classic Tetris implementation using vanilla JavaScript and HTML5 Canvas.

## Overview

This project is a modern implementation of the classic Tetris game that runs in the browser. It features:

- Smooth gameplay using HTML5 Canvas
- Classic Tetris scoring system
- Level progression with increasing difficulty
- Next piece preview
- Modern, clean UI design

## Technologies Used

- HTML5 Canvas for game rendering
- Vanilla JavaScript for game logic
- CSS3 for styling
- No external dependencies required

## Project Structure

```
tetris/
├── index.html      # Main HTML file
├── styles.css      # CSS styles
└── tetris.js       # Game logic
```

## How to Play

1. Open `index.html` in a modern web browser
2. The game starts automatically
3. Use the following controls:
   - ← → (Left/Right Arrow): Move piece horizontally
   - ↑ (Up Arrow): Rotate piece
   - ↓ (Down Arrow): Soft drop
   - Space: Hard drop

## Game Features

### Scoring System
- 1 line: 40 × level
- 2 lines: 100 × level
- 3 lines: 300 × level
- 4 lines: 1200 × level

### Level Progression
- Level increases for every 1000 points
- Each level increases the falling speed of pieces
- Maximum fall speed is capped at level 10

## Implementation Details

The game is built using modern JavaScript features and follows these key principles:

1. **Game Loop**: Uses `requestAnimationFrame` for smooth animation
2. **Collision Detection**: Implements piece-board collision checking for movement and rotation
3. **Piece Generation**: Random piece generation with next piece preview
4. **Board Management**: Efficient line clearing and board state management

## Running Locally

1. Clone or download this repository
2. No build process or dependencies required
3. Open `index.html` in your web browser
4. Start playing!

## Browser Compatibility

Works in all modern browsers that support HTML5 Canvas:
- Chrome
- Firefox
- Safari
- Edge

## Future Improvements

Potential enhancements that could be added:
- High score persistence
- Sound effects
- Mobile touch controls
- Multiplayer support
- Hold piece feature
- Ghost piece preview 