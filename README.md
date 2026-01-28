# Space Invaders - Retro Edition

A classic Space Invaders game built with HTML5 Canvas and vanilla JavaScript. Features retro neo-green styling with modern gameplay mechanics.

## Features

- **Player Ship**: Control your ship with arrow keys (← →) to dodge and attack
- **Dual Guns with Progressive Spread**: Fire two bullets from your ship's gun turrets, with guns spreading further apart as you advance through waves
- **Spreading Bullets**: Bullets spread outward horizontally as they travel upward, covering a wider area of the battlefield
- **Bonus Lives**: Earn extra lives every 2000 points - spectacular fireworks celebration with golden, silver, and cyan particle bursts rewards your score milestones
- **Enemy Waves**: Progressive difficulty with enemies speeding up each wave
- **Scoring System**: Earn points by destroying enemies, increasing points per wave
- **Lives System**: Start with 3 lives; lose them by enemy fire or enemies reaching the bottom
- **Retro Aesthetics**: Authentic green monochrome CRT monitor styling with glow effects
- **Particle Effects**: Visual feedback with explosion particles on enemy destruction
- **Progressive Gameplay**: Enemies increase in speed with each wave

## How to Play

1. Open `index.html` in a modern web browser
2. Use **← →** Arrow Keys to move your ship left and right
3. Press **SPACE** to shoot
4. Destroy all enemies before they reach you
5. Survive wave after wave to increase your score

## Game Mechanics

- **Player**: Located at the bottom of the screen, can move horizontally and shoot upward with dual guns
- **Dual Gun System**: Each shot fires two bullets from the left and right gun turrets simultaneously
- **Spreading Bullets**: Left bullet spreads left (-2px/frame), right bullet spreads right (+2px/frame), creating a cone of fire that widens as bullets travel upward
- **Progressive Gun Spread**: Starting at Wave 2, your guns gradually spread further apart:
  - Waves 1: Guns at 25% and 75% of ship width
  - Wave 2: Guns at 15% and 85% of ship width (wider spread)
  - Wave 3+: Guns spread up to 10% and 90% of ship width (maximum spread)
  - This wider spread helps cover more of the battlefield as enemies get stronger
- **Enemies**: Arranged in rows, moving side-to-side and descending each time they hit a wall
- **Waves**: Each completed wave increases enemy speed and points per kill
- **Enemy Fire**: Enemies randomly shoot bullets down at you
- **Lives**: You have 3 lives; game ends when lives reach 0
- **Game Over**: Triggered when you lose all lives or enemies reach the bottom

## Scoring

- Each enemy destroyed awards points (10 + 5 × wave number)
- Wave 1: 10 points per enemy
- Wave 2: 15 points per enemy
- Wave 3: 20 points per enemy
- And so on...

## Bonus Lives System

- Every **2000 points**, you earn a bonus life with an explosive fireworks celebration!
- Score milestones:
  - 2000 points: +1 life + FIREWORKS!
  - 4000 points: +1 life + FIREWORKS!
  - 6000 points: +1 life + FIREWORKS!
  - And so on...
- **Fireworks Display** when you earn a bonus life:
  - **Center Burst**: 24 golden particles exploding from the center
  - **Left Burst**: 20 silver particles from the left side
  - **Right Burst**: 20 cyan particles from the right side
  - Total of **64 particles** with motion trails and gravity effects
  - Particles glow and fade out for a spectacular visual display
- Unlimited bonus lives available - no cap on how many lives and fireworks celebrations you can earn!

## Technical Details

- Built with vanilla JavaScript (no frameworks)
- HTML5 Canvas for rendering
- Responsive event-driven architecture
- Object-oriented game design with dedicated classes
- Smooth 60 FPS gameplay with requestAnimationFrame

## Files

- `index.html` - Main HTML file with styling and UI structure
- `game.js` - Game engine and all game logic
- `AGENTS.md` - Development guidelines for agentic coding

## Browser Compatibility

Works on all modern browsers that support:
- HTML5 Canvas
- ES6 JavaScript
- CSS3 (animations, gradients, shadows)

## Mobile & Android Support

The game is fully optimized for mobile devices and can be packaged as an Android APK.

### Mobile Features
- Touch-friendly controls with on-screen buttons (left, right, fire)
- Responsive layout that adapts to any screen size
- Supports both portrait and landscape orientations
- Optimized touch event handling for smooth gameplay

### Building for Android

