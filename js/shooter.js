var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//----------Start Game Initializer Values------------
var startGame=false;

//Player Properties
var playerHeight=20;
var playerWidth=20;
var playerX=(canvas.width-playerWidth)/2;
var playerY=canvas.height-playerHeight;
var playerAlive=true;
var playerSpeed=2;

//keyboard key variable initialization
var rightPressed = false;
var leftPressed = false;
var spacePressed = false;
var keyChecker=0; //this variable

//Enemy Values
var enWaveArr=[];
var enemyHeight=35;
var enemyWidth=35;
var enemyX=100;
var enemyY=200;
var enemyAlive=true;
var reachedRight=false;
var enmBullet=[];
var enBulletSpeed=3;
var enemyCount=2;
var enHealth=20;
var waveStatus=1;
var waveAlive=true;

//Bullet Generator values
var bulletWidth=10;
var bulletHeight=30;
var speedY=10;
var isBullet=[]
//round bullets?


//Enemies Defeated
var enemiesKilled=0;

//Show Wave Message
var waveMessage = false;


function setDifficulty(){
    enHealth=document.getElementById('something').value;
}


//------------------------------Start of Hard Reset Block--------------------
function restartGame(){
document.location.reload();
}
//----------------------------End of Hard Reset Block----------------------

//---------------------------------------------------Keyboard Commands BLock-----------------------------------------
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
//------------------------------------------K



//----------------------------------------------------------------Start of Player Bullet Constructor Block------------------------------------------------------------
//if bullet reaches enemy, destroy bullet and enemy.
//create an constructor for the bullets so we can act on each bullet as they come and go.

