// Game Configuration
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 30;
const PLAYER_SPEED = 5;
const ENEMY_WIDTH = 35;
const ENEMY_HEIGHT = 25;
const BULLET_WIDTH = 5;
const BULLET_HEIGHT = 15;
const BULLET_SPEED = 7;
const ENEMY_BULLET_SPEED = 4;

// Difficulty Levels Configuration
const DIFFICULTIES = {
    EASY: {
        name: 'Easy',
        enemySpeedMultiplier: 0.6,
        enemySpawnRate: 45, // frames between enemy shots
        enemyBulletSpeedMultiplier: 0.7,
        scoreMultiplier: 0.5,
        bonusLifeInterval: 3000, // points needed for bonus life
    },
    NORMAL: {
        name: 'Normal',
        enemySpeedMultiplier: 1.0,
        enemySpawnRate: 30,
        enemyBulletSpeedMultiplier: 1.0,
        scoreMultiplier: 1.0,
        bonusLifeInterval: 2000,
    },
    HARD: {
        name: 'Hard',
        enemySpeedMultiplier: 1.5,
        enemySpawnRate: 20,
        enemyBulletSpeedMultiplier: 1.3,
        scoreMultiplier: 1.5,
        bonusLifeInterval: 1500,
    },
    INSANE: {
        name: 'Insane',
        enemySpeedMultiplier: 2.0,
        enemySpawnRate: 15,
        enemyBulletSpeedMultiplier: 1.8,
        scoreMultiplier: 2.0,
        bonusLifeInterval: 1000,
    },
};

// Game States
const GAME_STATE = {
    PLAYING: 'playing',
    GAME_OVER: 'gameOver',
    WAVE_COMPLETE: 'waveComplete',
    PAUSED: 'paused',
};

// Sound Manager - Web Audio API synthesized retro arcade sounds
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.soundEnabled = true;
        this.soundQueue = [];
        this.isProcessingQueue = false;
        this.initAudioContext();
    }

    initAudioContext() {
        if (!this.audioContext) {
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioContext = new AudioContext();
            } catch (e) {
                console.log('Web Audio API not supported');
                this.soundEnabled = false;
            }
        }
    }

    playSound(type) {
        if (!this.soundEnabled || !this.audioContext) return;
        
        // Queue sound to play asynchronously to avoid blocking game loop
        this.soundQueue.push(type);
        
        if (!this.isProcessingQueue) {
            this.processQueue();
        }
    }

    processQueue() {
        if (this.soundQueue.length === 0) {
            this.isProcessingQueue = false;
            return;
        }

        this.isProcessingQueue = true;
        const type = this.soundQueue.shift();
        
        // Use requestAnimationFrame or setTimeout to avoid blocking
        requestAnimationFrame(() => {
            switch (type) {
                case 'shoot':
                    this.playShootSound();
                    break;
                case 'enemyDeath':
                    this.playEnemyDeathSound();
                    break;
                case 'waveComplete':
                    this.playWaveCompleteSound();
                    break;
                case 'gameOver':
                    this.playGameOverSound();
                    break;
                case 'bonusLife':
                    this.playBonusLifeSound();
                    break;
                case 'powerUp':
                    this.playPowerUpSound();
                    break;
            }
            
            // Process next sound in queue
            this.processQueue();
        });
    }

    playShootSound() {
        try {
            const now = this.audioContext.currentTime;
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
            osc.type = 'square';

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

            osc.start(now);
            osc.stop(now + 0.05);
        } catch (e) {
            // Silently handle any audio context errors
        }
    }

    playEnemyDeathSound() {
        try {
            const now = this.audioContext.currentTime;
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
            osc.type = 'triangle';

            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0, now + 0.1);

            osc.start(now);
            osc.stop(now + 0.1);
        } catch (e) {
            // Silently handle any audio context errors
        }
    }

    playWaveCompleteSound() {
        try {
            const now = this.audioContext.currentTime;
            const frequencies = [523, 659, 784, 523]; // C5, E5, G5, C5
            
            frequencies.forEach((freq, i) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.connect(gain);
                gain.connect(this.audioContext.destination);

                osc.frequency.setValueAtTime(freq, now);
                osc.type = 'sine';

                const startTime = now + (i * 0.05);
                gain.gain.setValueAtTime(0.08, startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

                osc.start(startTime);
                osc.stop(startTime + 0.3);
            });
        } catch (e) {
            // Silently handle any audio context errors
        }
    }

    playGameOverSound() {
        try {
            const now = this.audioContext.currentTime;
            const frequencies = [392, 349, 330, 294]; // G4, F4, E4, D4
            
            frequencies.forEach((freq, i) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.connect(gain);
                gain.connect(this.audioContext.destination);

                osc.frequency.setValueAtTime(freq, now);
                osc.type = 'sine';

                const startTime = now + (i * 0.1);
                gain.gain.setValueAtTime(0.1, startTime);
                gain.gain.exponentialRampToValueAtTime(0, startTime + 0.4);

                osc.start(startTime);
                osc.stop(startTime + 0.4);
            });
        } catch (e) {
            // Silently handle any audio context errors
        }
    }

    playBonusLifeSound() {
        try {
            const now = this.audioContext.currentTime;
            // Ascending arpeggio: C5, D5, E5, G5, C6
            const frequencies = [523, 587, 659, 784, 1047];
            
            frequencies.forEach((freq, i) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.connect(gain);
                gain.connect(this.audioContext.destination);

                osc.frequency.setValueAtTime(freq, now);
                osc.type = 'sine';

                const startTime = now + (i * 0.05);
                gain.gain.setValueAtTime(0.1, startTime);
                gain.gain.exponentialRampToValueAtTime(0, startTime + 0.25);

                osc.start(startTime);
                osc.stop(startTime + 0.25);
            });
        } catch (e) {
            // Silently handle any audio context errors
        }
    }

    playPowerUpSound() {
        try {
            const now = this.audioContext.currentTime;
            // High-pitched power-up sound: ascending high tones
            const frequencies = [784, 987, 1047, 1175]; // G5, B5, C6, D6
            
            frequencies.forEach((freq, i) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.connect(gain);
                gain.connect(this.audioContext.destination);

                osc.frequency.setValueAtTime(freq, now);
                osc.type = 'sine';

                const startTime = now + (i * 0.04);
                gain.gain.setValueAtTime(0.12, startTime);
                gain.gain.exponentialRampToValueAtTime(0, startTime + 0.2);

                osc.start(startTime);
                osc.stop(startTime + 0.2);
            });
        } catch (e) {
            // Silently handle any audio context errors
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }
}

