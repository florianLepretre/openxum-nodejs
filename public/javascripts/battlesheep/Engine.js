"use strict"

// Constants
Battlesheep.campSize = 50;
Battlesheep.sheepSpeed = 2;
Battlesheep.growSpeed = 0.1;

//////////////////////////
//   Class: Sheep
//////////////////////////

Battlesheep.Sheep = function(x, y){
// private attributes
    var srcX, srcY;
    var destX, destY;
    var speedX, speedY;
    var deletable ;
    var orientation;

// private methods
    var init = function (x, y) {
        srcX = x;
        srcY = y;
        deletable = false ;
    };

// public methods
    this.create = function (dX, dY){
        // Set a sheep at a random position
        srcX += (Math.random()*50)- (Battlesheep.campSize/2);
        srcY += (Math.random()*50)- (Battlesheep.campSize/2);
        destX = dX + (Math.random()*50) - (Battlesheep.campSize/2);
        destY = dY + (Math.random()*50) - (Battlesheep.campSize/2);

        var distX = Math.abs(destX-srcX);
        var distY = Math.abs(destY-srcY);

        if (distX > distY){
            orientation = (destX-srcX > 0) ? 2 : 1; 
        }
        else {
            orientation = (destY-srcY > 0) ? 0 : 3;
        }

        var z = Math.sqrt(distX*distX + distY*distY);

        if (srcX < destX){
            speedX = (distX/z) * Battlesheep.sheepSpeed;
        }
        else {
            speedX = -(distX/z) * Battlesheep.sheepSpeed;
        }

        if (srcY < destY){
            speedY = (distY/z) * Battlesheep.sheepSpeed;
        }
        else {
            speedY = -(distY/z) * Battlesheep.sheepSpeed;
        }
    };

    this.move = function(){
        // Move a sheep according to its speed, check if arrived at destination
        if (speedX > 0){
            if (speedY > 0){
                if (srcX < destX && srcY < destY){
                    srcX += speedX;
                    srcY += speedY;
                }
                else {
                    deletable = true;
                }
            }
            else {
                if (srcX < destX && srcY > destY){
                    srcX += speedX;
                    srcY += speedY;
                }
                else {
                    deletable = true;
                }
            }
        }
        else {
            if (speedY > 0){
                if (srcX > destX && srcY < destY){
                    srcX += speedX;
                    srcY += speedY;
                }
                else {
                    deletable = true;
                }
            }
            else {
                if (srcX > destX && srcY > destY){
                    srcX += speedX;
                    srcY += speedY;
                }
                else {
                    deletable = true;
                }
            }
        }
    };

    // getters
    this.getSrc = function(){
        return({srcX: srcX, srcY: srcY});
    };

    this.getDeletable = function(){
        return deletable;
    };

    this.getOrientation = function (){
        return orientation;
    };

    init(x ,y);
};


//////////////////////////
//   Class: Troop
//////////////////////////

Battlesheep.Troop = function (c, n, coords, isrc, idest ){
// private attributes
    var population;
    var color;
    var indexSrc;
    var indexDest;
    var nFrame;
    var sheeps = [];

// private methods
    var init = function (c, n, coords, isrc, idest) {
        population = n;
        color = c;
        indexSrc = isrc;
        indexDest = idest;
        nFrame = 0;
        for (var i=0; i< n; ++i){
            sheeps.push(new Battlesheep.Sheep(coords.x , coords.y));
        }
    };

// public methods
    this.createSheep = function (i, x, y) {
        sheeps[i].create(x, y);
    };

    this.moveSheep = function(j){
        sheeps[j].move();
    };

    this.deleteSheep = function(j){
        if(sheeps[j].getDeletable()){
            sheeps.splice(j,1);
            if (sheeps.length == 0){
                delete this;
            }
        }
    };

    this.newFrame = function(){
        nFrame = (nFrame>=2) ? 0 : nFrame + 1;
    };

    // getters
    this.getPopulation = function(){
        return population;
    };

    this.getColor = function () {
        return color;
    };

    this.getIndexSrc = function(){
        return indexSrc;
    };

    this.getIndexDest = function(){
        return indexDest;
    };

    this.getFrame = function(){
        return nFrame;
    };

    this.getSheepsLength = function(){
        return sheeps.length;
    };

    this.getSheepSrc = function(j){
        return sheeps[j].getSrc();
    };

    this.getSheepDeletable = function(j){
        return sheeps[j].getDeletable();
    };

    this.getSheepOrientation = function(j){
        return sheeps[j].getOrientation();
    };

    init(c, n, coords, isrc , idest);
};


//////////////////////////
//   Class: Camp
//////////////////////////

Battlesheep.Camp = function(c, x, y){
// private attributes
    var color;
    var size;
    var population;
    var attacked;
    var centerX;
    var centerY;
    var nFrame;

// private methods
    var init = function (c, x, y) {
        color = c;
        size = Battlesheep.campSize;
        population = (color === 'none') ? 15 : 1;
        centerX = x;
        centerY = y;
        nFrame = 0;
    };

// public methods
    this.dividePopulation = function () {
        // Divide by 2 camp population, returns the result
        var divPop = parseInt(population/2);
        population = divPop;
        return divPop;
    };

    this.addPopulation = function (n) {
        // Add n population to the camp
        population += n;
    };

    this.deletePopulation = function(n){
        // Delete n population to the camp
        population = (population - n < 0) ? 0 : population-n;
    };

    this.grow = function () {
        // Grow the camp population
        population += Battlesheep.growSpeed;
    };

    this.newFrame = function(){
        nFrame = (nFrame >= 9) ? 0 : nFrame + 1;
    };

    // getters
    this.getColor = function(){
        return color;
    };

    this.getSize = function(){
        return size;
    };

    this.getPopulation = function(){
        return population;
    };

    this.isAttacked = function(){
        return attacked;
    };

    this.getCoordinates = function(){
        return {x: centerX, y: centerY};
    };

    this.getFrame = function(){
        return nFrame;
    };

    // setters
    this.setColor = function(c){
        color = c;
    };

    this.setAttacked = function(bool){
        attacked = bool;
    };

    init(c, x, y);
 };


