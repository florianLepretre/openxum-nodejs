"use strict"

// Constant
Bubblebattle.growSpeed = 2;

Bubblebattle.Bubble = function(){
    var color;
};

Bubblebattle.Camp = function(c, x, y){
// private attributes
    var cornerX;
    var cornerY;
    var color;
    var size;
    var population;

// private methods
    var init = function (c, x, y) {
        cornerX = x;
        cornerY = y;
        color = c;
        size = 60;
        population = 0;
    };

// public methods
    this.getColor = function(){
        return color;
    };

    this.getPopulation = function(){
        return population;
    };

    this.getCoordinates = function(){
        return {cX: cornerX, cY: cornerY};
    };

    this.getSize = function(){
        return size;
    }

    init(c, x, y);
 };

Bubblebattle.Engine = function (m, c, oc){
//private attributes
    var mode;
    var color;
    var opponent_color;
    var camps = [];

// private methods
    var init = function(m, c, oc){
        mode = m;
        color = (c == 1) ? 'blue': 'red';
        opponent_color = (oc == 1) ? 'blue':'red';

        // Set players camps
        camps[0] = new Bubblebattle.Camp('blue', 10, 10);
        camps[1] = new Bubblebattle.Camp('red', 500, 500);

        // Set ohter camps neutral
        camps[2] = new Bubblebattle.Camp('none', 250, 250);
    };

// public methods
    this.getCampsLength = function (){
        return camps.length;
    };

    this.getCamp = function(i){
        return camps[i];
    };

    init(m, c, oc);
};