const soundManager = new SoundManager();

// PowerUp Types and Configuration
const POWERUP_TYPES = {
    SHIELD: {
        name: 'Shield',
        icon: '🛡️',
        duration: 8000, // 8 seconds in milliseconds
        color: '#00ccff',
        glowColor: '#00ccff',
    },
    RAPID_FIRE: {
        name: 'Rapid Fire',
        icon: '⚡',
        duration: 6000, // 6 seconds
        color: '#ffaa00',
        glowColor: '#ffaa00',
    },
    MULTI_SHOT: {
        name: 'Multi-Shot',
        icon: '🔥',
        duration: 7000, // 7 seconds
        color: '#ff0080',
        glowColor: '#ff0080',
    },
};

// PowerUp Item Class - Drops from enemies
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.type = type;
        this.vx = (Math.random() - 0.5) * 2; // Random horizontal drift
        this.vy = 1.5; // Fall speed
        this.rotation = 0;
        this.rotationSpeed = 0.1;
    }

    update() {
        this.y += this.vy;
        this.x += this.vx;
        this.rotation += this.rotationSpeed;
        
        // Bounce off walls
        if (this.x < 0 || this.x + this.width > GAME_WIDTH) {
            this.vx *= -1;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        
        const config = POWERUP_TYPES[this.type];
        
        // Draw glow
        ctx.fillStyle = config.glowColor;
        ctx.shadowColor = config.glowColor;
        ctx.shadowBlur = 15;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        
        // Draw icon background
        ctx.fillStyle = config.color;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(-this.width / 2 + 2, -this.height / 2 + 2, this.width - 4, this.height - 4);
        ctx.globalAlpha = 1;
        
        // Draw icon text
        ctx.fillStyle = '#0a0e27';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(config.icon, 0, 0);
        
        ctx.shadowBlur = 0;
        ctx.restore();
    }
}

// PowerUp Manager - Handles active powerups on the player
class PowerUpManager {
    constructor(player) {
        this.player = player;
        this.activePowerUps = {};
        this.powerUpStartTimes = {};
        this.shieldPickupCount = 0; // Track number of shield pickups
    }

    addPowerUp(type) {
        // Track shield pickups to increase duration
        if (type === 'SHIELD') {
            this.shieldPickupCount++;
        }
        
        this.activePowerUps[type] = true;
        this.powerUpStartTimes[type] = Date.now();
    }

    update() {
        const now = Date.now();
        
        for (let type in this.activePowerUps) {
            let duration = POWERUP_TYPES[type].duration;
            
            // Increase shield duration by 2 seconds for each shield pickup
            if (type === 'SHIELD') {
                duration = POWERUP_TYPES[type].duration + (this.shieldPickupCount - 1) * 2000;
            }
            
            const elapsed = now - this.powerUpStartTimes[type];
            
            if (elapsed > duration) {
                delete this.activePowerUps[type];
                delete this.powerUpStartTimes[type];
            }
        }
    }

    hasPowerUp(type) {
        return this.activePowerUps[type] === true;
    }

    getRemainingTime(type) {
        if (!this.hasPowerUp(type)) return 0;
        const now = Date.now();
        let duration = POWERUP_TYPES[type].duration;
        
        // Increase shield duration by 2 seconds for each shield pickup
        if (type === 'SHIELD') {
            duration = POWERUP_TYPES[type].duration + (this.shieldPickupCount - 1) * 2000;
        }
        
        const elapsed = now - this.powerUpStartTimes[type];
        return Math.max(0, duration - elapsed);
    }

    clear() {
        this.activePowerUps = {};
        this.powerUpStartTimes = {};
    }
}

// High Score Management
class HighScoreManager {
    constructor() {
        this.storageKey = 'spaceInvadersHighScores';
        this.maxScores = 10;
        this.loadScores();
    }

    loadScores() {
        const stored = localStorage.getItem(this.storageKey);
        this.scores = stored ? JSON.parse(stored) : [];
    }

