// The point and size class used in this program
function Point(x, y) {
    this.x = (x)? parseFloat(x) : 0.0;
    this.y = (y)? parseFloat(y) : 0.0;
}

function Size(w, h) {
    this.w = (w)? parseFloat(w) : 0.0;
    this.h = (h)? parseFloat(h) : 0.0;
}

// Helper function for checking intersection between two rectangles
function intersect(pos1, size1, pos2, size2) {
    return (pos1.x < pos2.x + size2.w && pos1.x + size1.w > pos2.x &&
            pos1.y < pos2.y + size2.h && pos1.y + size1.h > pos2.y);
}


// The player class used in this program
function Player() {
    this.node = svgdoc.getElementById("player");
    this.position = PLAYER_INIT_POS;
    this.motion = motionType.NONE;
    this.verticalSpeed = 0;
}

Player.prototype.isOnPlatform = function() {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));

        if (((this.position.x + PLAYER_SIZE.w > x && this.position.x < x + w) ||
             ((this.position.x + PLAYER_SIZE.w) == x && this.motion == motionType.RIGHT) ||
             (this.position.x == (x + w) && this.motion == motionType.LEFT)) &&
            this.position.y + PLAYER_SIZE.h == y) return true;
    }
    if (this.position.y + PLAYER_SIZE.h == SCREEN_SIZE.h) return true;

    return false;
}

Player.prototype.collidePlatform = function(position) {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);

        if (intersect(position, PLAYER_SIZE, pos, size)) {
            position.x = this.position.x;
            if (intersect(position, PLAYER_SIZE, pos, size)) {
                if (this.position.y >= y + h)
                    position.y = y + h;
                else
                    position.y = y - PLAYER_SIZE.h;
                this.verticalSpeed = 0;
            }
        }
    }
}

function collidePlatform(position) {
    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
        var node = platforms.childNodes.item(i);
        if (node.nodeName != "rect") continue;

        var x = parseFloat(node.getAttribute("x"));
        var y = parseFloat(node.getAttribute("y"));
        var w = parseFloat(node.getAttribute("width"));
        var h = parseFloat(node.getAttribute("height"));
        var pos = new Point(x, y);
        var size = new Size(w, h);

        while(intersect(position, GOODTHING_SIZE, pos, size)) {
            position.x += 5;
            position.y += 5;

            }
        }
}


Player.prototype.collideScreen = function(position) {
    if (position.x < 0) position.x = 0;
    if (position.x + PLAYER_SIZE.w > SCREEN_SIZE.w) position.x = SCREEN_SIZE.w - PLAYER_SIZE.w;
    if (position.y < 0) {
        position.y = 0;
        this.verticalSpeed = 0;
    }
    if (position.y + PLAYER_SIZE.h > SCREEN_SIZE.h) {
        position.y = SCREEN_SIZE.h - PLAYER_SIZE.h;
        this.verticalSpeed = 0;
    }
}

//
// Below are constants used in the game
//
var PLAYER_SIZE = new Size(40, 40);         // The size of the player
var SCREEN_SIZE = new Size(600, 560);       // The size of the game screen
var PLAYER_INIT_POS  = new Point(10, 10);   // The initial position of the player


var MOVE_DISPLACEMENT = 5;                  // The speed of the player in motion
var JUMP_SPEED = 15;                        // The speed of the player jumping
var VERTICAL_DISPLACEMENT = 1;              // The displacement of vertical speed

var GAME_INTERVAL = 25;                     // The time interval of running the game

var BULLET_SIZE = new Size(10, 10);         // The speed of a bullet
var BULLET_SPEED = 10.0;                    // The speed of a bullet
                                            //  = pixels it moves each game loop
var SHOOT_INTERVAL = 200.0;                 // The period when shooting is disabled

//may need to modify
var MONSTER_SIZE = new Size(10, 40);        // The size of monsters
var MONSTER_SPEED = 10;                      // The speed of the monster in motion
var ENDPOINT_SIZE = new Size(40,40);            // The size of end point
var GOODTHING_SIZE = new Size(40,40);           // The size of goodthing point
var PORTAL_SIZE = new Size(40,20);             // The size of portal

//Score
var GOODTHING_POINT = 20;
var MOSTER_POINT = 40;


