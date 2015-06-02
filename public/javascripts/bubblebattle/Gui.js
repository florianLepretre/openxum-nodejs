"use strict";

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

// private methods

    var onClick = function(e){
        var click = getClickPosition(e);
        alert(click.x + '   ' + click.y);
    }

    var getClickPosition = function (e) {
        var rect = canvas.getBoundingClientRect();
        return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
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
        if (fill) {
            context.fill();
        }
        if (stroke) {
            context.stroke();
        }
    };

    var init = function () {
        
    };

// public methods
    this.color = function () {
        return _color;
    };

    this.draw = function () {
        // Draw background
        context.strokeStyle = "#000000";
        context.fillStyle = "#eeeeee";
        roundRect(0, 0, canvas.width, canvas.height, 17, true, true);


        context.beginPath();
        context.arc(50,50,20,0,Math.PI*2,false);
        context.closePath();
        context.fillStyle = 'blue';
        context.fill();
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

    init();
};