    saveScores() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.scores));
    }

    addScore(name, score) {
        const timestamp = new Date().toISOString();
        const entry = { name, score, timestamp };
        
        this.scores.push(entry);
        this.scores.sort((a, b) => b.score - a.score);
        this.scores = this.scores.slice(0, this.maxScores);
        
        this.saveScores();
        return this.isHighScore(score);
    }

    isHighScore(score) {
        if (this.scores.length < this.maxScores) return true;
        return score > this.scores[this.scores.length - 1].score;
    }

    getScores() {
        return this.scores;
    }

    getHighScoreRank(score) {
        for (let i = 0; i < this.scores.length; i++) {
            if (score > this.scores[i].score) return i + 1;
        }
        return this.scores.length + 1;
    }
}

const highScoreManager = new HighScoreManager();


// Statistics Manager Class - tracks lifetime game statistics
class StatisticsManager {
    constructor() {
        this.storageKey = 'spaceInvadersStats';
        this.loadStats();
    }

    loadStats() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            this.stats = JSON.parse(stored);
        } else {
            this.stats = {
                gamesPlayed: 0,
                bestWave: 0,
                totalScore: 0,
                totalPowerupsCollected: 0,
                totalPlaytime: 0, // in seconds
                totalBulletsFired: 0,
                totalEnemiesKilled: 0,
                lastGameStats: null
            };
        }
    }

    saveStats() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
    }

    recordGameEnd(gameStats) {
        this.stats.gamesPlayed++;
        this.stats.bestWave = Math.max(this.stats.bestWave, gameStats.wave);
        this.stats.totalScore += gameStats.score;
        this.stats.totalPowerupsCollected += gameStats.powerupsCollected;
        this.stats.totalPlaytime += gameStats.playtime;
        this.stats.totalBulletsFired += gameStats.bulletsFired;
        this.stats.totalEnemiesKilled += gameStats.enemiesKilled;
        this.stats.lastGameStats = {
            score: gameStats.score,
            wave: gameStats.wave,
            powerupsCollected: gameStats.powerupsCollected,
            playtime: gameStats.playtime,
            difficulty: gameStats.difficulty,
            timestamp: new Date().toISOString()
        };
        this.saveStats();
    }

    getStats() {
        return this.stats;
    }

    getAverageScore() {
        if (this.stats.gamesPlayed === 0) return 0;
        return Math.round(this.stats.totalScore / this.stats.gamesPlayed);
    }

    getAccuracy() {
        if (this.stats.totalBulletsFired === 0) return 0;
        return Math.round((this.stats.totalEnemiesKilled / this.stats.totalBulletsFired) * 100);
    }

    getAveragePlaytime() {
        if (this.stats.gamesPlayed === 0) return 0;
        return Math.round(this.stats.totalPlaytime / this.stats.gamesPlayed);
    }

    resetStats() {
        this.stats = {
            gamesPlayed: 0,
            bestWave: 0,
            totalScore: 0,
            totalPowerupsCollected: 0,
            totalPlaytime: 0,
            totalBulletsFired: 0,
            totalEnemiesKilled: 0,
            lastGameStats: null
        };
        this.saveStats();
    }
}

const statisticsManager = new StatisticsManager();


// Main Game Class
class SpaceInvadersGame {
     constructor(difficulty = DIFFICULTIES.NORMAL) {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
         // Game state
        this.state = GAME_STATE.PLAYING;
        this.isPaused = false; // Pause state
        this.score = 0;
        this.lives = 3;
        this.wave = 1;
        this.gameTime = 0;
        this.lastLifeRewardScore = 0;
        this.difficulty = difficulty;
        
        // Bullet progression system - start with 1 bullet
        this.bulletLevel = 1; // 1 = single center, 2 = dual spread, 3+ = wide spread
        
         // Powerup statistics
        this.powerupCollected = 0; // Total powerups collected this game
        this.powerupsDroppedThisWave = 0; // Powerups dropped in current wave (max 4)
        
        // Game statistics tracking
        this.bulletsFired = 0; // Total bullets fired this game
        this.enemiesKilled = 0; // Total enemies killed this game
        
        // Game objects
        this.player = new Player(GAME_WIDTH / 2 - PLAYER_WIDTH / 2, GAME_HEIGHT - 50);
        this.enemies = [];
        this.bullets = [];
        this.enemyBullets = [];
        this.particles = [];
        this.powerUps = [];
        
        // Power-up system
        this.powerUpManager = new PowerUpManager(this.player);
        
        // Input handling
        this.keys = {};
        this.setupInputHandlers();
        
        // Game loop
        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);
        
        // Spawn initial enemies
        this.spawnWave();
        
