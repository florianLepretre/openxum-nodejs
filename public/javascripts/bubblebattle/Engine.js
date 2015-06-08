"use strict"

// Constants
Bubblebattle.campSize = 50;
Bubblebattle.bubbleSpeed = 2; // pixel / frame rate
Bubblebattle.growSpeed = 0.2;

Bubblebattle.Bubble = function(c, x, y){
// private attributes
    var color;
    var srcX, srcY;
    var destX, destY;
    var speedX, speedY;
    var deletable ;
    var rap = destY/destX;

// private methods
    var init = function (c, x, y) {
        color = c;
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
            speedX = (distX/z) * Bubblebattle.bubbleSpeed * -1;
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

    this.getColor= function(){
      return color;
    };

    this.getSrc = function(){
        return({srcX: srcX, srcY: srcY});
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

    init(c , x ,y);
};

Bubblebattle.Troop = function (c, n, coords){
// private attributes
    var bubbles = [];

// private methods
    var init = function (c, n, coords) {
        for (var i=0; i< n; ++i){
            bubbles.push(new Bubblebattle.Bubble(c, coords.x , coords.y));
        }
    };

// public methods
    this.createBubble = function (i, x, y) {
        bubbles[i].createBubble(x, y);
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

    init(c, n, coords);
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
        mode = m;
        color = (c == 1) ? 'blue': 'red';
        opponent_color = (oc == 1) ? 'blue':'red';

        // Set players camps
        camps[0] = new Bubblebattle.Camp('blue', 512, 178);
        camps[1] = new Bubblebattle.Camp('red', 200, 486);

        // Set ohter camps neutral
        camps[2] = new Bubblebattle.Camp('none', 270, 124);
        camps[3] = new Bubblebattle.Camp('none', 104, 290);
        camps[4] = new Bubblebattle.Camp('none', 500, 444);


        var growing = setInterval(function(){
            for (var i=0; i<camps.length; i++){
                if (camps[i].getColor() !== 'none'){
                    camps[i].grow();
                }
            }
        }, 50);
    };

    var attack = function (s, t, d) {
        console.log('attack',s,t,d);
        camps[d].deletePopulation(t);
        if (camps[d].getPopulation() <= 0){
            camps[d].setColor(camps[s].getColor());
            if(checkWin()){
                console.log('Joueur ' + color + ' a gagné !');
            }
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
            sources : troops[i].getBubbleSrc(j),
            speed   : troops[i].getBubbleSpeed(j),
            dest    : troops[i].getBubbleDest(j)
        };
    };

    this.moveBubble = function(i, j){
        troops[i].setBubbleSrc(j);
    };

    this.getTroopsLength = function(){
        // All the troops
        return troops.length;
    };

    this.getTroopLength = function(i){
      return troops[i].getBubblesLength();
    };

    this.move = function (s, d){

        var destinationCoords = camps[d].getCoordinates();

        var t = camps[s].dividePopulation();
        if (t > 50){
            // Tout doux
            t = 50;
        }

        troops.push(new Bubblebattle.Troop(color,t,camps[s].getCoordinates()));

        console.log(troops[troops.length-1].getBubblesLength());

        for (var i=0; i<troops[troops.length-1].getBubblesLength(); i++){
            troops[troops.length-1].createBubble(i, destinationCoords.x, destinationCoords.y);
        }

        /*if (camps[s].getColor() == camps[d].getColor()){
            merge(s, t, d);
        }
        else {
            attack(s, t, d);
        }*/
    };

    init(m, c, oc);
};