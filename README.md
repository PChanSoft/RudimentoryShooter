# RudimentoryShooter
My game will be about simply going through rounds of enemies and make it to the end of X rounds, with progressing difficulty.

Rules:
You control a space ship with guns, shoot at the enemy ships while dodging return fire! Each round will have different formations of enemies to shoot against.

Controls:
ship moves left and right with keys
ship can fire bullets with a button


To keeps things simple, we will just have standard ships, that also shoot back occasionally.

---------Day 1---------

Figure out how to move ship in a confined space

---------Day 2---------

To create the hit detection when the ships go pew so we know if a ship got hit or not for scoring purposes later. Will integrate the method as described here:
https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection

The trick will be then pulling the current value of X and Y axis of enemy ships as they move. 
When collision happens enemy ship will be destroyed, or player ship will be destroyed
if it collides with enemey fire.

--------Day 3-----------

Make ships go pew

--------Day 4-----------

how to produce different waves of enemies

--------Day 5-----------

Scoring

--------Day 6-----------

Cry

Wireframe for what the game can look like. Graphics may not reflect the final product.
[Wireframe Image](project1WireFrame.png)

Update 12/8/2020 - 12/10/2020
	• Enemies have an attack function with a second function to create a triple firing pattern
	• Enemy can move left and right on it's own across the play field
	• Player can move left and right
	• Player can fire bullets at the enemy with a controlled rate of one bullet per button press
	• When a enemy bullet collides with a player, the game ends.
	• When a player bullet collides with the enemy, the enemy is object is removed.
	• Bullets are able to be color coordinated so they would not be confused for each other
between enemy and player.
	• Score function was added.
	• When a enemy is hit by a bullet and destroyed, it adds 1 point to the score.

