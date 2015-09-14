// coordinates grid
var canvas_width = 505,
    canvas_height = 606,
    tile_width = 101,
    tile_height = 83,
    tile_real_height = 171;
    top_offset = -30;

inherit = function(subClass,superClass) {
   subClass.prototype = Object.create(superClass.prototype); // delegate to prototype
   subClass.prototype.constructor = subClass; // set constructor on prototype
};

// something that can move
var Actor = function(x,y,speed) {
    this.sprite = '';
    this.starting_x = x;
    this.starting_y = y;
    this.starting_speed = speed;
    this.width = tile_width;
    this.height = tile_height;

    this.reset();
};

Actor.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Actor.prototype.reset = function() {
    this.x = this.starting_x;
    this.y = this.starting_y;
    this.speed = this.starting_speed;
};

// any on tick updates we want to do with Actor
Actor.prototype.update = function() {
    // do nothing by default
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
// overriding default method
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;

    // Wrap the line movement
    if (this.x > canvas_width) {
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

Player.prototype.handleInput = function(direction) {
    if (direction === 'left' && this.x > 0 ) {
        this.x -= tile_width;
    }

    if (direction === 'right' && this.x + tile_width < canvas_width) {
        this.x += tile_width;
    }

    if (direction === 'up' && this.y > top_offset + 0 * tile_height) {
        this.y -= tile_height;
    }

    if (direction === 'down' && this.y < top_offset + 5 * tile_height) {
        this.y += tile_height;
    }
};

// ------------------------------


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var enemy1 = new Enemy(0 * tile_width, top_offset + 1 * tile_height, 10);
var enemy2 = new Enemy(-1 * tile_width, top_offset + 2 * tile_height, 10);
var enemy3 = new Enemy(0 * tile_width, top_offset + 3 * tile_height, 10);
var allEnemies = [enemy1, enemy2, enemy3];

var player = new Player(2 * tile_width, top_offset + 5 * tile_height, 10);

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

