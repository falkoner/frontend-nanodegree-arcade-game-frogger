// coordinates grid
var GAME_FIELD_ROWS = 8,   // should be 4 and up
    GAME_FIELD_COLUMNS = 8,
    TILE_WIDTH = 101,
    TILE_HEIGHT = 83,
    TILE_REAL_HEIGHT = 171,
    TOP_OFFSET = -30,
    NUM_ENEMIES_PER_ROW = 2,
    CANVAS_WIDTH = TILE_WIDTH * GAME_FIELD_COLUMNS,
    CANVAS_HEIGHT = TILE_REAL_HEIGHT + (TILE_HEIGHT * GAME_FIELD_ROWS - 1 );

// service function to streamline class inheritance
var inherit = function(subClass, superClass) {
   subClass.prototype = Object.create(superClass.prototype); // delegate to prototype
   subClass.prototype.constructor = subClass; // set constructor on prototype
};

// something that can move is an Actor
var Actor = function(x, y, speed) {
    this.sprite = '';
    this.starting_x = x;
    this.starting_y = y;
    this.starting_speed = speed;
    this.width = TILE_WIDTH;
    this.height = TILE_HEIGHT;

    this.reset();
};

// display function
Actor.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// used to initilize instance and after instance is dead
Actor.prototype.reset = function() {
    this.x = this.starting_x;
    this.y = this.starting_y;
    this.speed = this.starting_speed;
};

// any on tick updates we want to do with Actor
Actor.prototype.update = function() {
    // no op
};

// ------------------------------

// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    Actor.call(this, x, y, speed);
    this.sprite = 'images/enemy-bug.png';
};

inherit(Enemy, Actor);

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
// Overriding default method
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    // Wrap the line movement
    if (this.x > CANVAS_WIDTH) {
        this.x = 0 - this.width;
    }
};

// ------------------------------


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function (x, y, speed) {
    Actor.call(this, x, y, speed);
    this.sprite = 'images/char-boy.png';
};

inherit(Player, Actor);

// handles cell by cell movement and
// limits movements
Player.prototype.handleInput = function(direction) {
    if (direction === 'left' && this.x > 0 ) {
        this.x -= TILE_WIDTH;
    }

    if (direction === 'right' && this.x + TILE_WIDTH < CANVAS_WIDTH) {
        this.x += TILE_WIDTH;
    }

    if (direction === 'up' && this.y > TOP_OFFSET + 0 * TILE_HEIGHT) {
        this.y -= TILE_HEIGHT;
    }

    if (direction === 'down' && this.y < TOP_OFFSET + (GAME_FIELD_ROWS - 1 ) * TILE_HEIGHT) {
        this.y += TILE_HEIGHT;
    }
};

// ------------------------------


// instantiate player and enemies
var allEnemies = [];

// each row has NUM_ENEMIES_PER_ROW enemies
for (var row = 1; row <= GAME_FIELD_ROWS - 3; row++) {
        for (var x = 1; x <= NUM_ENEMIES_PER_ROW; x++) {
            var random_column = Math.floor((Math.random() * 4) + - 1);
            var random_speed = Math.floor((Math.random() * 200) + 50);

            var enemy = new Enemy(random_column * TILE_WIDTH,
                TOP_OFFSET + row * TILE_HEIGHT, random_speed);

            allEnemies.push(enemy);
        }
}

var player = new Player(Math.floor(GAME_FIELD_COLUMNS / 2) * TILE_WIDTH,
    TOP_OFFSET + (GAME_FIELD_ROWS - 1) * TILE_HEIGHT, 10);

// ------------------------------


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

