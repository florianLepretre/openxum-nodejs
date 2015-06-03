"use strict";

Bubblebattle.blue = 'rgb(34, 167, 240)';
Bubblebattle.red = 'rgb(242, 38, 19)';
Bubblebattle.grey = 'rgb(200, 200, 200)';
Bubblebattle.lightBlue = 'rgba(34, 167, 240, 0.1)';
Bubblebattle.lightRed = 'rgba(242, 38, 19, 0.1)';
Bubblebattle.lightGrey = 'rgba(200, 200, 200, 0.1)';

Bubblebattle.Gui = function (c, e, l, g) {
// private attributes
    var _engine = e;
    var _color = c;
    var _gui = g;

    var canvas;
    var context;
    var height;
    var width;

    var scaleX;
    var scaleY;

    var opponentPresent = l;

    var waitingCamp;
    var waitingClick = false;

// private methods
    var onClick = function(e){
        var click = getClickPosition(e);
        var camp = getClickedCamp(click);

        if (waitingClick){
            if (camp) {
                console.log('Route de ' + waitingCamp.getColor() + ' vers ' + camp.getColor());
            }
            waitingClick = false;
        }
        else if (camp){
            waitingCamp = camp;
            console.log('Clic sur ' + camp.getColor());
            waitingClick = true;
        }
        else {
            waitingClick = false;
        }
    };

    var getClickedCamp = function(click){
        // Detect if a camp is clicked, and return it
        for (var i=0; i<_engine.getCampsLength(); i++){
            var camp = _engine.getCamp(i);
            var size = camp.getSize();
            var coords = camp.getCoordinates();

            if (click.x >= coords.cX && click.x <= coords.cX + size
                && click.y >= coords.cY && click.y <= coords.cY + size){
                return camp;
            }
        }

        return false;
    };

    var getClickPosition = function (e) {
        var rect = canvas.getBoundingClientRect();
        return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    };

    var convertColor = function(color){
        if (color === 'blue'){
            return {c: Bubblebattle.blue, lc: Bubblebattle.lightBlue};
        }
        if (color === 'red'){
            return {c: Bubblebattle.red, lc: Bubblebattle.lightRed};
        }
        return {c: Bubblebattle.grey, lc: Bubblebattle.lightGrey};
    };

    var roundRect = function (x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === "undefined") {
            stroke = true;
        }
        if (typeof radius === "undefined") {
            radius = 5;
        }
        context.beginPath();
        context.moveTo(x + radius, y);
        context.lineTo(x + width - radius, y);
        context.quadraticCurveTo(x + width, y, x + width, y + radius);
        context.lineTo(x + width, y + height - radius);
        context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        context.lineTo(x + radius, y + height);
        context.quadraticCurveTo(x, y + height, x, y + height - radius);
        context.lineTo(x, y + radius);
        context.quadraticCurveTo(x, y, x + radius, y);
        context.closePath();
        if (stroke) {
            context.stroke();
        }
        if (fill) {
            context.fill();
        }
    };

    var init = function () {
        
    };

    var draw_camps = function () {
        context.lineWidth = 1;

        // Draw each camps
        for (var i=0; i<_engine.getCampsLength(); i++){
            var camp = _engine.getCamp(i);
            var size = camp.getSize();
            var coordinates = camp.getCoordinates();
            var color = convertColor(camp.getColor());

            context.strokeStyle = color.c;
            context.fillStyle = color.lc;
            context.strokeRect(coordinates.cX, coordinates.cY, size, size);
            context.fillRect(coordinates.cX, coordinates.cY, size, size);
        }
    };

// public methods
    this.color = function () {
        return _color;
    };

    this.draw = function () {
        // Draw background
        context.strokeStyle = "rgba(0,0,0,0.25)";
        context.fillStyle = "#f3f3f3";
        roundRect(0, 0, canvas.width, canvas.height, 17, true, true);

        draw_camps();
    };

    this.engine = function () {
        return _engine;
    };

    this.set_canvas = function (c) {
        canvas = c;
        context = c.getContext("2d");
        height = canvas.height;
        width = canvas.width;

        scaleX = width / canvas.offsetWidth;
        scaleY = height / canvas.offsetHeight;

        canvas.addEventListener("click", onClick);

        this.draw();
    };

    this.getWaitingCamp = function() {
        return waitingCamp;
    };

    this.setWaitingCamp = function(c){
        waitingCamp = c;
    };

    this.isWaitingClick = function (){
        return waitingClick;
    };

    init();
};