        // Play wave complete sound for wave 1 start
        soundManager.playSound('waveComplete');
    }

    setupInputHandlers() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            if (e.key === ' ') {
                e.preventDefault();
                this.bulletsFired += this.player.shoot(this.bullets, this.wave, this.powerUpManager, this.bulletLevel);
            }
            
            // P key for pause/resume
            if (e.key.toLowerCase() === 'p') {
                e.preventDefault();
                this.togglePause();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Mobile touch controls setup
        this.setupTouchControls();
        
        // Rapid fire interval handler
        this.lastShotTime = 0;
         this.shootInterval = setInterval(() => {
            if (this.state === GAME_STATE.PLAYING && this.powerUpManager.hasPowerUp('RAPID_FIRE')) {
                this.bulletsFired += this.player.shoot(this.bullets, this.wave, this.powerUpManager, this.bulletLevel);
            }
        }, 100); // Rapid fire: every 100ms
    }

    setupTouchControls() {
        const touchControls = document.getElementById('touchControls');
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');
        const shootBtn = document.getElementById('shootBtn');
        
        // Show touch controls on mobile devices
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile || window.innerWidth <= 1024) {
            touchControls.classList.add('active');
            document.getElementById('controlsTitle').style.display = 'none';
            document.getElementById('mobileControlsInfo').style.display = 'block';
        }
        
        // Left button - Move left
        leftBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys['ArrowLeft'] = true;
        });
        leftBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['ArrowLeft'] = false;
        });
        
        // Right button - Move right
        rightBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys['ArrowRight'] = true;
        });
        rightBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['ArrowRight'] = false;
        });
        
        // Shoot button - Fire
        shootBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.bulletsFired += this.player.shoot(this.bullets, this.wave, this.powerUpManager, this.bulletLevel);
        });
        
        // Also support mouse events for desktop testing on touchscreen devices
        leftBtn.addEventListener('mousedown', () => {
            this.keys['ArrowLeft'] = true;
        });
        leftBtn.addEventListener('mouseup', () => {
            this.keys['ArrowLeft'] = false;
        });
        
        rightBtn.addEventListener('mousedown', () => {
            this.keys['ArrowRight'] = true;
        });
        rightBtn.addEventListener('mouseup', () => {
            this.keys['ArrowRight'] = false;
        });
        
         shootBtn.addEventListener('mousedown', () => {
            this.bulletsFired += this.player.shoot(this.bullets, this.wave, this.powerUpManager, this.bulletLevel);
        });
    }

    spawnWave() {
        this.enemies = [];
        const rows = 3;
        const cols = 6;
        const spacing = 90;
        const startX = 50;
        const startY = 30;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = startX + col * spacing;
                const y = startY + row * spacing;
                this.enemies.push(new Enemy(x, y, this.wave, this.difficulty));
            }
        }
    }

    update() {
        if (this.state !== GAME_STATE.PLAYING) return;
        
        this.gameTime++;
        
        // Update player
        if (this.keys['ArrowLeft'] && this.player.x > 0) {
            this.player.x -= PLAYER_SPEED;
        }
        if (this.keys['ArrowRight'] && this.player.x + PLAYER_WIDTH < GAME_WIDTH) {
            this.player.x += PLAYER_SPEED;
        }
        
        // Update power-ups
        this.powerUpManager.update();
        this.updatePowerUps();
        
        // Update bullets
        this.updateBullets();
        
        // Update enemies
        this.updateEnemies();
        
        // Update enemy bullets
        this.updateEnemyBullets();
        
        // Update particles
        this.particles = this.particles.filter(p => p.life > 0);
        this.particles.forEach(p => p.update());
        
        // Enemy spawning and firing
        this.enemyActions();
        
        // Check for game over
        if (this.enemies.length === 0) {
             this.wave++;
            this.powerupsDroppedThisWave = 0; // Reset powerup counter for new wave
            
            // Progression: Unlock bullet levels at specific waves
            if (this.wave === 2 && this.bulletLevel < 2) {
                this.bulletLevel = 2; // Unlock dual shot at wave 2
                this.createBulletUpgradeEffect();
            } else if (this.wave === 5 && this.bulletLevel < 3) {
                this.bulletLevel = 3; // Unlock spread shot at wave 5
                this.createBulletUpgradeEffect();
            }
            
            soundManager.playSound('waveComplete');
            this.spawnWave();

        }
        
        if (this.lives <= 0) {
            this.endGame();
        }
    }

    updatePowerUps() {
        // Update powerup positions
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            powerUp.update();
            
            // Remove if fallen off screen
            if (powerUp.y > GAME_HEIGHT) {
                this.powerUps.splice(i, 1);
                continue;
            }
            
            // Check collision with player
            if (this.checkCollision(powerUp, this.player)) {
                this.powerUpManager.addPowerUp(powerUp.type);
                this.powerupCollected++; // Increment total powerups collected
                this.powerUps.splice(i, 1);
                soundManager.playSound('powerUp');
                this.createPowerUpCollectEffect(powerUp.x, powerUp.y);
            }
        }
    }

    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.update();
            
            if (bullet.y < 0) {
                this.bullets.splice(i, 1);
            }
        }
    }

    updateEnemies() {
        this.enemies.forEach(enemy => enemy.update());
        
        // Check if enemies reached bottom
        for (let enemy of this.enemies) {
            if (enemy.y + ENEMY_HEIGHT > GAME_HEIGHT - 50) {
                this.lives = 0;
                break;
            }
        }
        
        // Check collision with bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                
                if (this.checkCollision(bullet, enemy)) {
                    this.enemies.splice(j, 1);
                    this.bullets.splice(i, 1);
                    this.enemiesKilled++; // Increment enemies killed counter
                    const baseScore = enemy.points;
                    const finalScore = Math.ceil(baseScore * this.difficulty.scoreMultiplier);
                    this.score += finalScore;
                    
                    // Play enemy death sound
                    soundManager.playSound('enemyDeath');
                    

                    
                     // Randomly drop powerups (20% chance, max 4 per wave, max 4 on screen)
                    if (Math.random() < 0.2 && this.powerupsDroppedThisWave < 4 && this.powerUps.length < 4) {
                        const powerUpTypes = Object.keys(POWERUP_TYPES);
                        const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
                        this.powerUps.push(new PowerUp(enemy.x + ENEMY_WIDTH / 2, enemy.y, randomType));
                        this.powerupsDroppedThisWave++;
                    }

                    
                    this.createExplosion(enemy.x + ENEMY_WIDTH / 2, enemy.y + ENEMY_HEIGHT / 2);
                    break;
                }
            }
        }
    }

    updateEnemyBullets() {
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            const bullet = this.enemyBullets[i];
            bullet.update();
            
            if (bullet.y > GAME_HEIGHT) {
                this.enemyBullets.splice(i, 1);
                continue;
            }
            
            // Check collision with shield
            if (this.powerUpManager.hasPowerUp('SHIELD')) {
                const shieldSize = PLAYER_WIDTH + 20;
                const shieldX = this.player.x + PLAYER_WIDTH / 2;
                const shieldY = this.player.y + PLAYER_HEIGHT / 2;
                const bulletDist = Math.sqrt(
                    Math.pow(bullet.x - shieldX, 2) + Math.pow(bullet.y - shieldY, 2)
                );
                
                if (bulletDist < shieldSize / 2) {
                    this.enemyBullets.splice(i, 1);
                    this.createExplosion(bullet.x, bullet.y);
                    continue;
                }
            }
            
            // Check collision with player
            if (this.checkCollision(bullet, this.player)) {
                this.enemyBullets.splice(i, 1);
                this.lives--;
                this.createExplosion(this.player.x + PLAYER_WIDTH / 2, this.player.y + PLAYER_HEIGHT / 2);
            }
        }
    }

    enemyActions() {
        // Enemy shooting - adjust spawn rate by difficulty
        if (this.gameTime % this.difficulty.enemySpawnRate === 0 && this.enemies.length > 0) {
            const randomEnemy = this.enemies[Math.floor(Math.random() * this.enemies.length)];
            const bulletSpeed = ENEMY_BULLET_SPEED * this.difficulty.enemyBulletSpeedMultiplier;
            this.enemyBullets.push(new EnemyBullet(
                randomEnemy.x + ENEMY_WIDTH / 2,
                randomEnemy.y + ENEMY_HEIGHT,
                bulletSpeed
            ));
        }
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    createExplosion(x, y) {
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const velocity = {
                x: Math.cos(angle) * 3,
                y: Math.sin(angle) * 3,
            };
            this.particles.push(new Particle(x, y, velocity));
        }
    }

    createLifeRewardEffect() {
        // Create multiple bursts of fireworks for life reward celebration!
        const centerX = GAME_WIDTH / 2;
        const centerY = GAME_HEIGHT / 2;
        
        // Main burst at center of screen
        for (let i = 0; i < 24; i++) {
            const angle = (i / 24) * Math.PI * 2;
            const velocity = {
                x: Math.cos(angle) * 5,
                y: Math.sin(angle) * 5,
            };
            this.particles.push(new FireworksParticle(centerX, centerY, velocity, 'gold'));
        }
        
        // Left side burst
        const leftBurstX = centerX - 150;
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const velocity = {
                x: Math.cos(angle) * 4.5 + 1,
                y: Math.sin(angle) * 4.5,
            };
            this.particles.push(new FireworksParticle(leftBurstX, centerY - 100, velocity, 'silver'));
        }
        
        // Right side burst
        const rightBurstX = centerX + 150;
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const velocity = {
                x: Math.cos(angle) * 4.5 - 1,
                y: Math.sin(angle) * 4.5,
            };
            this.particles.push(new FireworksParticle(rightBurstX, centerY - 100, velocity, 'cyan'));
        }
    }

    createPowerUpCollectEffect(x, y) {
        // Create sparkly particles when collecting powerup
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2;
            const velocity = {
                x: Math.cos(angle) * 4,
                y: Math.sin(angle) * 4,
            };
            this.particles.push(new FireworksParticle(x, y, velocity, 'cyan'));
        }
    }

    createBulletUpgradeEffect() {
        // Create special effect for bullet level upgrade
        const centerX = GAME_WIDTH / 2;
        const centerY = GAME_HEIGHT / 2;
        
        // Gold burst for upgrade
        for (let i = 0; i < 32; i++) {
            const angle = (i / 32) * Math.PI * 2;
            const velocity = {
                x: Math.cos(angle) * 5,
                y: Math.sin(angle) * 5,
            };
            this.particles.push(new FireworksParticle(centerX, centerY, velocity, 'gold'));
        }
    }

    endGame() {
        this.state = GAME_STATE.GAME_OVER;
        soundManager.playSound('gameOver');
        document.getElementById('gameOverScreen').classList.add('show');
        document.getElementById('finalScore').textContent = `Final Score: ${this.score}`;
        document.getElementById('wavesDefeated').textContent = `Waves Defeated: ${this.wave - 1}`;
        
        // Record game statistics
        statisticsManager.recordGameEnd({
            score: this.score,
            wave: this.wave,
            powerupsCollected: this.powerupCollected,
            playtime: Math.round(this.gameTime / 1000), // Convert ms to seconds
            bulletsFired: this.bulletsFired,
            enemiesKilled: this.enemiesKilled,
            difficulty: this.difficulty.name
        });
        
        // Check if this is a high score
        if (highScoreManager.isHighScore(this.score)) {
            showHighScoreModal(this.score);
        } else {
            updateLeaderboardDisplay();
        }
    }

    togglePause() {
        // Can only pause during active gameplay
        if (this.state !== GAME_STATE.PLAYING) return;
        
        this.isPaused = !this.isPaused;
        const pauseModal = document.getElementById('pauseModal');
        
        if (this.isPaused) {
            // Show pause screen
            if (pauseModal) {
                pauseModal.classList.add('show');
            }
        } else {
            // Hide pause screen
            if (pauseModal) {
                pauseModal.classList.remove('show');
            }
        }
    }

    resumeGame() {
        if (this.isPaused) {
            this.togglePause();
        }
    }

    draw() {

        // Clear canvas
        this.ctx.fillStyle = '#0a0e27';
        this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        // Draw scan lines effect
        this.ctx.strokeStyle = 'rgba(0, 255, 65, 0.03)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < GAME_HEIGHT; i += 2) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(GAME_WIDTH, i);
            this.ctx.stroke();
        }
        
        // Draw game objects
        this.player.draw(this.ctx, this.wave);
        
        // Draw shield if active
        if (this.powerUpManager.hasPowerUp('SHIELD')) {
            this.drawShield();
        }
        
         this.bullets.forEach(bullet => bullet.draw(this.ctx));
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.enemyBullets.forEach(bullet => bullet.draw(this.ctx));
        this.powerUps.forEach(powerUp => powerUp.draw(this.ctx));
        this.particles.forEach(particle => particle.draw(this.ctx));
        
        // Draw pause overlay if paused
        if (this.isPaused) {
            this.drawPauseOverlay();
        }
    }

    drawPauseOverlay() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        
        // "PAUSED" text
        this.ctx.fillStyle = '#00ff41';
        this.ctx.font = 'bold 60px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.shadowColor = '#00ff41';
        this.ctx.shadowBlur = 20;
        this.ctx.fillText('PAUSED', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40);
        
        // Instructions
        this.ctx.font = '20px Courier New';
        this.ctx.fillStyle = '#00ccff';
        this.ctx.shadowColor = '#00ccff';
        this.ctx.shadowBlur = 10;
        this.ctx.fillText('Press P to Resume', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40);
        
        this.ctx.shadowBlur = 0;
    }


    drawShield() {
        const shieldSize = PLAYER_WIDTH + 20;
        const shieldX = this.player.x - 10;
        const shieldY = this.player.y - 10;
        
        this.ctx.strokeStyle = '#00ccff';
        this.ctx.shadowColor = '#00ccff';
        this.ctx.shadowBlur = 15;
        this.ctx.lineWidth = 3;
        
        // Draw circle shield around player
        this.ctx.beginPath();
        this.ctx.arc(shieldX + PLAYER_WIDTH / 2, shieldY + PLAYER_HEIGHT / 2, shieldSize / 2, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.shadowBlur = 0;
    }

    gameLoop() {
        // Skip update if paused, but still draw and render UI
        if (!this.isPaused) {
            this.update();
        }
        this.draw();
        this.updateUI();
        requestAnimationFrame(this.gameLoop);
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('wave').textContent = this.wave;
        document.getElementById('lives').textContent = this.lives;
        document.getElementById('difficulty').textContent = this.difficulty.name;
        
        // Update bullet level display
        const bulletDisplay = document.getElementById('bulletLevel');
        if (bulletDisplay) {
            const levelLabels = {
                1: '● Single',
                2: '●● Dual',
                3: '●●● Spread'
            };
            bulletDisplay.textContent = `SHOT: ${levelLabels[this.bulletLevel] || 'Single'}`;
        }
        
        // Update powerup display (active powerups with timers)
        const powerupDisplay = document.getElementById('powerUps');
        if (powerupDisplay) {
            const activePowerUps = [];
            for (let type in this.powerUpManager.activePowerUps) {
                const remaining = Math.ceil(this.powerUpManager.getRemainingTime(type) / 1000);
                activePowerUps.push(`${POWERUP_TYPES[type].icon} ${remaining}s`);
            }
            powerupDisplay.textContent = activePowerUps.length > 0 ? activePowerUps.join('  ') : '';
        }
        
        // Update powerup count display (total collected)
        const powerupCountDisplay = document.getElementById('powerupCount');
        if (powerupCountDisplay) {
            powerupCountDisplay.textContent = this.powerupCollected > 0 ? `POWERUPS COLLECTED: ${this.powerupCollected}` : '';
        }
    }
}