//
// Variables in the game
//
var motionType = {NONE:0, LEFT:1, RIGHT:2}; // Motion enum

var svgdoc = null;                          // SVG root document node
var player = null;                          // The player object
var gameInterval = null;                    // The interval
var zoom = 1.0;                             // The zoom level of the screen
var timeRemaining = 100;                    // Time left , start from 100s
var countDownTimeInterval = null;           // The interval
var ZoonMode = false;                       // The ZoonMode, false = NormalMode
var Score = 0;                              // Store user score
var endpoint = null;                        // The endpoint object
var numGoodthing = 0;                       // The number of Goodthing
var RemainingShoot = 8;                     // The number of remaining shoot
var canShoot = true;                         // A flag indicating whether the player can shoot a bullet
var name = "Anonymous";
var portal1=null;
var portal2=null;
var disappeartimeCount =null;
var newPlatform1= null;
var newPlatform2= null;
var newPlatform3= null;
var id =null;
var turningLeft =false;
var image_turningLeft =false;
var image_monsterturningLeft =false;
var openCheat =false;
var loseSound ,winSound,shootSound, bgm, monsterDieSound;
var bgmTime;


function Getname(){
     name = prompt("Please enter your name", name);
}

function reset(evt){
  RemainingShoot =8;
  Score = 0;
  timeRemaining = 100;
  numGoodthing = 0;
  svgdoc = evt.target.ownerDocument;
  var node = svgdoc.getElementById("highscoretable");
  node.style.setProperty("visibility", "hidden", null);

  var monsters = svgdoc.getElementById("monsters");
  while (monsters.firstChild) {
    monsters.removeChild(monsters.firstChild);
  }

  var goodthings = svgdoc.getElementById("goodthings");
  while (goodthings.firstChild) {
  goodthings.removeChild(goodthings.firstChild);
  }

}
function loadbgm(){
  bgm.play();
}