function theBullet(){ //constructor for the bullets
    this.color="yellow"
    this.posX=playerX+(playerWidth/2.5); //when bullets are made, they grab the position of the player when the bullet is made, but will not update the X-axis past this point
    this.posY=playerY;
    this.alive=true;
    this.init=function(){   
        isBullet.push(this);
    };
    this.render=function(){ //decides if the bullet should still be on the screen
        if(this.alive){
            ctx.fillStyle=this.color; //makes sure specific bullets are a certain color
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
        if(waveStatus!=3){
            for(let i=0; i<enWaveArr.length;i++){
                if(this.posX > enWaveArr[i].posX && this.posX < enWaveArr[i].posX+enemyWidth && this.posY < enWaveArr[i].posY+enemyHeight && this.posY > enWaveArr[i].posY && enWaveArr[i].isAlive && this.alive===true){                
                    enWaveArr[i].life-=1;
                    console.log(enWaveArr[i].life)
                    this.alive=false;
                }else if(enWaveArr[i].life === 0 && enWaveArr[i].isAlive){;
                    enWaveArr[i].isAlive = false;
                    enemiesKilled++;
                    waveAliveCheck();
                }
            }
        }
        if(waveStatus===3){
            for (let i=0; i<enWaveArr.length;i++){
                var dx=this.posX - enWaveArr[i].posX;
                var dy=this.posY - enWaveArr[i].posY;
                var distance=Math.sqrt(dx*dx+dy*dy);
                if (distance < 5+enWaveArr[i].radians && this.alive===true && enWaveArr[i].isAlive===true){
                    this.alive=false;
                    enWaveArr[i].life--;
                }else if(enWaveArr[i].life === 0 && enWaveArr[i].isAlive){
                    enWaveArr[i].isAlive = false;
                    enemiesKilled++;
                    waveAliveCheck();
                }
            }
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
function enemBullet(enShipX,enShipY){
    this.bColor='black'
    this.bPosX=enShipX;
    this.bPosY=enShipY;
    this.bAlive=true;
    this.bInit=function(){
        enmBullet.push(this);
    };
    this.enRender=function(){ //decides if the bullet should still be on the screen
        if(this.bAlive){
            ctx.fillStyle=this.bColor; //keeps enemy bullets from looking like player bullets
            ctx.fillRect(this.bPosX,this.bPosY,10,40)
        }
    };
    this.enUpdate=function(){//updates position of existing bullets
        if(this.bAlive){
            this.bPosY+=enBulletSpeed;
        }
        if(this.bPosY>canvas.height){
            this.bAlive=false;
        }
        //When the bullet collides with an player, this will take one of the player lives.
        if(this.bPosX>playerX-playerWidth/2 && this.bPosX<playerX+playerWidth&& this.bPosY>playerY && this.bPosY<playerY+playerHeight && playerAlive){
            playerAlive=false;
            this.bAlive=false;
        }
    };

};

function enMakeBullet(enShipX,enShipY){
    badBullets = new enemBullet(enShipX,enShipY);
    badBullets.bInit();
    console.log("Making bullet")
};

function enUpdate() {
    for (let i= enmBullet.length; i--;){
        enmBullet[i].enUpdate();
    }
};

function enRender(){
    for (let i=enmBullet.length;i--;){
        enmBullet[i].enRender();
    }
};
//----------------------------------------------------------End of Enemy BUllet Block-------------------------------------




function drawPlayer(){
    ctx.beginPath();
    ctx.rect(playerX,playerY,playerWidth,playerHeight)
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath;
    } 

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Wave: "+waveStatus,canvas.width/8,20)
}

function enemyWave1(){
    this.id=0;
    this.color='red';
    this.posX=100;
    this.posY=100;
    this.isAlive=true;
    this.life=enHealth; 
    this.reachedRight=false;
    this.reachedLeft=false;
    this.init = function(){ 
        enWaveArr.push(this);
    };
    this.enMake=function (){
        if(this.isAlive && this.id===0){
            if(this.posX < canvas.width - enemyWidth && this.reachedRight===false){
                this.posX++;
            }else if(this.posX === canvas.width-enemyWidth && this.reachedRight===false){
                this.reachedRight=true;
            }else if(this.posX > 0 && this.reachedRight===true){
                this.posX--;
            }else{
                this.reachedRight=false;
            }  
        }else if(this.isAlive && this.id===1){
            this.posY=150;
            if(this.posX > 0 && this.reachedLeft===false){
                this.posX--;
            }else if(this.posX < canvas.width-enemyWidth && this.reachedLeft===true){
                this.posX ++;
            }else if(this.posX === canvas.width-enemyWidth && this.reachedLeft===true){
                this.reachedLeft=false;
            }else if (this.posX === 0){
                this.reachedLeft=true;
            }
        }
    };
    this.enWaveRender=function(){
        let fireChance=100
        if (this.isAlive){
            ctx.fillStyle= this.color; 
            ctx.fillRect(this.posX,this.posY,enemyWidth,enemyHeight);
            ctx.font="18px Arial"
            ctx.fillStyle='white';
            ctx.fillText(`${this.life}`,this.posX+(enemyWidth/2),this.posY+(enemyHeight/2))
            let fireCheck = Math.floor(Math.random()*fireChance)+1;
            if(fireCheck===fireChance){
                enMakeBullet(this.posX,this.posY);
            }
        }
    };
};

function enWave1(){
    if (enemyCount > 0){
    let newWave=new enemyWave1();
    newWave.init();
    enemyCount--
    }
};
function enMake(){
    for(let i=enWaveArr.length; i--;){
        enWaveArr[i].enMake();
        let findIndex = enWaveArr.indexOf(enWaveArr[i],0);
        enWaveArr[i].id=findIndex;
    }
};
function enWaveRender(){
    for(let i=enWaveArr.length;i--;){
        enWaveArr[i].enWaveRender();
    }
};

function enemyWave2(){
    this.id=0;
    this.color='cyan';
    this.posX=100;
    this.posY=100;
    this.isAlive=true;
    this.moarLife=5
    this.life=enHealth*this.moarLife; 
    this.reachedRight=false;
    this.reachedLeft=false;
    this.init = function(){ 
        enWaveArr.push(this);
    };
    this.enMake=function (){
        if(this.isAlive){
            if(this.posX < canvas.width - enemyWidth && this.reachedRight===false){
                this.posX++;
            }else if(this.posX === canvas.width-enemyWidth && this.reachedRight===false){
                this.reachedRight=true;
            }else if(this.posX > 0 && this.reachedRight===true){
                this.posX--;
            }else{
                this.reachedRight=false;
            }  
        }
    }
    this.enWaveRender=function(){
        let fireChance=10
        let altGuns=this.posX+(Math.floor(Math.random()*175))
        if (this.isAlive){
            enemyWidth = 175
            enemyHeight = 55
            ctx.fillStyle= this.color; 
            ctx.fillRect(this.posX,this.posY,enemyWidth,enemyHeight);
            ctx.font="18px Arial"
            ctx.fillStyle='white';
            ctx.fillText(`${this.life}`,this.posX+(enemyWidth/2),this.posY+(enemyHeight/2))
            let fireCheck = Math.floor(Math.random()*fireChance)+1;
            if(fireCheck===fireChance){
                enMakeBullet(altGuns,this.posY+enemyHeight/2);
            }
        }
    };
};

function enWave2(){
    if (enemyCount > 0){
        let newWave=new enemyWave2();
        newWave.init();
        enemyCount--
    }
};

function enemyWave3(){
    this.id=0;
    this.color='green';
    this.posX=230;
    this.posY=200;
    this.isAlive=true;
    this.moarLife=10
    this.life=enHealth*this.moarLife; 
    this.reachedRight=false;
    this.reachedLeft=false;
    this.radians=50
    this.incrementer=0;
    this.init = function(){ 
        enWaveArr.push(this); 
    };
    this.enMake=function (){
        if(this.isAlive){
            this.incrementer+=0.02;
            this.posX=230 + ((canvas.width/4))*Math.cos(this.incrementer);
            this.posY=200 + ((canvas.height/7))*Math.sin(this.incrementer);
        }
    }
    this.enWaveRender=function(){
        let fireChance=25;
        if (this.isAlive){
            ctx.fillStyle= this.color; 
            ctx.arc(this.posX,this.posY,this.radians,0,2*Math.PI)
            ctx.fill();
            ctx.font="18px Arial"
            ctx.fillStyle='white';
            ctx.fillText(`${this.life}`,this.posX,this.posY);
            let fireCheck = Math.floor(Math.random()*fireChance)+1;
            if(fireCheck===fireChance){
                enMakeBullet(this.posX,this.posY);
            }
        }
    };
};

function enWave3(){
    if (enemyCount > 0){
        let newWave=new enemyWave3();
        newWave.init();
        enemyCount--
    }
};



//----------------Start of Putting stuff on screen Block----------------
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
if(startGame===false){

    ctx.font = "32px Arial";
    ctx.textAlign='center'
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Press Space to Start",canvas.width/2,canvas.height/2);
    ctx.font= "11px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Made By: PChanSoft",canvas.width/2,canvas.height - 11);
    ctx.font="52px Bahnschrift Light Condensed"
    ctx.fillText("RUUDI SHOODI",canvas.width/2,canvas.height/4);
    if(spacePressed){
        startGame=true;
        document.getElementById('something').disabled=true;
    }

}else if(startGame===true){
    update();
    render();
    //Time to join the functionality of enBullet creation with our enemy constructor to make sure bullets only fire from their respective enemies when it occurs... fun!
        if(waveStatus===1){
            enWave1();
        }else if(waveStatus===2){
                enWave2();
            }else if(waveStatus===3){
                enWave3();
            }
    enRender();
    enUpdate();
    drawPlayer();
    enMake();
    enWaveRender();
    drawScore()
        if(playerAlive===false){
            alert("GAME OVER")
            document.location.reload();
            clearInterval(interval);
        }
    //keyboard functionality for the Player
        if(rightPressed && playerX < canvas.width - playerWidth){
            playerX +=playerSpeed;

        }
        else if(leftPressed && playerX > 0){
            playerX -=playerSpeed;
        }
        if(spacePressed && keyChecker === 0){ //keyChecker here prevents the button from activating more than once when it's held down, until it resets when the key comes back up.
            makeBullet();
        //enMakeBullet();
            keyChecker++;

        }    
    }
    if(waveAlive===false && waveStatus){
        waveStatus++;
        if(waveStatus<4){
            waveAlive=true;
            if(waveStatus===2){
                enemyCount=1;
                }else if(waveStatus===3){
                    enemyCount=1;
                }
            }
        }
    if(waveMessage===true&&waveStatus<3){
        showWaveMessage();
    }
    if(waveStatus === 4){
        alert(`You Win! You fired ${isBullet.length} bullets and defeated ${enemiesKilled} enemies!`);
        document.location.reload();
        clearInterval(interval)
    }
}
//-------------This is what actually starts all the functions on load.
// var interval = setInterval(draw,10) 
    interval = setInterval(draw,10)
//var enemyTimer=setInterval(enMakeBullet,4000)
//-------------------End of the block---------------------------------



//When an enemy dies, I want to set a timerout function to see if all enemies have been defeated, if so, move on to next wave
function waveAliveCheck(){
    let enemiesAlive=0;
    for (let i=0; i<enWaveArr.length; i++){
        if (enWaveArr[i].isAlive===true){
            enemiesAlive++
            console.log('Alive:'+enemiesAlive)
        }
    }
    if (enemiesAlive===0 && waveStatus < 4){
        waveMessage=true;
        enmBullet=[];
        setTimeout(waveSetter,3000)
    }
}
function waveSetter(){
    waveAlive=false;
    waveMessage=false;
}
function showWaveMessage(){
    ctx.font='18px Arial'
    ctx.fillStyle='red'
    ctx.fillText("Incoming Wave: "+(waveStatus+1),100,100)
};
