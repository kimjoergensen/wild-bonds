# Wild Bonds 🎮

A browser-based creature catching and fighting game built with TypeScript and Vite, inspired by classic creature-collection RPGs like Pokémon.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

## 🎯 Game Features

- **Top-down 2D exploration** with grid-based movement
- **Turn-based battle system** with Fight, Catch, and Run options
- **Creature collection** with stats, types, and move systems
- **Type effectiveness** system
- **Real-time rendering** with smooth 60fps gameplay
- **Keyboard controls** optimized for desktop play

## 🎮 Controls

## Game Features
### Current Features (v1.0)
- **Exploration Mode**: Top-down 2D world navigation
- **Battle System**: Turn-based combat with multiple actions (Fight, Catch, Run)
- **Creature System**: Basic creature stats, types, and moves
- **Input Handling**: Keyboard controls for movement and battle interactions
- **Scene Management**: Seamless transitions between exploration and battle modes
- **Type effectiveness** system (fire beats grass, water beats fire, etc.)
- **Real-time rendering** with smooth 60fps gameplay
- **Keyboard controls** optimized for desktop play
| -------------- | ---------------------- |
| Move           | Arrow Keys or WASD     |
| Confirm        | Space or Enter         |
| Cancel         | Escape                 |
| Random Battle  | Space (in exploration) |
| Navigate Menus | Arrow Keys             |

## 🏗️ Architecture

- **TypeScript** for type-safe development
- **Vite** for fast builds and hot module replacement
- **Canvas 2D API** for hardware-accelerated rendering
- **Modular design** with clean separation of concerns
src/
├── core/           # Game engine (Game, SceneManager, Scene)
├── scenes/         # Game states (Exploration, Battle)
├── systems/        # Input handling and other systems
├── entities/       # Game objects (Player, Creature)
├── types/          # TypeScript interfaces and types
├── utils/          # Data and utility functions
└── main.ts         # Application entry point

docs/               # Game design and feature documentation
public/             # Graphics and audio (tilesets, sprites)
```

## 🎨 Asset Guidelines

The game is designed for **16x16 pixel art**:

- Place tilesets in `public/tilesets/`
- Place creature/character sprites in `public/sprites/`
- Use consistent pixel art style
- Support 2x/3x scaling for different screen sizes

---

**Built with ❤️ using TypeScript and Vite**
## 🤝 Contributing