//////////////////////////
//   Class: Camp
//////////////////////////

Battlesheep.Engine = function (m, c, oc){
//private attributes
    var mode;
    var color;
    var opponent_color;
    var win;
    var camps = [];
    var troops = [];

// private methods
    var init = function(m, c, oc){
        mode = m;
        color = (c == 1) ? 'blue': 'red';
        opponent_color = (oc == 1) ? 'blue':'red';
        win = false;

        // Set players camps
        camps[0] = new Battlesheep.Camp('blue', 512, 178);
        camps[1] = new Battlesheep.Camp('red', 200, 486);

        // Set other camps neutral
        camps[2] = new Battlesheep.Camp('none', 270, 124);
        camps[3] = new Battlesheep.Camp('none', 104, 290);
        camps[4] = new Battlesheep.Camp('none', 500, 444);

        // Grow the camp each 50ms
        var growing = setInterval(function(){
            for (var i=0; i<camps.length; i++){
                if (camps[i].getColor() !== 'none'){
                    camps[i].grow();
                }
            }
        }, 50);
    };

    var checkWin = function() {
        // Check for a win
        for (var i=0; i<camps.length; i++){
            if (camps[i].getColor() != color){
                return false;
            }
        }
        return true;
    };

    var attack = function (s, t, d) {
        // Attack from camps[s] to camps[d], width t troops
        camps[d].deletePopulation(t);
        if (camps[d].getPopulation() <= 0){
            camps[d].setColor(camps[s].getColor());
            win = checkWin();
        }
    };

    var merge = function(s, t, d){
        // Merge t troops from camps[s] with camps[d]
        camps[d].addPopulation(t);
    };

// public methods
    this.move = function (s, d){
        // Generate ally troop
        var destinationCoords = camps[d].getCoordinates();
        var t = camps[s].dividePopulation();
        if (t > 50){
            t = 50;
        }
        // Create a new Troop
        troops.push(new Battlesheep.Troop(color,t,camps[s].getCoordinates(),s ,d));

        // Create t sheep
        for (var i=0; i<troops[troops.length-1].getSheepsLength(); i++){
            troops[troops.length-1].createSheep(i, destinationCoords.x, destinationCoords.y);
        }
    };

    this.moveEnnemy = function (s, d){
        // Generate ally troop
        var destinationCoords = camps[d].getCoordinates();
        var t = camps[s].dividePopulation();
        if (t > 50){
            t = 50;
        }
        // Create a new Troop
        troops.push(new Battlesheep.Troop(opponent_color,t,camps[s].getCoordinates(),s ,d));
        // Create t sheep
        for (var i=0; i<troops[troops.length-1].getSheepsLength(); i++){
            troops[troops.length-1].createSheep(i, destinationCoords.x, destinationCoords.y);
        }
    };

    this.moveTroop = function(i, j){
        troops[i].moveSheep(j);
    };

    this.deleteSheepFromTroop = function(i, j){
        // Delete a sheep from its troop, then apply merge or attack according to its destination
        troops[i].deleteSheep(j);

        var indexDest = troops[i].getIndexDest();

        if (troops[i].getColor() === camps[indexDest].getColor()){
            merge(troops[i].getIndexSrc(), 1, indexDest);
        }
        else {
            attack(troops[i].getIndexSrc(), 1, indexDest);
        }

        if (!troops[i].getSheepsLength()){
            // debug here
            console.log('!');
        }
    };

    this.newCampFrame = function(i){
        camps[i].newFrame();
    };

    this.newTroopFrame = function(i){
        troops[i].newFrame();
    };

    // getters
    this.getWin = function(){
        return win;
    };

    this.getCampsLength = function (){
        return camps.length;
    };

    this.getCampColor = function(i){
        return camps[i].getColor();
    };

    this.getCampSize = function(i){
        return camps[i].getSize();
    };

    this.getCampPopulation = function(i){
        return camps[i].getPopulation();
    };

    this.isCampAttacked = function(i){
        return camps[i].isAttacked();
    };

    this.getCampCoordinates = function(i){
        return camps[i].getCoordinates();
    };

    this.getCampFrame = function(i){
        return camps[i].getFrame();
    };

    this.getTroopsLength = function(){
        return troops.length;
    };

    this.getTroopLength = function(i){
        return troops[i].getSheepsLength();
    };

    this.getTroopPopulation = function(i){
        return troops[i].getPopulation();
    };

    this.getTroopDest = function(i){
        return troops[i].getIndexDest();
    };

    this.getTroopFrame = function(i){
        return troops[i].getFrame();
    };

    this.getSheepInfo = function(i, j){
        return {
            sources    : troops[i].getSheepSrc(j),
            deletable  : troops[i].getSheepDeletable(j),
            color      : troops[i].getColor(),
            orientation: troops[i].getSheepOrientation(j)
        };
    };

    // setters
    this.setCampAttacked = function(i, bool){
        camps[i].setAttacked(bool);
    };

    init(m, c, oc);
};