// Player Class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;
        this.wave = 1;
    }

    shoot(bullets, wave = 1, powerUpManager = null, bulletLevel = 1) {
        const centerGunX = this.x + this.width / 2 - BULLET_WIDTH / 2;
        const spreadVelocity = 2;
        let bulletsCreated = 0;
        
        // Bullet level determines shot pattern
        if (powerUpManager && powerUpManager.hasPowerUp('MULTI_SHOT')) {
            // Multi-shot powerup: triple shot regardless of level
            const leftGunX = this.x + 0.25 * this.width - BULLET_WIDTH / 2;
            const rightGunX = this.x + 0.75 * this.width - BULLET_WIDTH / 2;
            bullets.push(new Bullet(leftGunX, this.y - BULLET_HEIGHT, -spreadVelocity));
            bullets.push(new Bullet(centerGunX, this.y - BULLET_HEIGHT, 0));
            bullets.push(new Bullet(rightGunX, this.y - BULLET_HEIGHT, spreadVelocity));
            bulletsCreated = 3;
        } else if (bulletLevel >= 3) {
            // Level 3+: Wide spread dual shot
            const waveSpread = Math.max(0.1, 0.25 - (wave - 2) * 0.05);
            const leftGunX = this.x + waveSpread * this.width - BULLET_WIDTH / 2;
            const rightGunX = this.x + (1 - waveSpread) * this.width - BULLET_WIDTH / 2;
            bullets.push(new Bullet(leftGunX, this.y - BULLET_HEIGHT, -spreadVelocity));
            bullets.push(new Bullet(rightGunX, this.y - BULLET_HEIGHT, spreadVelocity));
            bulletsCreated = 2;
        } else if (bulletLevel === 2) {
            // Level 2: Dual shot centered
            const offset = 8;
            bullets.push(new Bullet(centerGunX - offset, this.y - BULLET_HEIGHT, -spreadVelocity * 0.5));
            bullets.push(new Bullet(centerGunX + offset, this.y - BULLET_HEIGHT, spreadVelocity * 0.5));
            bulletsCreated = 2;
        } else {
            // Level 1: Single center shot
            bullets.push(new Bullet(centerGunX, this.y - BULLET_HEIGHT, 0));
            bulletsCreated = 1;
        }
        
        // Play shoot sound
        soundManager.playSound('shoot');
        
        return bulletsCreated;
    }

    draw(ctx, wave = 1) {
        this.wave = wave;
        ctx.fillStyle = '#00ff41';
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 10;
        
        // Draw ship body
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width / 4, this.y + this.height * 0.7);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height * 0.9);
        ctx.lineTo(this.x + this.width * 0.75, this.y + this.height * 0.7);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        
        // Draw cockpit
        ctx.fillStyle = '#00aa22';
        ctx.fillRect(this.x + this.width / 3, this.y + this.height * 0.3, this.width / 3, this.height * 0.2);
        
        // Draw dual gun turrets with progressive spread
        ctx.fillStyle = '#00ff41';
        
        // Calculate gun spread based on wave
        let gunSpread = 0.25; // Default spread for waves 1-2
        if (wave >= 2) {
            gunSpread = Math.max(0.1, 0.25 - (wave - 2) * 0.05);
        }
        
        // Left gun
        const leftGunPos = this.x + gunSpread * this.width - 2;
        ctx.fillRect(leftGunPos, this.y, 4, this.height * 0.4);
        
        // Right gun
        const rightGunPos = this.x + (1 - gunSpread) * this.width - 2;
        ctx.fillRect(rightGunPos, this.y, 4, this.height * 0.4);
        
        ctx.shadowBlur = 0;
    }
}

