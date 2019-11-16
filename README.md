# ECE 4525 Final Project, Fall 2019, Chris Blackburn
Click [here](https://chris-blackburn.github.io/ECE4525-Final/) to play!

### Running the game locally
I started using p5.js for this project (instead of kahn academy). I wanted to
have separate files and also wanted to import my own images.

The best way to run the game locally is to start a web server. I recommend using
nodejs to run a simple http server:
1. Download and install npm
2. run `npm install -g http-server`
3. In the game directory, run `http-server -p 8888`
4. Navigate to `localhost:8888/index.html` in your browser

This works on any machine.

## Proposal (Original)
My game will be a level based, 2D platformer action game. The (tentative) title
is 'Too Heavy'.

There are no other members on the team - this will be my own project.

The main idea of the game is that you only use your mouse to move. You aim with
your cursor and click to shoot. The spin on this game is that the recoil is not
what makes you move, but rather, the ricochet. So, to make your character move,
you need to bounce the bullet off the wall to hit yourself. For example, if you
are on the ground, you aim downwards and shoot, then the ball will immediately
bounce off the ground and hit you, making you fly upwards. Hence the name, 'Too
Heavy' - you are too heavy for recoil to make you move.

Whenever the ball hits you, it will disappear; it will have a limited number of
times it can ricochet. I plan to include several hazards in each level. For
example, one level might have spikes that kill you if you hit them, or there
might be an enemy that tries to attack you. For some enemies, the bullets
disappear when it hits them, but for others, it will bounce off. There could
also be a platform that gives the bullet an extra bounce. This should make for
an interesting and challenging game because you need to plan out how you will
take shots to move your character while avoiding hazards.

After you beat the game once (i.e. clear all levels), you will unlock 'Glass
Cannon' mode. In this mode, you can shoot faster, but you have to start from
level one if you get hit even once. That is, if you take damage from spikes or
from an enemy. This mode is only for those who want to be truly challenged. You
will be able to select this mode in the options menu.

Topics (could change as the game develops):
* Action + interaction (interaction with the character and the world)
* Background tile-map (for level design)
* Perspective and Views (vectors for different entities in the game)
* Motion and physics (primarily linear to make ricochet possible)
* Modelling intelligent behavior (different kinds of enemies, some smarter than
  others)
* Particle Systems (for explosion effects when a bullet ricochets or hits you)

## Current Plan
Basically, I want to make a 2D platformer where you can run, jump, and shoot.
Similar to my original proposal, I want to introduce my own mechanic where
shooting yourself (with the cannon ball's ricochet) makes you move. For example,
say there is a large gap you need to cross. It's impossible to do it with just a
jump. However, there are enemies flying across the gap. You can shoot an enemy,
then use the ricochet off the enemy to send yourself flying safely to the other
side.

## Checkpoint 1 - Start Screen
My start screen includes two characters and a few animated features.

I wanted to take a stab at pixel art, and this is my first attempt ever at doing
so. The characters will likely change (I will also add more). The character on
the left is the main character. I just thought he looked awesome once he was
complete :) He is holding a cannon that has some smoke effects coming out of it.
I used a particle system to implement the cannon's smoke effects.

The character on the right is an initial design of one of the enemies. I'm not
too fond of it's current look (doesn't really match the theme I'm going for),
but the general idea is still there. This bug enemy will take multiple hits to
kill. On the first hit, you'll crack its shell. Once its shell is cracked, it
will become enraged and chase after you! Hit it again, you break its shell, at
which point it becomes scared and runs away. One more hit will kill the bug.

In the background, I tried to make what looked like smoke stacks (in my mind, it
seemed to fit). At the top I have some smoke clouds going across the screen, and
a fog (using Perlin noise) is also moving in the background.

My overall plan is to include multiple frames of animation for characters to
make it look like they're moving.

If you click on 'Start Game', it currenlty just prints to the console (open your
browser's dev console to see). If you click on 'Instructions', it will bring up
the instructions screen. This just tells you how to play the game. WASD move
your character, SPACE makes him jump. You aim with the mouse and click to shoot.

I don't go into detail about how the shoot/ricochet mechanic works because I
want the player to learn about it through the levels. For example, in the first
level, I would just have them run and jump to the end. In the second level,
there will be a wall they have to get over. I'll leave a little pixel art sign
showing them that they need to bounce a cannon ball off the ground to hit
themselves in the air and over the wall. In other words, I let the level
progression do the teaching.

## Checkpoint 2
As I talked to Dr. Hsiao in class about, I'm deferring a lot of my artwork and
animations since I want to do nice pixel art. I am not adept at creating it, so
it takes me a very long time to do - I'm going to spend some time over break
to make some nice pixel art with animations. At that time, I will update the
start screen and main game to include those animations (it's difficult to
animate since I have to draw a new picture for every frame that the art will
cycle through). To reiterate, I went in this direction because this assignment
is largely graded on artwork. For me and my game, this checkpoint would have
basically been a finished game (If I have one level, I pretty much have them
all). It was just an impractical amount of work for a checkpoint for my style of
game.

That being said, I focused on the logic of my game and did a lot
of tuning for this checkpoint. A large portion of the game is complete. All
that's left is the following:

1. Pixel art
2. Create more levels (this game is tile based, so will not be difficult to do)
3. Enemies with different characteristics

In terms of enemies, it may seem like a full feature to add, but I've followed a
nice object oriented design. All that I would need to do to add an enemy is to
extend my Entity class and add a few unique characteristics (as well as the
art). The same is true with any hazards I would add in the levels. Not much more
work is necessary to expand in this direction.

This game is a multi-level platformer where I want players to be able to
experiment with gameplay and to try new things. By providing tight controls and
an interesting mechanic, I've done just that. This is exactly the game I'd want
to play. I showed this off with the level I provided - there is no _one_ way to
navigate the level. You can simply jump around, or you can use the cannonball
ricochet to catapult yourself to a different area.

Your character, can move left and right and can also jump. Any walls (currently
the darker colored blocks), you cannot move through. I have a dotted line
showing you where your mouse is aiming. When you click, you will fire off a
"cannon ball" in that direction. It will bounce 2 times before dissappearing.

If you use the ricochet to hit yourself, you will adopt the velocity of the
cannon ball. There are a few neat tricks you can do with this mechanic like
using it to get more air off a jump, or using it to move faster across the
ground. With this, it's possible to introduce a wide range of levels.

In terms of visuals, right now, I'm just drawing the collision boxes for the
main character and the cannon ball. The line coming out of that is the direction
of velocity for that entity.

A few things I will add in terms of art:

1. Characters with animation
2. Main character's cannon with shooting animation
3. Explosion effects for the cannonball (bouncing and dissappearing)
4. Tile art (changes depening on surrounding tiles e.g. corners and flat
areas will be different and are automatically generated)

Just to be clear: animations will consist of cycling through severl frames in a
sprite sheet that I will create.