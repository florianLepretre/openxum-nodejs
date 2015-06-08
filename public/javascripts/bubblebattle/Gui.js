"use strict";

Bubblebattle.blue = 'rgb(34, 167, 240)';
Bubblebattle.red = 'rgb(242, 38, 19)';
Bubblebattle.grey = 'rgb(200, 200, 200)';
Bubblebattle.lightBlue = 'rgba(34, 167, 240, 0.2)';
Bubblebattle.lightRed = 'rgba(242, 38, 19, 0.2)';
Bubblebattle.lightGrey = 'rgba(200, 200, 200, 0.2)';
Bubblebattle.border = 'rgba(255, 255, 102, 0.75)'

Bubblebattle.bubbleSize = 4.2;

Bubblebattle.Gui = function (c, e, l, g) {
// private attributes
    var that = this;
    var _engine = e;
    var _color = c;
    var _gui = g;

    var canvas;
    var context;
    var width;
    var height;

    var map, camp0, camp1, sheep;

    var scaleX;
    var scaleY;

    var opponentPresent = l;

    var hCamp;
    var waitingCamp = null;
    var waitingClick = false;

// private methods
    var onClick = function(e){
        var click = getClickPosition(e);
        var camp = getClickedCamp(click);
        var myColor = (_color == 1)?'blue':'red';

        if (waitingClick){
            if ((camp || camp === 0) && (camp != waitingCamp)) {
                _engine.move(waitingCamp, camp);
            }
            waitingClick = false;
        }
        else if ((camp || camp === 0) && (_engine.getCampColor(camp) == myColor)){
            waitingCamp = camp;
            waitingClick = true;
        }
        else {
            waitingClick = false;
        }
    };

    var onMove = function(e){
        var cursor = getClickPosition(e);
        hCamp = getClickedCamp(cursor);
    };

    var getClickedCamp = function(click){
        // Detect if a camp is clicked, and return it
        for (var i=0; i<_engine.getCampsLength(); i++){
            var size = _engine.getCampSize(i);
            var coords = _engine.getCampCoordinates(i);

            if (click.x >= coords.x-size && click.x <= coords.x + size
                && click.y >= coords.y-size && click.y <= coords.y + size){
                return i;
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

    var init = function () {
        map   = new Image();
        camp0 = new Image();
        camp1 = new Image();
        sheep = new Image();
        map.src   = '../../../images/bubblebattle/map.png';
        camp0.src = '../../../images/bubblebattle/camp0.png';
        camp1.src = '../../../images/bubblebattle/camp1.png';
        sheep.src = '../../../images/bubblebattle/sheep.png';
    };

    var highlight_camps = function () {
        if (hCamp || hCamp === 0){
            var coords = _engine.getCampCoordinates(hCamp);
            var size = _engine.getCampSize(hCamp);
            context.strokeStyle = Bubblebattle.border;
            context.strokeRect(coords.x-size, coords.y-size, 100, 60);
        }
    };

    var draw_moves = function() {
        for (var i=0 ; i< _engine.getTroopsLength();  i++){
            for (var j=0; j<_engine.getTroopLength(i); j++){
                var infos = _engine.getBubbleInfo(i, j);
                context.drawImage(sheep, infos.sources.srcX, infos.sources.srcY);
                _engine.moveBubble(i, j);
            }
        }
    };

    var draw_camps = function () {
        // Draw each camps
        for (var i=0; i<_engine.getCampsLength(); i++){
            var size = _engine.getCampSize(i);
            var coordinates = _engine.getCampCoordinates(i);
            var color = _engine.getCampColor(i);

            if (color == 'blue' || color == 'red'){
                context.drawImage(camp1, coordinates.x-size, coordinates.y-size);
            }
            else{
                context.drawImage(camp0, coordinates.x-size, coordinates.y-size);
            }

            draw_population(i, color, coordinates.x, coordinates.y, size);
        }
    };

    var draw_population = function (i, c, x, y, s) {
        var population = parseInt(_engine.getCampPopulation(i));

        if (c != 'none'){
            switch (population){
                case 0:
                    break;
                case 1:
                    context.drawImage(sheep, x, y);
                    break;
                case 2:
                    context.drawImage(sheep, x-30, y-20);
                    context.drawImage(sheep, x, y);
                    break;
                case 3:
                    context.drawImage(sheep, x-30, y-20);
                    context.drawImage(sheep, x+10, y-20);
                    context.drawImage(sheep, x, y);
                    break;
                case 4:
                    context.drawImage(sheep, x-30, y-20);
                    context.drawImage(sheep, x+10, y-20);
                    context.drawImage(sheep, x-20, y-10);
                    context.drawImage(sheep, x, y);
                    break;
                case 5:
                    context.drawImage(sheep, x-30, y-20);
                    context.drawImage(sheep, x+10, y-20);
                    context.drawImage(sheep, x-20, y-10);
                    context.drawImage(sheep, x, y);
                    context.drawImage(sheep, x-32, y+2);
                    break;
                case 6:
                    context.drawImage(sheep, x-30, y-20);
                    context.drawImage(sheep, x+10, y-20);
                    context.drawImage(sheep, x-10, y-18);
                    context.drawImage(sheep, x-20, y-10);
                    context.drawImage(sheep, x, y);
                    context.drawImage(sheep, x-32, y+2);
                    break;
                case 7:
                    context.drawImage(sheep, x-30, y-20);
                    context.drawImage(sheep, x+10, y-20);
                    context.drawImage(sheep, x-10, y-18);
                    context.drawImage(sheep, x-20, y-10);
                    context.drawImage(sheep, x+12, y-8);
                    context.drawImage(sheep, x, y);
                    context.drawImage(sheep, x-32, y+2);
                    break;
                case 8:
                    context.drawImage(sheep, x-30, y-20);
                    context.drawImage(sheep, x+10, y-20);
                    context.drawImage(sheep, x-10, y-18);
                    context.drawImage(sheep, x-20, y-10);
                    context.drawImage(sheep, x+12, y-8);
                    context.drawImage(sheep, x, y);
                    context.drawImage(sheep, x-14, y);
                    context.drawImage(sheep, x-32, y+2);
                    break;
                case 9:
                    context.drawImage(sheep, x-30, y-20);
                    context.drawImage(sheep, x+10, y-20);
                    context.drawImage(sheep, x-10, y-18);
                    context.drawImage(sheep, x-20, y-10);
                    context.drawImage(sheep, x+12, y-8);
                    context.drawImage(sheep, x-5, y-8);
                    context.drawImage(sheep, x, y);
                    context.drawImage(sheep, x-14, y);
                    context.drawImage(sheep, x-32, y+2);
                    break;
                default:
                    context.drawImage(sheep, x-30, y-20);
                    context.drawImage(sheep, x+10, y-20);
                    context.drawImage(sheep, x-10, y-18);
                    context.drawImage(sheep, x-20, y-10);
                    context.drawImage(sheep, x+12, y-8);
                    context.drawImage(sheep, x-5, y-8);
                    context.drawImage(sheep, x, y);
                    context.drawImage(sheep, x-14, y);
                    context.drawImage(sheep, x-32, y+2);
                    context.drawImage(sheep, x+12, y+3);
                    break;
            }
        }

        var myColor = (_color == 1)?'blue':'red';

        if (c === myColor || c === 'none') {
            var rgb = convertColor(c).c;
            context.strokeStyle = rgb;

            if (population < 10){
                context.strokeText(population, x, y+s+10);
                context.fillText(population, x, y+s+10);
            } else if (population < 100){
                context.strokeText(population, x-4, y+s+10);
                context.fillText(population, x-4, y+s+10);
            } else {
                context.strokeText(population, x-8, y+s+10);
                context.fillText(population, x-8, y+s+10);
            }
        }
    };

// public methods
    this.color = function () {
        return _color;
    };

    this.draw = function () {
        context.clearRect(0,0,canvas.width, canvas.height);

        context.drawImage(map, 0, 0);

        draw_camps();
        draw_moves();

        highlight_camps();
    };

    this.engine = function () {
        return _engine;
    };

    this.set_canvas = function (c) {
        canvas = c;
        context = c.getContext("2d");
        height = canvas.height;
        width = canvas.width;

        context.font="700 18px Arial";
        context.fillStyle = '#fff';
        context.lineWidth = 5;

        scaleX = width / canvas.offsetWidth;
        scaleY = height / canvas.offsetHeight;

        canvas.addEventListener("click", onClick);
        canvas.addEventListener("mousemove", onMove);

        this.draw();

        var refresh = setInterval(function(){
            that.draw();
        }, 50);
    };

    this.getWaitingCamp = function() {
        return waitingCamp;
    };

    this.isWaitingClick = function (){
        return waitingClick;
    };

    init();
};