//
// The load function for the SVG document
//
function load(evt) {
    // Set the root node to the global variable
    svgdoc = evt.target.ownerDocument;

    svgdoc.getElementById("introduction").setAttribute("visibility","hidden")

    loseSound =document.getElementById("lose");
    winSound = document.getElementById("win");
    shootSound = document.getElementById("shoots");
    bgm = document.getElementById("bgm");
    monsterDieSound= document.getElementById("monsterDie");
    bgm.play();
    bgmTime=setInterval(function(){bgm.pause(); loadbgm()}, 33000);

    // Attach keyboard events
    svgdoc.documentElement.addEventListener("keydown", keydown, false);
    svgdoc.documentElement.addEventListener("keyup", keyup, false);
    var animation = svgdoc.getElementById("Timebar-anim");
    animation.beginElement();
    animation = svgdoc.getElementById("monsters-anim");
    animation.beginElement();

  var platforms = svgdoc.getElementById("platforms");

  // Create a new platform element
  newPlatform1 = svgdoc.createElementNS("http://www.w3.org/2000/svg", "rect");

  // Set the various attributes of the line
  newPlatform1.setAttribute("id", "newPlatform1");
  newPlatform1.setAttribute("x", 20);
  newPlatform1.setAttribute("y", 170);
  newPlatform1.setAttribute("width", 60);
  newPlatform1.setAttribute("height", 20);
  newPlatform1.setAttribute("type", "disappearing");
  newPlatform1.style.setProperty("fill-opacity", 1, null);
  newPlatform1.style.setProperty("stroke", "#aa0000", null);
  newPlatform1.style.setProperty("fill", "#aa0000", null);
  newPlatform1.style.setProperty("stroke-width", 0.26458332, null);

  // Add the new platform to the end of the group
  platforms.appendChild(newPlatform1);

  // Create a new platform element
  newPlatform2 = svgdoc.createElementNS("http://www.w3.org/2000/svg", "rect");

  // Set the various attributes of the line
  newPlatform2.setAttribute("id", "newPlatform2");
  newPlatform2.setAttribute("x", 360);
  newPlatform2.setAttribute("y", 70);
  newPlatform2.setAttribute("width", 80);
  newPlatform2.setAttribute("height", 20);
  newPlatform2.setAttribute("type", "disappearing");
  newPlatform2.style.setProperty("fill-opacity", 1, null);
  newPlatform2.style.setProperty("stroke", "#aa0000", null);
  newPlatform2.style.setProperty("fill", "#aa0000", null);
  newPlatform2.style.setProperty("stroke-width", 0.26458332, null);

  // Add the new platform to the end of the group
  platforms.appendChild(newPlatform2);

  newPlatform3 = svgdoc.createElementNS("http://www.w3.org/2000/svg", "rect");

  // Set the various attributes of the line
  newPlatform3.setAttribute("id", "newPlatform3");
  newPlatform3.setAttribute("x", 520);
  newPlatform3.setAttribute("y", 280);
  newPlatform3.setAttribute("width", 60);
  newPlatform3.setAttribute("height", 20);
  newPlatform3.setAttribute("type", "disappearing");
  newPlatform3.style.setProperty("fill-opacity", 1, null);
  newPlatform3.style.setProperty("stroke", "#aa0000", null);
  newPlatform3.style.setProperty("fill", "#aa0000", null);
  newPlatform3.style.setProperty("stroke-width", 0.26, null);

  // Add the new platform to the end of the group
  platforms.appendChild(newPlatform3);



    // Remove text nodes in the 'platforms' group
    cleanUpGroup("platforms", true);

    // Create the player
    player = new Player();

    // Create the monsters
    for(var i=0;i<6 ; i++){
    var monster_x = Math.floor(Math.random()*400 + 150);
    var monster_y = Math.floor(Math.random()*360 + 150);
    createMonster(monster_x,  monster_y);
    //console.log("original position ," +monster_x+ " , "+ monster_y);
    }


    // Create the Goodthings
    createGoodThing(380,30);
    createGoodThing(30,90);
    createGoodThing(155,380);
    createGoodThing(240,380);
    createGoodThing(350,500);
    createGoodThing(460,320);
    createGoodThing(200,250);
    createGoodThing(550,180);


    // Create the EndPoint
    endpoint = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    svgdoc.getElementById("endpoints").appendChild(endpoint);

    endpoint.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#endpoint");

  	endpoint.setAttribute("x", 550);
    endpoint.setAttribute("y", 10);
    endpoint.setAttribute("transform","translate(" + (1150-50 +40) + ", 0) scale(-1, 1)");

    // Create the Portal
    portal1 = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    svgdoc.getElementById("portals").appendChild(portal1);

    portal1.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#portal 1");
  	portal1.setAttribute("x", 3);
    portal1.setAttribute("y", 470);

    portal2 = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
    svgdoc.getElementById("portals").appendChild(portal2);

    portal2.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#portal 2");
    portal2.setAttribute("x", 570);
    portal2.setAttribute("y", 430);

    // Start the game interval
    gameInterval = setInterval("gamePlay()", GAME_INTERVAL);

    // Remaining time will be reduced by 1 every second
    countDownTimeInterval = setInterval("countDown()",1000);
}


//
// This function removes all/certain nodes under a group
//
function cleanUpGroup(id, textOnly) {
    var node, next;
    var group = svgdoc.getElementById(id);
    node = group.firstChild;
    while (node != null) {
        next = node.nextSibling;
        if (!textOnly || node.nodeType == 3) // A text node
            group.removeChild(node);
        node = next;
    }
}


//
// This function creates the monsters in the game
//
function createMonster(x, y) {
	//the svcdog has created in load function already
	var monster = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
	svgdoc.getElementById("monsters").appendChild(monster);

	//monster =<use xlink:href="#monster">
	monster.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#monster");

	////monster = <use xlink:href="#monster" x="x" y="y" />
	monster.setAttribute("x", x);
	monster.setAttribute("y", y);
}

//
// This function creates the goodthings in the game
//
function createGoodThing(x,y){

  var position = new Point(x,y);

  var GoodThing = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");
	svgdoc.getElementById("goodthings").appendChild(GoodThing);

	GoodThing.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#goodthing");

	GoodThing.setAttribute("x", position.x);
	GoodThing.setAttribute("y", position.y);
  numGoodthing  = numGoodthing + 1;
}