// Bullet Class
class Bullet {
    constructor(x, y, velocityX = 0) {
        this.x = x;
        this.y = y;
        this.width = BULLET_WIDTH;
        this.height = BULLET_HEIGHT;
        this.speed = BULLET_SPEED;
        this.velocityX = velocityX; // Horizontal spreading velocity
    }

    update() {
        this.y -= this.speed;
        this.x += this.velocityX; // Apply horizontal spread
    }

    draw(ctx) {
        ctx.fillStyle = '#00ff41';
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 5;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
    }
}

// Enemy Class
class Enemy {
    constructor(x, y, wave, difficulty = DIFFICULTIES.NORMAL) {
        this.x = x;
        this.y = y;
        this.width = ENEMY_WIDTH;
        this.height = ENEMY_HEIGHT;
        this.baseSpeed = 1 + (wave * 0.5);
        this.speed = this.baseSpeed * difficulty.enemySpeedMultiplier;
        this.points = 10 + (wave * 5);
        this.direction = 1;
    }

    update() {
        this.x += this.speed * this.direction;
        
        // Bounce off walls
        if (this.x <= 0 || this.x + this.width >= GAME_WIDTH) {
            this.direction *= -1;
            this.y += 20;
        }
    }

    draw(ctx) {
        ctx.fillStyle = '#00ff41';
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 8;
        
        // Draw enemy body (classic invader shape)
        ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
        ctx.fillRect(this.x + 2, this.y + 10, 5, 10);
        ctx.fillRect(this.x + this.width - 7, this.y + 10, 5, 10);
        
        ctx.shadowBlur = 0;
    }
}

