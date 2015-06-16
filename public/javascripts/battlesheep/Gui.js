"use strict";

// Constants
Battlesheep.blue = 'rgb(34, 167, 240)';
Battlesheep.red = 'rgb(242, 38, 19)';
Battlesheep.grey = 'rgb(180, 180, 180)';
Battlesheep.border = 'rgba(255, 255, 102, 0.75)'

//////////////////////////
//   Class: Gui
//////////////////////////

Battlesheep.Gui = function (c, e, l, g, r ) {
// private attributes
    var that = this;
    var _engine = e;
    var _color = c;
    var _gui = g;
    var _realTimePlayer = r;
    var canvas;
    var context;
    var width;
    var height;
    var scaleX;
    var scaleY;
    var opponentPresent = l;

    // images
    var map, camp0, camp1, sheep, chicken, sheep_sprite, chicken_sprite, smoke_sprite;

    // audio
    var sheep_sound, chicken_sound, lose_sound, ambiance_sound;

    var myColor;
    var winFlag = false;
    var hCamp;
    var waitingCamp = null;
    var waitingClick = false;

// private methods
    var init = function () {
        map   = new Image();
        camp0 = new Image();
        camp1 = new Image();
        sheep = new Image();
        chicken = new Image();
        sheep_sprite = new Image();
        chicken_sprite = new Image();
        smoke_sprite = new Image();
        map.src   = '../../../images/battlesheep/map.png';
        camp0.src = '../../../images/battlesheep/camp0.png';
        camp1.src = '../../../images/battlesheep/camp1.png';
        sheep.src = '../../../images/battlesheep/sheep_solo.png';
        chicken.src = '../../../images/battlesheep/chicken_solo.png';
        sheep_sprite.src = '../../../images/battlesheep/sheep.png';
        chicken_sprite.src = '../../../images/battlesheep/chicken.png';
        smoke_sprite.src = '../../../images/battlesheep/smoke.png';

        sheep_sound = document.createElement('audio');
        sheep_sound.setAttribute('src', '../../../javascripts/battlesheep/sounds/sheep.mp3');

        chicken_sound = document.createElement('audio');
        chicken_sound.setAttribute('src', '../../../javascripts/battlesheep/sounds/chicken.mp3');

        lose_sound = document.createElement('audio');
        lose_sound.setAttribute('src', '../../../javascripts/battlesheep/sounds/lose.mp3');

        ambiance_sound = document.createElement('audio');
        ambiance_sound.setAttribute('src', '../../../javascripts/battlesheep/sounds/ambiance.mp3');
        ambiance_sound.setAttribute('loop', 'loop');
        ambiance_sound.play();
    };

    var getClickPosition = function (e) {
        var rect = canvas.getBoundingClientRect();
        return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    };

    var onClick = function(e){
        var click = getClickPosition(e);
        var camp = getClickedCamp(click);

        if (waitingClick){
            if ((camp || camp === 0) && (camp != waitingCamp)) {
                _realTimePlayer.ACK(waitingCamp, camp);
                if (_engine.getCampColor(waitingCamp) === 'blue') {
                    sheep_sound.play();
                }
                else {
                    chicken_sound.play();
                }
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
        // Detect if a camp is clicked, then return it
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

    var convertColor = function(color){
        // Get rgb from color attribute
        if (color === 'blue'){
            return Battlesheep.blue;
        }
        if (color === 'red'){
            return Battlesheep.red;
        }
        return Battlesheep.grey;
    };

    var highlight_camp = function () {
        // Highlight a camp
        if (hCamp || hCamp === 0){
            var coords = _engine.getCampCoordinates(hCamp);
            var size = _engine.getCampSize(hCamp);
            context.strokeStyle = Battlesheep.border;
            context.strokeRect(coords.x-size, coords.y-size, 100, 60);
        }
    };

    var draw_camps = function () {
        // Draw each camps
        for (var i=0; i<_engine.getCampsLength(); i++){
            var size = _engine.getCampSize(i);
            var coordinates = _engine.getCampCoordinates(i);
            var color = _engine.getCampColor(i);

            if (color == 'blue' || color == 'red'){
                context.drawImage(camp1, coordinates.x-size, coordinates.y-size);
            }
            else{
                context.drawImage(camp0, coordinates.x-size, coordinates.y-size);
            }

            draw_population(i, color, coordinates.x, coordinates.y, size);

            if (_engine.isCampAttacked(i)){
                context.drawImage(smoke_sprite, _engine.getCampFrame(i)*96, 0, 96, 94, coordinates.x-size, coordinates.y-size, 96, 94);
                _engine.newCampFrame(i);
            }
        }
    };

    var draw_population = function (i, c, x, y, s) {
        var population = parseInt(_engine.getCampPopulation(i));

        if (c == 'blue'){
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
        else if (c == 'red'){
            switch (population){
                case 0:
                    break;
                case 1:
                    context.drawImage(chicken, x, y);
                    break;
                case 2:
                    context.drawImage(chicken, x-30, y-20);
                    context.drawImage(chicken, x, y);
                    break;
                case 3:
                    context.drawImage(chicken, x-30, y-20);
                    context.drawImage(chicken, x+10, y-20);
                    context.drawImage(chicken, x, y);
                    break;
                case 4:
                    context.drawImage(chicken, x-30, y-20);
                    context.drawImage(chicken, x+10, y-20);
                    context.drawImage(chicken, x-20, y-10);
                    context.drawImage(chicken, x, y);
                    break;
                case 5:
                    context.drawImage(chicken, x-30, y-20);
                    context.drawImage(chicken, x+10, y-20);
                    context.drawImage(chicken, x-20, y-10);
                    context.drawImage(chicken, x, y);
                    context.drawImage(chicken, x-32, y+2);
                    break;
                case 6:
                    context.drawImage(chicken, x-30, y-20);
                    context.drawImage(chicken, x+10, y-20);
                    context.drawImage(chicken, x-10, y-18);
                    context.drawImage(chicken, x-20, y-10);
                    context.drawImage(chicken, x, y);
                    context.drawImage(chicken, x-32, y+2);
                    break;
                case 7:
                    context.drawImage(chicken, x-30, y-20);
                    context.drawImage(chicken, x+10, y-20);
                    context.drawImage(chicken, x-10, y-18);
                    context.drawImage(chicken, x-20, y-10);
                    context.drawImage(chicken, x+12, y-8);
                    context.drawImage(chicken, x, y);
                    context.drawImage(chicken, x-32, y+2);
                    break;
                case 8:
                    context.drawImage(chicken, x-30, y-20);
                    context.drawImage(chicken, x+10, y-20);
                    context.drawImage(chicken, x-10, y-18);
                    context.drawImage(chicken, x-20, y-10);
                    context.drawImage(chicken, x+12, y-8);
                    context.drawImage(chicken, x, y);
                    context.drawImage(chicken, x-14, y);
                    context.drawImage(chicken, x-32, y+2);
                    break;
                case 9:
                    context.drawImage(chicken, x-30, y-20);
                    context.drawImage(chicken, x+10, y-20);
                    context.drawImage(chicken, x-10, y-18);
                    context.drawImage(chicken, x-20, y-10);
                    context.drawImage(chicken, x+12, y-8);
                    context.drawImage(chicken, x-5, y-8);
                    context.drawImage(chicken, x, y);
                    context.drawImage(chicken, x-14, y);
                    context.drawImage(chicken, x-32, y+2);
                    break;
                default:
                    context.drawImage(chicken, x-30, y-20);
                    context.drawImage(chicken, x+10, y-20);
                    context.drawImage(chicken, x-10, y-18);
                    context.drawImage(chicken, x-20, y-10);
                    context.drawImage(chicken, x+12, y-8);
                    context.drawImage(chicken, x-5, y-8);
                    context.drawImage(chicken, x, y);
                    context.drawImage(chicken, x-14, y);
                    context.drawImage(chicken, x-32, y+2);
                    context.drawImage(chicken, x+12, y+3);
                    break;
            }
        }

        // Don't show ennemy population
        if (c === myColor || c === 'none') {
            context.strokeStyle = convertColor(c);

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

    var draw_moves = function() {
        // Draw moving troops
        for (var i=0 ; i< _engine.getTroopsLength();  i++) {

            var troop = _engine.getTroopInfo(i);
            var frame = _engine.getTroopFrame(i);

            _engine.newTroopFrame(i);

            for (var j = 0; j < _engine.getTroopLength(i); j++) {

                _engine.moveTroop(i, j);

                var sheep = _engine.getSheepInfo(i, j);

                if (troop.color == 'blue') {
                    context.drawImage(sheep_sprite, frame * 22, sheep.orientation * 20, 22, 22,
                                      sheep.sources.srcX, sheep.sources.srcY, 22, 20);
                }
                else {
                    context.drawImage(chicken_sprite, frame * 22, sheep.orientation * 22, 22, 22,
                                      sheep.sources.srcX, sheep.sources.srcY, 22, 22);
                }

                if (sheep.deletable) {
                    if (_engine.getTroopLength(i) <= 1) {
                        _engine.setCampAttacked(_engine.getTroopDest(i), false);
                    }
                    else if ((_engine.getTroopLength(i) == _engine.getTroopPopulation(i))
                        && (_engine.getCampColor(troop.destination) != troop.color)) {
                        _engine.setCampAttacked(troop.destination, true);
                    }

                    if(troop.color === myColor){
                        _realTimePlayer.ACKDelete(i,j);
                    }

                    // Break if the troop is empty after deleting a sheep
                    if(_engine.deleteSheepFromTroop(i,j)){
                        i--; break;
                    }
                }
            }
        }
        if( _engine.getWin() && !winFlag){
            winFlag = true;
            _realTimePlayer.finish();
        }
    };

// public methods
    this.draw = function () {
        context.clearRect(0,0,canvas.width, canvas.height);

        draw_camps();
        draw_moves();

        highlight_camp();
    };

    this.set_canvas = function (c) {
        canvas = c;
        context = c.getContext("2d");
        height = canvas.height;
        width = canvas.width;
        myColor = (_color == 1)?'blue':'red';

        context.font="700 18px Arial";
        context.fillStyle = '#fff';
        context.lineWidth = 5;

        scaleX = width / canvas.offsetWidth;
        scaleY = height / canvas.offsetHeight;

        canvas.style.background = 'url(../../../images/battlesheep/map.png)';
        canvas.addEventListener("click", onClick);
        canvas.addEventListener("mousemove", onMove);

        var refresh = setInterval(function(){
            that.draw();
        }, 1000/20);
    };

    // getters
    this.engine = function () {
        return _engine;
    };

    this.color = function () {
        return _color;
    };

    init();
};