//
// This function shoots a bullet from the player
//
function shootBullet() {
    // Disable shooting for a short period of time
    canShoot = false;
    setTimeout("canShoot = true",SHOOT_INTERVAL);

    // Create the bullet using the use node



    var bullet = svgdoc.createElementNS("http://www.w3.org/2000/svg", "use");

    if (player.motion == motionType.LEFT)
      bullet.setAttribute("motion","LEFT");
    else
      bullet.setAttribute("motion","RIGHT");

	  svgdoc.getElementById("bullets").appendChild(bullet);

	  bullet.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", "#bullet");

     var bullet_x;

    if (player.motion == motionType.LEFT)
      bullet_x = player.position.x - PLAYER_SIZE.w/2.0 - BULLET_SIZE.w/2.0;
    else {
      bullet_x = player.position.x + PLAYER_SIZE.w/2.0 - BULLET_SIZE.w/2.0;
    }
	  var bullet_y = player.position.y + PLAYER_SIZE.h/2.0 - BULLET_SIZE.h/2.0;
	  bullet.setAttribute("x", bullet_x);
	  bullet.setAttribute("y", bullet_y);

 if(openCheat == false)
    RemainingShoot = RemainingShoot - 1;
}


//
// This is the keydown handling function for the SVG document
//
function keydown(evt) {
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
            turningLeft = true;
            player.motion = motionType.LEFT;
            break;

        case "D".charCodeAt(0):
            turningLeft = false;
            player.motion = motionType.RIGHT;
            break;

        case "W".charCodeAt(0):
        if(openCheat==false){
            if (player.isOnPlatform()) {
                player.verticalSpeed = JUMP_SPEED;
            }
          }
          else {
            player.verticalSpeed = JUMP_SPEED;
          }
            break;

	//add a case to shoot bullet
	//spacebar
	       case 32:
            if (RemainingShoot>0){
              shootSound.pause();
	               if (canShoot){
	                shootBullet();
                  shootSound.play();
                }
            }
            break;

        case "C".charCodeAt(0):
            player.node.setAttribute("opacity","0.5")
            openCheat =true;
            break;

        case "V".charCodeAt(0):
            player.node.setAttribute("opacity","1")
            openCheat = false;
            break;
    }
}


//
// This is the keyup handling function for the SVG document
//
function keyup(evt) {
    // Get the key code
    var keyCode = (evt.keyCode)? evt.keyCode : evt.getKeyCode();

    switch (keyCode) {
        case "A".charCodeAt(0):
            if (player.motion == motionType.LEFT) player.motion = motionType.NONE;
            break;

        case "D".charCodeAt(0):
            if (player.motion == motionType.RIGHT) player.motion = motionType.NONE;
            break;
    }
}


