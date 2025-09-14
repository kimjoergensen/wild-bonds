# Game Design Document - Wild Bonds

## Core Game Loop

### Primary Gameplay Flow
1. **Exploration Phase**
   - Player moves through overworld using arrow keys/WASD
   - Grid-based movement with smooth character animation
   - Random encounters triggered in grass areas
   - Environmental storytelling through world design

2. **Battle Phase**  
   - Turn-based combat system
   - Player chooses actions: Fight, Catch, Run
   - Creature health, stats, and type effectiveness determine outcomes
   - Victory yields experience; catching adds creatures to collection

3. **Collection Phase**
   - Manage captured creatures in inventory
   - Level up creatures through battle experience
   - Strategic team building for different challenges

## Combat System Design

### Battle Mechanics
- **Turn Order**: Determined by creature Speed stat
- **Damage Formula**: `(Attack - Defense) + RandomVariation`
- **Type Effectiveness**: 2x super effective, 0.5x not very effective, 0x immune
- **Critical Hits**: 6.25% chance for 1.5x damage (future feature)

### Catch Mechanics
- **Base Catch Rate**: Each creature type has inherent catchability
- **Health Factor**: Lower HP increases capture chance
- **Formula**: `CatchRate + (1 - CurrentHP/MaxHP) * 0.4`
- **Maximum Rate**: 90% (even weakened creatures can escape)

### Status System (Future)
- **Burn**: Deals damage over time, reduces Attack
- **Poison**: Deals increasing damage each turn  
- **Sleep**: Prevents action, increases catch rate
- **Paralysis**: 25% chance to skip turn, reduces Speed
- **Freeze**: Prevents action until thawed

## World Design Philosophy

### Environment Types
1. **Grass Areas**: 
   - Primary exploration zones
   - Random wild creature encounters
   - Various grass types indicate creature rarity

2. **Water Bodies**:
   - Requires special traversal (future: surfing)
   - Water-type creature habitats
   - Fishing mechanics (future feature)

3. **Pathways**:
   - Safe travel routes between areas
   - No random encounters
   - Connect major locations

4. **Forests/Trees**:
   - Dense encounter areas
   - Bug and Grass-type creatures
   - Hidden items and secrets

### Area Progression
- **Starting Area**: Tutorial zone with basic creatures
- **Route System**: Linear progression with branching paths
- **Cities/Towns**: Safe zones with NPCs, shops, healing
- **Dungeons**: Challenging areas with rare creatures
- **End-game Areas**: High-level creatures and legendaries

## Creature Design Framework

### Stat Distribution Philosophy
- **Balanced**: Even stat spread for versatility
- **Offensive**: High Attack/Speed, low Defense/HP
- **Defensive**: High Defense/HP, low Attack/Speed
- **Specialist**: Extreme stats in one area

### Type Interaction Matrix

Move types can range in effectiveness from 0x to 2x damage:
- futile:      0 (0x)
- ineffective: - (0.5x)
- normal:        (1x)
- effective:   + (1.5x)
- powerfule:   # (2x)

| ↓ Move type / creature type → | CRITTER | AVIAN | AQUATIC | REPTILE | PLANT | GHOST | DRAGON |
| ----------------------------- | :-----: | :---: | :-----: | :-----: | :---: | :---: | :----: |
| **NORMAL**                    |         |       |         |         |       |       |        |
| **FIRE**                      |    +    |       |    -    |         |   #   |       |   0    |
| **WATER**                     |         |   -   |         |    +    |   -   |       |   +    |
| **GRASS**                     |         |       |    +    |         |   -   |       |   -    |
| **ICE**                       |    -    |       |    -    |    +    |       |       |   #    |
| **ELECTRIC**                  |         |   +   |    +    |         |   -   |       |   -    |
| **POISON**                    |         |       |         |    -    |   +   |       |        |
| **SHADOW**                    |         |       |         |    -    |       |   #   |        |

### Creature Evolution Design
- **Stage 1**: Basic creatures (levels 1-15)
- **Stage 2**: First evolution (levels 16-35) 
- **Stage 3**: Final evolution (level 36+)
- **Branch Evolution**: Multiple evolution paths based on conditions
- **Trade Evolution**: Requires player interaction (future)

## User Interface Design

### Battle Interface Layout
```
┌─────────────────────────────────────────────────┐
│  Enemy Creature HP: ████████░░ 80/100          │
│  [Enemy Creature Sprite]                        │
│                                                 │  
│                        [Player Creature Sprite] │
│  Player Creature HP: ██████░░░░ 60/100         │
│                                                 │
│  ┌─────────────────────────────────────────────┐ │
│  │ What will Sparky do?                        │ │
│  │ > Fight    Bag                              │ │
│  │   Creature Run                              │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

### Exploration Interface
```
┌─────────────────────────────────────────────────┐
│ [World Map View]                                │
│                                                 │
│  ┌─World─┐  ┌─Creatures─┐  ┌─Bag─┐  ┌─Menu─┐   │
│  │ Route1 │  │    6/6    │  │ 12 │  │ Save │   │
│  └───────┘  └───────────┘  └────┘  └──────┘   │
│                                                 │
│ [Player Character centered in viewport]         │
└─────────────────────────────────────────────────┘
```

## Technical Specifications

### Performance Targets
- **Frame Rate**: Stable 60 FPS
- **Load Time**: < 3 seconds initial load
- **Memory Usage**: < 100MB peak
- **Bundle Size**: < 2MB compressed

### Supported Platforms
- **Primary**: Modern desktop browsers (Chrome, Firefox, Safari, Edge)
- **Secondary**: Mobile browsers (iOS Safari, Chrome Mobile)
- **Future**: Native desktop apps via Electron
- **Future**: Mobile apps via Cordova/Capacitor

### Asset Requirements
- **Sprites**: 16x16 base resolution, 2x/3x scaling
- **Tilesets**: 16x16 tiles, seamless tiling
- **UI Elements**: Vector-based for crisp scaling
- **Audio**: OGG Vorbis primary, MP3 fallback

## Monetization Strategy (Future)

### Free-to-Play Model
- **Core Game**: Completely free
- **Cosmetics**: Optional creature skins, player customization
- **Convenience**: Faster progression, storage expansion
- **Content**: Premium areas, exclusive creatures

### Ethical Guidelines
- No pay-to-win mechanics
- All gameplay content earnable through play
- Clear distinction between cosmetic and functional items
- Generous free currency distribution

## Community and Social Features

### Player Interaction
- **Trading**: Safe, secure creature exchanges
- **Battles**: Competitive multiplayer matches  
- **Cooperation**: Team raids on powerful creatures
- **Sharing**: Screenshot and achievement sharing

### Content Creation
- **Map Editor**: Community-created areas
- **Creature Designer**: Custom creature submissions
- **Mod Support**: Gameplay modifications
- **Event System**: Community challenges and tournaments

---

*This design document serves as the foundation for Wild Bonds development and will evolve as the game grows.*