// Enemy Bullet Class
class EnemyBullet {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.width = BULLET_WIDTH;
        this.height = BULLET_HEIGHT;
        this.speed = speed;
    }

    update() {
        this.y += this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = '#ff6600';
        ctx.shadowColor = '#ff6600';
        ctx.shadowBlur = 5;
        ctx.fillRect(this.x - this.width / 2, this.y, this.width, this.height);
        ctx.shadowBlur = 0;
    }
}

// Particle Class
class Particle {
    constructor(x, y, velocity) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.life = 30;
        this.maxLife = 30;
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += 0.2; // gravity
        this.life--;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.fillStyle = `rgba(0, 255, 65, ${alpha})`;
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 5;
        ctx.fillRect(this.x, this.y, 3, 3);
        ctx.shadowBlur = 0;
    }
}

// Fireworks Particle Class - Explosive particles for life reward celebration!
class FireworksParticle {
    constructor(x, y, velocity, color = 'gold') {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.color = color;
        this.life = 50;
        this.maxLife = 50;
        this.trail = [];
    }

    update() {
        // Store trail for streak effect
        if (this.trail.length < 3) {
            this.trail.push({ x: this.x, y: this.y });
        } else {
            this.trail.shift();
            this.trail.push({ x: this.x, y: this.y });
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.velocity.y += 0.25; // gravity
        this.velocity.x *= 0.98; // air resistance
        this.life--;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        
        // Draw trail
        ctx.strokeStyle = `rgba(${this.getColorRGB()}, ${alpha * 0.6})`;
        ctx.lineWidth = 2;
        if (this.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(this.trail[0].x, this.trail[0].y);
            for (let i = 1; i < this.trail.length; i++) {
                ctx.lineTo(this.trail[i].x, this.trail[i].y);
            }
            ctx.stroke();
        }

        // Draw particle core with glow
        ctx.fillStyle = `rgba(${this.getColorRGB()}, ${alpha})`;
        ctx.shadowColor = this.getColorHex();
        ctx.shadowBlur = 12;
        
        const size = 4 * alpha; // Shrink as it fades
        ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);
        
        ctx.shadowBlur = 0;
    }