//
// This function checks collision
//
function collisionDetection() {

    //Check whether the player reach the exits=win the games
    var endPoint = svgdoc.getElementById("endpoints").childNodes.item(0);
    var x = parseInt(endPoint.getAttribute("x"));
    var y = parseInt(endPoint.getAttribute("y"));
    if ( intersect(player.position,PLAYER_SIZE,new Point(x,y),ENDPOINT_SIZE)){
     if(numGoodthing==0){
            reachExit();
            // Get the high score table from cookies***************************************************
            var table = getHighScoreTable()

            // Create the new score record
            var record=new ScoreRecord(name,Score);

            // Insert the new score record
            //assume the recorf will add in the last element
            var position =table.length;
            for(var i = 0;i<table.length;i++){
              if(record.score > table[i].score){
                position=i;
                break;
              }
            }
            //0 mean the number of delete item in the table .just insert so 0
            table.splice(position,0,record);

            // Store the new high score table
            setHighScoreTable(table);

            // Show the high score table
            showHighScoreTable(table);

            return;
            //**************************************************************************************
       }
      }

    // Check whether the player collides with a monster
    var monsters = svgdoc.getElementById("monsters");
    for (var i = 0; i < monsters.childNodes.length; i++) {
        var monster = monsters.childNodes.item(i);
        var x = parseInt(monster.getAttribute("x"));
        var y = parseInt(monster.getAttribute("y"));

	      // For each monster check if it overlaps with the player
        // if yes, stop the game
        if(openCheat == false){
        if ( intersect(player.position,PLAYER_SIZE,new Point(x,y),MONSTER_SIZE)){
              gameOver();
		    }}
    }

    // Check whether the player collides with a GoodThings
    var goodthings = svgdoc.getElementById("goodthings");
    for (var i = 0; i < goodthings.childNodes.length; i++) {
        var goodthing = goodthings.childNodes.item(i);
        var x = parseInt(goodthing.getAttribute("x"));
        var y = parseInt(goodthing.getAttribute("y"));

        if ( intersect(player.position,PLAYER_SIZE,new Point(x,y),GOODTHING_SIZE)){
              goodthings.removeChild(goodthing);
              i--;
              if (ZoonMode == false)
                Score = Score + GOODTHING_POINT;
              else
                Score = Score + GOODTHING_POINT*2;
              numGoodthing--;

              //console.log(numGoodthing);
        }
    }

    // Check whether a bullet hits a monster
    var bullets = svgdoc.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var bullet = bullets.childNodes.item(i);
        var x = parseInt(bullet.getAttribute("x"));
        var y = parseInt(bullet.getAttribute("y"));

        for (var j = 0; j < monsters.childNodes.length; j++) {
            var monster = monsters.childNodes.item(j);
            var mx = parseInt(monster.getAttribute("x"));
            var my = parseInt(monster.getAttribute("y"));

	           // For each bullet check if it overlaps with any monster
             // if yes, remove both the monster and the bullet
            if(intersect(new Point(x,y),BULLET_SIZE,new Point(mx,my),MONSTER_SIZE)){
			           monsters.removeChild(monster);
			           j--;
			           bullets.removeChild(bullet);
			           i--;
                 monsterDieSound.play();

                 //Update the Score
                 if (ZoonMode == false)
                   Score = Score + MOSTER_POINT;
                 else
                   Score = Score + MOSTER_POINT*2;
			      }
         }
    }

    var portals = svgdoc.getElementById("portals");
    for (var i = 0; i < portals.childNodes.length; i++) {
        var portal = portals.childNodes.item(i);
        var x = parseInt(portal.getAttribute("x"));
        var y = parseInt(portal.getAttribute("y"));

        if ( intersect(player.position,PLAYER_SIZE,new Point(x,y),PORTAL_SIZE)){
               changeposition(i);
        }
    }

    var platforms = svgdoc.getElementById("platforms");
    for (var i = 0; i < platforms.childNodes.length; i++) {
      var platform = platforms.childNodes.item(i);
      if (platform.getAttribute("type") == "disappearing") {

          var x = parseFloat(platform.getAttribute("x"));
          var y = parseFloat(platform.getAttribute("y"));
          var w = parseFloat(platform.getAttribute("width"));
          var h = parseFloat(platform.getAttribute("height"));

          if (((player.position.x + PLAYER_SIZE.w > x && player.position.x < x + w) ||
             ((player.position.x + PLAYER_SIZE.w) == x ) ||
             (player.position.x == (x + w) )) &&
             player.position.y + PLAYER_SIZE.h == y) {

            id = platform.getAttribute("id");
            platform.style.setProperty("opacity",0.5, null);
            setTimeout(disappear,500);

           }
        }
      }
}

function disappear(){
  var platforms = svgdoc.getElementById("platforms");
  for (var i = 0; i < platforms.childNodes.length; i++) {
    var platform = platforms.childNodes.item(i);
    if (platform.getAttribute("id") == id) {
  var platformOpacity = parseFloat(platform.style.getPropertyValue("fill-opacity"));

  while(platformOpacity>0){
  platformOpacity -= 0.1;
}
  svgdoc.getElementById(id).remove();
}
}
}


function changeposition(n){
  if(n==1){
    var position = new Point();
    position.x = 40;
    position.y = 470;
    // Set the location back to the player object (before update the screen)
    player.position = position;

  }
  else{
    var position = new Point();
    position.x = 520;
    position.y = 430;

    // Set the location back to the player object (before update the screen)
    player.position = position;

  }
}

