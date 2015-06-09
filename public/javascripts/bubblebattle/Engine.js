"use strict"

// Constants
Bubblebattle.campSize = 50;
Bubblebattle.bubbleSpeed = 2; // pixel / frame rate
Bubblebattle.growSpeed = 0.1;

Bubblebattle.Bubble = function(x, y){
// private attributes
    var srcX, srcY;
    var destX, destY;
    var speedX, speedY;
    var deletable ;

// private methods
    var init = function (x, y) {
        srcX = x;
        srcY = y;
        deletable = false ;
    };

// public methods
    this.createBubble = function (dX, dY){
        srcX += (Math.random()*60)-Bubblebattle.campSize;
        srcY += (Math.random()*60)-Bubblebattle.campSize;
        destX = dX;
        destY = dY;

        var distX = Math.abs(destX-srcX);
        var distY = Math.abs(destY-srcY);

        var z = Math.sqrt(distX*distX + distY*distY);

        if (srcX < destX){
            speedX = (distX/z) * Bubblebattle.bubbleSpeed;
        }
        else {
            speedX = -(distX/z) * Bubblebattle.bubbleSpeed;
        }

        if (srcY < destY){
            speedY = (distY/z) * Bubblebattle.bubbleSpeed;
        }
        else {
            speedY = -(distY/z) * Bubblebattle.bubbleSpeed;
        }
    };

    this.getSpeed = function(){
        return ({speedX :speedX, speedY :speedY});
    };

    this.getDest = function(){
        return ({destX :destX, destY : destY});
    };

    this.getSrc = function(){
        return({srcX: srcX, srcY: srcY});
    };

    this.getDeletable = function(){
        return deletable;
    };

    this.setSrc = function(){
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

    init(x ,y);
};

Bubblebattle.Troop = function (c, n, coords, isrc, idest ){
// private attributes
    var color;
    var bubbles = [];
    var indexSrc;
    var indexDest;

// private methods
    var init = function (c, n, coords, isrc, idest) {
        color = c;
        indexSrc = isrc;
        indexDest = idest;
        for (var i=0; i< n; ++i){
            bubbles.push(new Bubblebattle.Bubble(coords.x , coords.y));
        }
    };

// public methods
    this.createBubble = function (i, x, y) {
        bubbles[i].createBubble(x, y);
    };

    this.getIndexSrc = function(){
        return indexSrc;
    };

    this.getIndexDest = function(){
        return indexDest;
    };

    this.getColor = function () {
        return color;
    };

    this.getBubblesLength = function(){
        return bubbles.length;
    };

    this.getBubbleSrc = function(j){
        return bubbles[j].getSrc();
    };

    this.setBubbleSrc = function(j){
        bubbles[j].setSrc();
    };

    this.getBubbleDest = function(j){
        return bubbles[j].getDest();
    };

    this.getBubbleSpeed = function(j){
        return bubbles[j].getSpeed();
    };

    this.getBubbleDeletable = function(j){
        return bubbles[j].getDeletable();
    };

    this.delBubble = function(j){
        if(bubbles[j].getDeletable()){
            bubbles.splice(j,1);
            if (bubbles.length == 0){
                delete this;
            }
        }
    };
    init(c, n, coords, isrc , idest);
};

Bubblebattle.Camp = function(c, x, y){
// private attributes
    var centerX;
    var centerY;
    var color;
    var size;
    var population;

// private methods
    var init = function (c, x, y) {
        centerX = x;
        centerY = y;
        color = c;
        size = Bubblebattle.campSize;
        population = (color === 'none') ? 15 : 1;
    };

// public methods = function
    this.getColor = function(){
        return color;
    };

    this.dividePopulation = function () {
        var divPop = parseInt(population/2);
        population = divPop;
        return divPop;
    };

    this.addPopulation = function (t) {
      population += t;
    };

    this.deletePopulation = function(n){
        population = (population - n < 0) ? 0 : population-n;
    };

    this.getPopulation = function(){
        return population;
    };

    this.setColor = function(c){
        color = c;
    };

    this.getCoordinates = function(){
        return {x: centerX, y: centerY};
    };

    this.getSize = function(){
        return size;
    };

    this.grow = function () {
        population += Bubblebattle.growSpeed;
    };

    init(c, x, y);
 };

Bubblebattle.Engine = function (m, c, oc){
//private attributes
    var isWin;
    var mode;
    var color;
    var opponent_color;
    var camps = [];
    var troops = [];

// private methods
    var checkWin = function() {
        for (var i=0; i<camps.length; i++){
            if (camps[i].getColor() != color){
                return false;
            }
        }
        return true;
    };

    var init = function(m, c, oc){
        isWin = false;
        mode = m;
        color = (c == 1) ? 'blue': 'red';
        opponent_color = (oc == 1) ? 'blue':'red';

        // Set players camps
        camps[0] = new Bubblebattle.Camp('blue', 512, 178);
      //  camps[1] = new Bubblebattle.Camp('red', 200, 486);

        // Set ohter camps neutral
     //   camps[2] = new Bubblebattle.Camp('none', 270, 124);
      //  camps[3] = new Bubblebattle.Camp('none', 104, 290);
        camps[1] = new Bubblebattle.Camp('none', 500, 444);


        var growing = setInterval(function(){
            for (var i=0; i<camps.length; i++){
                if (camps[i].getColor() !== 'none'){
                    camps[i].grow();
                }
            }
        }, 50);
    };

    var attack = function (s, t, d) {
        camps[d].deletePopulation(t);
        if (camps[d].getPopulation() <= 0){
            camps[d].setColor(camps[s].getColor());
            isWin = checkWin();
        }
    };

    var merge = function(s, t, d){
        camps[d].addPopulation(t);
    };

// public methods
    this.getCampsLength = function (){
        return camps.length;
    };

    this.getCampColor = function(i){
        return camps[i].getColor();
    };

    this.getCampPopulation = function(i){
        return camps[i].getPopulation();
    };

    this.getCampSize = function(i){
        return camps[i].getSize();
    };

    this.getCampCoordinates = function(i){
        return camps[i].getCoordinates();
    };

    this.getBubbleInfo = function(i, j){
        return {
            sources  : troops[i].getBubbleSrc(j),
            deletable: troops[i].getBubbleDeletable(j)
        };
    };

    this.moveBubble = function(i, j){
        troops[i].setBubbleSrc(j);
    };

    this.deleteBubble = function(i, j){
        troops[i].delBubble(j);

        var indexDest = troops[i].getIndexDest();
        if (troops[i].getColor() === camps[indexDest].getColor()){
            merge(troops[i].getIndexSrc(), 1, troops[i].getIndexDest());
        }
        else {
            attack(troops[i].getIndexSrc(), 1, troops[i].getIndexDest());
        }
    };

    this.getTroopsLength = function(){
        return troops.length;
    };

    this.getTroopLength = function(i){
      return troops[i].getBubblesLength();
    };

    this.getWin = function(){
          return isWin;
    };

    this.move = function (s, d){

        var destinationCoords = camps[d].getCoordinates();

        var t = camps[s].dividePopulation();
        console.log(t);
        if (t > 50){
            t = 50;
        }

        troops.push(new Bubblebattle.Troop(color,t,camps[s].getCoordinates(),s ,d));

        for (var i=0; i<troops[troops.length-1].getBubblesLength(); i++){
            troops[troops.length-1].createBubble(i, destinationCoords.x, destinationCoords.y);
        }
    };

    this.moveEnnemy = function (s, d){

        var destinationCoords = camps[d].getCoordinates();

        var t = camps[s].dividePopulation();
        console.log(t);
        if (t > 50){
            t = 50;
        }

        troops.push(new Bubblebattle.Troop(opponent_color,t,camps[s].getCoordinates(),s ,d));

        for (var i=0; i<troops[troops.length-1].getBubblesLength(); i++){
            troops[troops.length-1].createBubble(i, destinationCoords.x, destinationCoords.y);
        }
    };

    init(m, c, oc);
};