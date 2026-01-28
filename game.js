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

// Game States
const GAME_STATE = {
    PLAYING: 'playing',
    GAME_OVER: 'gameOver',
    WAVE_COMPLETE: 'waveComplete',
};

// Main Game Class
class SpaceInvadersGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.state = GAME_STATE.PLAYING;
        this.score = 0;
        this.lives = 3;
        this.wave = 1;
        this.gameTime = 0;
        this.lastLifeRewardScore = 0; // Track last life reward milestone
        
        // Game objects
        this.player = new Player(GAME_WIDTH / 2 - PLAYER_WIDTH / 2, GAME_HEIGHT - 50);
        this.enemies = [];
        this.bullets = [];
        this.enemyBullets = [];
        this.particles = [];
        
        // Input handling
        this.keys = {};
        this.setupInputHandlers();
        
        // Game loop
        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);
        
        // Spawn initial enemies
        this.spawnWave();
    }

    setupInputHandlers() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
            
            if (e.key === ' ') {
                e.preventDefault();
                this.player.shoot(this.bullets, this.wave);
            }
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Mobile touch controls setup
        this.setupTouchControls();
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
            this.player.shoot(this.bullets, this.wave);
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
            this.player.shoot(this.bullets, this.wave);
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
                this.enemies.push(new Enemy(x, y, this.wave));
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
            this.spawnWave();
        }
        
        if (this.lives <= 0) {
            this.endGame();
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
                    this.score += enemy.points;
                    
                    // Check for life reward every 2000 points
                    if (this.score >= this.lastLifeRewardScore + 2000) {
                        this.lives++;
                        this.lastLifeRewardScore += 2000;
                        this.createLifeRewardEffect();
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
            
            // Check collision with player
            if (this.checkCollision(bullet, this.player)) {
                this.enemyBullets.splice(i, 1);
                this.lives--;
                this.createExplosion(this.player.x + PLAYER_WIDTH / 2, this.player.y + PLAYER_HEIGHT / 2);
            }
        }
    }

    enemyActions() {
        // Enemy shooting
        if (this.gameTime % 30 === 0 && this.enemies.length > 0) {
            const randomEnemy = this.enemies[Math.floor(Math.random() * this.enemies.length)];
            this.enemyBullets.push(new EnemyBullet(
                randomEnemy.x + ENEMY_WIDTH / 2,
                randomEnemy.y + ENEMY_HEIGHT,
                ENEMY_BULLET_SPEED
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

    endGame() {
        this.state = GAME_STATE.GAME_OVER;
        document.getElementById('gameOverScreen').classList.add('show');
        document.getElementById('finalScore').textContent = `Final Score: ${this.score}`;
        document.getElementById('wavesDefeated').textContent = `Waves Defeated: ${this.wave - 1}`;
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
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.enemyBullets.forEach(bullet => bullet.draw(this.ctx));
        this.particles.forEach(particle => particle.draw(this.ctx));
    }

    gameLoop() {
        this.update();
        this.draw();
        this.updateUI();
        requestAnimationFrame(this.gameLoop);
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('wave').textContent = this.wave;
        document.getElementById('lives').textContent = this.lives;
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

    shoot(bullets, wave = 1) {
        // Dual guns - shoot from left and right sides
        // Gun spread increases with waves: wave 1-2 = 1/4 and 3/4, wave 3+ spreads further
        let gunSpread = 0.25; // Default spread for waves 1-2
        
        if (wave >= 2) {
            // Progressive spread: wave 2 = 0.15/0.85, wave 3 = 0.1/0.9, etc.
            gunSpread = Math.max(0.1, 0.25 - (wave - 2) * 0.05);
        }
        
        const leftGunX = this.x + gunSpread * this.width - BULLET_WIDTH / 2;
        const rightGunX = this.x + (1 - gunSpread) * this.width - BULLET_WIDTH / 2;
        
        // Bullets spread outward: left gun shoots left, right gun shoots right
        const spreadVelocity = 2; // Horizontal velocity for spreading
        bullets.push(new Bullet(leftGunX, this.y - BULLET_HEIGHT, -spreadVelocity));
        bullets.push(new Bullet(rightGunX, this.y - BULLET_HEIGHT, spreadVelocity));
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
    constructor(x, y, wave) {
        this.x = x;
        this.y = y;
        this.width = ENEMY_WIDTH;
        this.height = ENEMY_HEIGHT;
        this.speed = 1 + (wave * 0.5);
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

// Initialize game
window.addEventListener('load', () => {
    new SpaceInvadersGame();
});

