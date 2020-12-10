var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//----------Start Game Initializer Values------------
var startGame=false;
var interval =0;

//Player Properties
var playerHeight=20
var playerWidth=20
var playerX=(canvas.width-playerWidth)/2;
var playerY=canvas.height-playerHeight;
var playerAlive=true;

//keyboard key variable initialization
var rightPressed = false;
var leftPressed = false;
var spacePressed = false;
var keyChecker=0; //this variable

//Enemy Values
var enemyHeight=35
var enemyWidth=35
var enemyX=100
var enemyY=200
var enemyAlive=true;
var reachedRight=false;
var enmBullet=[]

//Bullet Generator values
var bulletWidth=10;
var bulletHeight=30;
var speedY=10;
var bulletCount=10;
var isBullet=[]

//Scoring
var score=0;



//----------------------------------------------------------------Start of Player Bullet Constructor Block------------------------------------------------------------
//if bullet reaches enemy, destroy bullet and enemy.
//create an constructor for the bullets so we can act on each bullet as they come and go.

function theBullet(){ //constructor for the bullets
    this.color="blue"
    this.posX=playerX+(playerWidth/2.5); //when bullets are made, they grab the position of the player when the bullet is made, but will not update the X-axis past this point
    this.posY=playerY;
    this.alive=true;
    this.init=function(){   
        isBullet.push(this);
    };
    this.render=function(){ //decides if the bullet should still be on the screen
        if(this.alive){
            ctx.fillStyle="blue"; //makes sure specific bullets are a certain color
            ctx.fillRect(this.posX,this.posY,5,20)
        }
    };
    this.update=function(){//updates position of existing bullets
        if(this.alive){
            this.posY-=speedY;
        }
        if(this.posX>canvas.width){
            this.alive=false;
        }
        //When the bullet collides with an enemy, we want stuff to happen, in this case, we want to remove the enemy when it gets "hit" and add to our score.
        if(this.posX>enemyX && this.posX<enemyX+enemyWidth&& this.posY>enemyY && this.posY<enemyY+enemyHeight && enemyAlive){
            enemyAlive=false;
            score++;
            this.alive=false;
        }
    };
};

function makeBullet(){
    bullets = new theBullet();
    bullets.init();
};

function update() {
    //this keeps our bullets blue from beginning to end!
    // ctx.fillStyle="blue";
    // ctx.fill()
    //--------------------------------------------------
    for (let i= isBullet.length; i--;){
        isBullet[i].update();
    }
};

function render(){
    for (let i=isBullet.length;i--;){
        isBullet[i].render();
    }
};

//----------------------------------------------------------------End of Player Bullet Constructor Block------------------------------------------------------------



//----------------------------------------------------------------Start Of Enemy Bullet Constructor Block-------------------------------------------------------------
//Now we need to take this code and repurpose it so it work for our enemies, so they can fight back!
function enemBullet(){
    this.color='black'
    this.posX=enemyX+22;
    this.posY=enemyY;
    this.alive=true;
    this.init=function(){
        enmBullet.push(this);
    };
    this.enRender=function(){ //decides if the bullet should still be on the screen
        if(this.alive){
            ctx.fillStyle=this.color; //keeps enemy bullets from looking like player bullets
            ctx.fillRect(this.posX,this.posY,10,40)
        }
    };
    this.enUpdate=function(){//updates position of existing bullets
        if(this.alive){
            this.posY+=speedY;
        }
        if(this.posX>canvas.width){
            this.alive=false;
        }
        //When the bullet collides with an enemy, we want stuff to happen, in this case, we want to remove the enemy when it gets "hit" and add to our score.
        if(this.posX>playerX && this.posX<playerX+playerWidth&& this.posY>playerY && this.posY<playerY+playerHeight && playerAlive){
            playerAlive=false;
            this.alive=false;
        }
    };

};

function enMakeBullet(){
    badBullets = new enemBullet();
    badBullets.init();
};

function enUpdate() {
    //this keeps our bullets blue from beginning to end!
    ctx.fillStyle="pink";
    ctx.fill()

    //--------------------------------------------------
    for (let i= enmBullet.length; i--;){
        enmBullet[i].enUpdate();
    }
};

function enRender(){
    for (let i=enmBullet.length;i--;){
        enmBullet[i].enRender();
    }
};


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {

    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    else if (e.key == " "){
        spacePressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if (e.key == " "){
        spacePressed = false;
        keyChecker = 0; //resets keyChecker when the player releases the space bar so we can fire again when it's pressed down.
    }
}


function drawPlayer(){
    ctx.beginPath();
    ctx.rect(playerX,playerY,playerWidth,playerHeight)
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath;
    } 

function drawEnemy(){
    if(enemyAlive){
    ctx.beginPath();
    ctx.rect(enemyX,enemyY,enemyWidth,enemyHeight)
    ctx.fillStyle= "red"; 
    ctx.fill();
    ctx.closePath;
        if(enemyX < canvas.width - enemyWidth && reachedRight===false){
        enemyX+=5
    }else if(enemyX === canvas.width-enemyWidth && reachedRight===false){
        reachedRight=true;
    }else if(enemyX > 0 && reachedRight===true){
        enemyX-=5;
    }else{
        reachedRight=false;

    }

    
    }
}

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score,canvas.width/8,20)
}
//----------------Start of Putting stuff on screen Block----------------
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
if(startGame===false){
    ctx.font = "32px Arial";
    ctx.textAlign='center'
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Press Space to Start",canvas.width/2,canvas.height/2);
    ctx.font= "11px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Made By: PChanSoft",canvas.width/2,canvas.height - 11);
    ctx.font="52px Bahnschrift Light Condensed"
    ctx.fillText("RUUDI SHOODI",canvas.width/2,canvas.height/4);
    if(spacePressed){
        startGame=true;
    }

}else if(startGame===true){
    update();
    render();
    enRender();
    enUpdate();
    drawPlayer();
    drawEnemy();
    drawScore()
if(playerAlive===false){
    alert("GAME OVER")
    document.location.reload();
    clearInterval(interval);
}
    //keyboard functionality for the Player
    if(rightPressed && playerX < canvas.width - playerWidth){
        playerX +=7;

    }
    else if(leftPressed && playerX > 0){
        playerX -=7;
    }
    if(spacePressed && keyChecker === 0){ //keyChecker here prevents the button from activating more than once when it's held down, until it resets when the key comes back up.
        makeBullet();
        //enMakeBullet();
        keyChecker++;

    }    
}
}
//-------------This is what actually starts all the functions on load.
// var interval = setInterval(draw,10) 
    interval = setInterval(draw,10)
//var enemyTimer=setInterval(enMakeBullet,4000)
//-------------------End of the block---------------------------------


//Lets make a bullet firing pattern for the enemies, to make it more challenging!
//Triple Fire
function tripleFire(){
    setTimeout(enMakeBullet,500);
    setTimeout(enMakeBullet,1000);
    setTimeout(enMakeBullet,1500);
};

//Lets make a function that aims something at the player dynamically
// function angleToPlayer(dx,dy){
//     let angle=atan2(dy,dx)


// }