//
// This function updates the position of the bullets
//
function moveBullets() {
    // Go through all bullets
    var bullets = svgdoc.getElementById("bullets");
    for (var i = 0; i < bullets.childNodes.length; i++) {
        var node = bullets.childNodes.item(i);

        // Update the position of the bullet
        var x = parseInt(node.getAttribute("x"));

        //+ BULLET_SPEED towards left
        //- BULLET_SPEED towards right
        if(node.getAttribute("motion") == "LEFT")
          node.setAttribute("x", x - BULLET_SPEED);
        else if (node.getAttribute("motion") =="RIGHT")
          node.setAttribute("x", x + BULLET_SPEED);

        // If the bullet is not inside the screen delete it from the group
        if (x > SCREEN_SIZE.w) {              // off the screen on the right
            bullets.removeChild(node);
            i--;
        }
        if ( x < 0 ) {                         // off the screen on the left
            bullets.removeChild(node);
            i--;
        }
    }
}
//
// This function updates the position of the monsters
//
function moveMonsters() {
    var monsters = svgdoc.getElementById("monsters");
    for (var i = 0; i < monsters.childNodes.length; i++) {
        var node = monsters.childNodes.item(i);

        // Update the position of the monster
        var monster_x = parseFloat(node.getAttribute("x"));
        var monster_y = parseFloat(node.getAttribute("y"));
        //Get the position of player
		     var player_x = parseFloat(player.position.x);
        var player_y = parseFloat(player.position.y);

        // subtract (= difference vector)
        var dx = player_x  - monster_x;
        var dy = player_y - monster_y;

        // normalize (= direction vector)
        // (a direction vector has a length of 1)
        var length = Math.sqrt(dx * dx + dy * dy);
        if (length) {
          dx /= length;
          dy /= length;
        }

        var position =new Point(monster_x ,monster_y );

        // move
        // delta is the elapsed time in seconds
        // SPEED is the speed in units per second (UPS)

        if(turningLeft==true && monster_x > player_x){
        position.x += dx * 0.025 * MONSTER_SPEED;
        position.y += dy * 0.025 * MONSTER_SPEED;
        }
        else if( turningLeft==false && monster_x <  player_x){
          position.x += dx * 0.025 * MONSTER_SPEED;
          position.y += dy * 0.025 * MONSTER_SPEED;
        }


          node.setAttribute("x", position.x);
          node.setAttribute("y", position.y);

        //  console.log("before , "+ image_monsterturningLeft+ " , " + turningLeft + " , " + position.x + " , " + position.y);


         //  if(image_monsterturningLeft ==false && turningLeft==true && position.x > player_x){
         //  //  var x=  position.x + 20;
         //  //  node.setAttribute("transform","translate("  + x + "," + position.y + ") scale(-1, 1)");
         //    node.setAttribute("transform", "translate("  +  0 + "," +  + ")scale(-1, 1)");
         //    console.log( node.getAttribute("transform"));
         //  image_monsterturningLeft = true;
         //  }
         //  else if(image_monsterturningLeft ==true && turningLeft==true && position.x > player_x){
         //  //  node.setAttribute("transform","translate("  + position.x  + "," + position.y + ") scale(1, 1)");
         //  //node.setAttribute("transform", "translate("  +  0 + "," + position.y + ") scale(1, 1)");
         //  }
         //  else if(image_monsterturningLeft ==true && turningLeft==false && position.x < player_x){
         //  //var x=  position.x + 20;
         //  //node.setAttribute("transform","translate(" + x +"," + position.y + ") scale( -1, 1)");
         //  node.setAttribute("transform","translate(" +  0 +"," + 0  + ") ");
         //  image_monsterturningLeft= false;
         //  }
         //  else if(image_monsterturningLeft ==true && turningLeft==false && position.x > player_x){
         //  //node.setAttribute("transform","translate(" + position.x +"," + position.y + ") scale( 1, 1)");
         //  //node.setAttribute("transform","translate(" +  0 +"," + position.y  + ") scale( -1, 1)");
         //  }
         // console.log("after , "+ image_monsterturningLeft+ " , " + turningLeft + " , " + node.getAttribute("x") + " , " + node.getAttribute("y"));

    }
}