    getColorRGB() {
        switch (this.color) {
            case 'gold':
                return '255, 200, 0';
            case 'silver':
                return '200, 220, 255';
            case 'cyan':
                return '0, 255, 200';
            default:
                return '255, 200, 0';
        }
    }

    getColorHex() {
        switch (this.color) {
            case 'gold':
                return '#ffc800';
            case 'silver':
                return '#dcdcff';
            case 'cyan':
                return '#00ffc8';
            default:
                return '#ffc800';
        }
    }
}

// High Score Functions
function showHighScoreModal(score) {
    document.getElementById('newScoreDisplay').textContent = `Score: ${score}`;
    document.getElementById('playerName').value = '';
    document.getElementById('playerName').focus();
    document.getElementById('nameEntryModal').classList.add('show');
}

function submitHighScore() {
    const name = document.getElementById('playerName').value.trim();
    if (!name) {
        alert('Please enter your name!');
        return;
    }
    
    const score = parseInt(document.getElementById('newScoreDisplay').textContent.split(': ')[1]);
    highScoreManager.addScore(name, score);
    
    document.getElementById('nameEntryModal').classList.remove('show');
    updateLeaderboardDisplay();
    showLeaderboard();
}

function skipHighScore() {
    document.getElementById('nameEntryModal').classList.remove('show');
    updateLeaderboardDisplay();
}

function updateLeaderboardDisplay() {
    const scores = highScoreManager.getScores();
    const leaderboardList = document.getElementById('leaderboardList');
    
    leaderboardList.innerHTML = '';
    
    if (scores.length === 0) {
        leaderboardList.innerHTML = '<li class="leaderboard-entry" style="color: #00aa22;">No scores yet</li>';
        return;
    }
    
    scores.forEach((entry, index) => {
        const li = document.createElement('li');
        li.className = 'leaderboard-entry';
        
        // Add medal colors for top 3
        if (index === 0) li.classList.add('top1');
        else if (index === 1) li.classList.add('top2');
        else if (index === 2) li.classList.add('top3');
        
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        const date = new Date(entry.timestamp).toLocaleDateString();
        
        li.innerHTML = `
            <span class="leaderboard-name">${medal} ${entry.name}</span>
            <span class="leaderboard-score">${entry.score}</span>
        `;
        li.title = `Score on ${date}`;
        
        leaderboardList.appendChild(li);
    });
}

function showLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    const showBtn = document.getElementById('showLeaderboardBtn');
    
    if (leaderboard.style.display === 'none') {
        leaderboard.style.display = 'block';
        showBtn.style.display = 'none';
    } else {
        leaderboard.style.display = 'none';
        showBtn.style.display = 'block';
    }
}

function toggleLeaderboard() {
    const leaderboard = document.getElementById('leaderboard');
    
    if (leaderboard.classList.contains('show')) {
        leaderboard.classList.remove('show');
    } else {
        updateLeaderboardDisplay();
        leaderboard.classList.add('show');
    }
}

// Initialize leaderboard on page load
window.addEventListener('load', () => {
    // Expose difficulties to window for HTML onclick handlers
    window.DIFFICULTIES = DIFFICULTIES;
    
    updateLeaderboardDisplay();
    const scores = highScoreManager.getScores();
    if (scores.length > 0) {
        document.getElementById('leaderboard').style.display = 'block';
    } else {
        document.getElementById('showLeaderboardBtn').style.display = 'block';
    }
    
    // Show difficulty selection modal instead of starting game immediately
    document.getElementById('difficultyModal').classList.add('show');
});

// Start game with selected difficulty
function startGame(difficulty) {
    document.getElementById('difficultyModal').classList.remove('show');
    window.currentGame = new SpaceInvadersGame(difficulty);
}

// Sound Manager Toggle Function
function toggleSoundManager() {
    const enabled = soundManager.toggleSound();
    const btn = document.getElementById('soundToggleBtn');
    
    if (enabled) {
        btn.textContent = '🔊 SOUND ON';
        btn.classList.remove('off');
    } else {
        btn.textContent = '🔇 SOUND OFF';
        btn.classList.add('off');
    }
}