#### Prerequisites
- Node.js and npm
- Java Development Kit (JDK) 11 or higher
- Android SDK and build tools
- Android Studio (optional but recommended)

#### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build the Web Version**
   ```bash
   npm run build
   ```
   This compiles any TypeScript/modern JS and prepares the project.

3. **Add Android Platform**
   ```bash
   npx capacitor add android
   ```
   This creates the Android project structure in the `android/` directory.

4. **Sync Changes**
   ```bash
   npx capacitor sync android
   ```
   This syncs the web app with the Android project.

5. **Build APK**
   
   **Using Capacitor CLI:**
   ```bash
   npx capacitor build android --release
   ```

   **Or using Android Studio:**
   - Open Android Studio
   - Select "Open an Existing Project"
   - Navigate to the `android/` directory
   - Build → Generate Signed Bundle / APK
   - Follow the wizard to create a signed APK

#### Output
The generated APK will be located at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Testing on Device

**Using Android Studio:**
1. Connect your Android device via USB
2. Enable USB Debugging on your device
3. Click the Run button in Android Studio
4. Select your device from the list

**Using Command Line:**
```bash
# Install APK on connected device
adb install android/app/build/outputs/apk/release/app-release.apk

# Or use Capacitor
npx capacitor run android
```

### APK Installation
1. Transfer the APK file to your Android device
2. Open the APK file in your file manager
3. Follow the installation prompts
4. Tap "Install" and wait for completion
5. Open the Space Invaders app from your apps list

### Troubleshooting

**"command not found: npm"**
- Install Node.js from https://nodejs.org/

**"Java not found"**
- Install JDK from https://www.oracle.com/java/

**"Android SDK not found"**
- Install Android Studio and configure the Android SDK path
- Or set `ANDROID_SDK_ROOT` environment variable

**APK Installation Fails**
- Ensure your device allows installation from unknown sources
- Settings → Security → Unknown Sources (enable)
- Try uninstalling any previous version first

**Touch Controls Not Working**
- Ensure you're on a touch-capable device or emulator
- Check browser console for JavaScript errors (F12)
- Verify touch events are not prevented by other handlers

## Deployment & CI/CD

### Web Deployment (GitHub Pages)

The game is automatically deployed to GitHub Pages on every push to the `main` branch.

**Play Online**: https://viloun.github.io/space-invaders

The deployment is handled automatically by the `deploy-pages.yml` workflow.

### Automatic Android APK Builds

GitHub Actions automatically builds an APK on every push to `main` or `develop` branches, and on pull requests.

**Build Status**: Check the [Actions tab](https://github.com/viloun/space-invaders/actions) for build logs

**Accessing Built APKs**:
1. Go to [GitHub Actions](https://github.com/viloun/space-invaders/actions)
2. Click on any "Build Android APK" workflow run
3. Scroll down to "Artifacts"
4. Download `space-invaders-release-apk`

### Creating Releases with APKs

To create a release with a built APK:

1. **Create a Git tag**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. The `release.yml` workflow will automatically:
   - Build the Android APK
   - Create a GitHub Release
   - Upload the APK to the release

3. **Download from Release**:
   - Go to [Releases](https://github.com/viloun/space-invaders/releases)
   - Download the APK from the release assets

### GitHub Actions Workflows

This project includes three automated workflows:

1. **android-build.yml** - Builds Android APK on push to main/develop and PRs
2. **deploy-pages.yml** - Deploys web version to GitHub Pages on push to main
3. **release.yml** - Builds and releases APK when a tag is pushed

All workflows run automatically - no manual intervention needed!

## Tips for Playing

- Stay mobile and unpredictable to avoid enemy fire
- Aim for patterns in enemy formation
- Your bullets spread outward as they travel - use this cone of fire to hit multiple enemies
- Your guns will spread further apart as you progress through waves - use this to your advantage!
- In later waves, position yourself to maximize coverage with your spread guns and spreading bullets
- Focus on reaching 2000-point milestones to earn bonus lives and trigger amazing fireworks!
- Watch for the explosive fireworks display - it means you've earned a bonus life
  - Center golden burst, side silver and cyan bursts
  - Keep an eye out for the spectacular light show!
- Each bonus life you earn gives you more chances to reach higher scores and trigger more fireworks
- Each wave increases difficulty significantly but also increases point rewards
- Chain together bonus life milestones for continuous fireworks celebrations!

Enjoy the retro experience!