//
// This function updates the position and motion of the player in the system
//
function gamePlay() {
    // Check collisions, call the collisionDetection when you create the monsters and bullets
	   collisionDetection();

    // Check whether the player is on a platform
    var isOnPlatform = player.isOnPlatform();


    // Update player position
    var displacement = new Point();

    // Move left or right
    if (player.motion == motionType.LEFT)
        displacement.x = -MOVE_DISPLACEMENT;
    if (player.motion == motionType.RIGHT)
        displacement.x = MOVE_DISPLACEMENT;

    // Fall
    if (!isOnPlatform && player.verticalSpeed <= 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
    }

    // Jump
    if (player.verticalSpeed > 0) {
        displacement.y = -player.verticalSpeed;
        player.verticalSpeed -= VERTICAL_DISPLACEMENT;
        if (player.verticalSpeed <= 0)
            player.verticalSpeed = 0;
    }

    // Get the new position of the player
    var position = new Point();
    position.x = player.position.x + displacement.x;
    position.y = player.position.y + displacement.y;

    // Check collision with platforms and screen
    player.collidePlatform(position);
    player.collideScreen(position);

    // Set the location back to the player object (before update the screen)
    player.position = position;

    // Move the bullets, call the movebullets when you create the monsters and bullets
	moveBullets() ;
	moveMonsters();
  updateScreen();
}


//
// This function updates the position of the player's SVG object and
// set the appropriate translation of the game screen relative to the
// the position of the player
//
function updateScreen() {
    // Transform the player
    if(image_turningLeft ==true && turningLeft == false){
    player.node.setAttribute("transform",
    "translate(" +player.position.x + "," + player.position.y + ") scale(1, 1)");
    image_turningLeft = false;
    }
    else if(image_turningLeft == false && turningLeft == true){
      var x=  player.position.x + 40;
      player.node.setAttribute("transform",
      "translate("  + x + "," + player.position.y + ") scale(-1, 1)");
      image_turningLeft = true;
    }
    else if(image_turningLeft ==true && turningLeft == true){
    var x=  player.position.x + 40;
    player.node.setAttribute("transform",
    "translate(" + x +"," + player.position.y + ") scale( -1, 1)");
    }
    else{
    player.node.setAttribute("transform",
    "translate(" + player.position.x +"," + player.position.y + ") scale( 1, 1)");
    }





    // Calculate the scaling and translation factors
    var scale = new Point(zoom, zoom);
    var translate = new Point();

    translate.x = SCREEN_SIZE.w / 2.0 - (player.position.x + PLAYER_SIZE.w / 2) * scale.x;
    if (translate.x > 0)
        translate.x = 0;
    else if (translate.x < SCREEN_SIZE.w - SCREEN_SIZE.w * scale.x)
        translate.x = SCREEN_SIZE.w - SCREEN_SIZE.w * scale.x;

    translate.y = SCREEN_SIZE.h / 2.0 - (player.position.y + PLAYER_SIZE.h / 2) * scale.y;
    if (translate.y > 0)
        translate.y = 0;
    else if (translate.y < SCREEN_SIZE.h - SCREEN_SIZE.h * scale.y)
        translate.y = SCREEN_SIZE.h - SCREEN_SIZE.h * scale.y;

    // Transform the game area
    svgdoc.getElementById("gamearea").setAttribute("transform", "translate(" + translate.x + "," + translate.y + ") scale(" + scale.x + "," + scale.y + ")");

    //update the variable in screen
    svgdoc.getElementById("Score").firstChild.data =Score;
    svgdoc.getElementById("Time").firstChild.data =timeRemaining;
    svgdoc.getElementById("Bullet").firstChild.data =RemainingShoot;
    svgdoc.getElementById("Name").textContent = name.toString();


}


//
// This function sets the zoom level to 2
//
function setZoom() {
    zoom = 2.0;
    ZoonMode = true;

}

//
//This function count down the remaining time
//put it in the load function
function countDown(){
   timeRemaining=timeRemaining-1;
   if(timeRemaining == 0)
      gameOver();                    //time runs out!the player dies
}

//
//This function check if the player reach the exit Point
//
function reachExit(){
  if (ZoonMode == false)
    Score = Score + timeRemaining*2;
  else
    Score = Score + timeRemaining*2*2;             //time remaining is added to the player’s score
  clearInterval(gameInterval);
  clearInterval(countDownTimeInterval);
  clearInterval(bgmTime);
  bgm.pause();
  winSound.play();
}

//
//This function is called when the gameover
//
function gameOver(){
  clearInterval(bgmTime);
  bgm.pause();
  loseSound.play();
  clearInterval(gameInterval);
  clearInterval(countDownTimeInterval);
  clearInterval(bgmTime);
  setTimeout(function(){alert("Game over!")},100);


}
