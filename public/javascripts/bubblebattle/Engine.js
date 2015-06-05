"use strict"

// Constants
Bubblebattle.growSpeed = 0.1;

Bubblebattle.Bubble = function(){
    var color;
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
        size = 30;
        population = (color === 'none') ? 15 : 5;
    };

// public methods
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
        return {cX: centerX, cY: centerY};
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
        camps[0] = new Bubblebattle.Camp('blue', 290, 60);
        camps[1] = new Bubblebattle.Camp('red', 290, 520);

        // Set ohter camps neutral
        camps[2] = new Bubblebattle.Camp('none', 110, 270);
        camps[3] = new Bubblebattle.Camp('none', 450, 270);


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

    this.getCamp = function(i){
        return camps[i];
    };

    this.move = function (source, destination){
        var s = camps.indexOf(source);
        var d = camps.indexOf(destination);

        var troops = camps[s].dividePopulation();
        console.log('Envoi de ' + troops + ' troupes, de ' + s + ' vers ' + d);

        if (camps[s].getColor() == camps[d].getColor()){
            merge(s, troops, d);
        }
        else {
            attack(s, troops, d);
        }
    };

    init(m, c, oc);
};