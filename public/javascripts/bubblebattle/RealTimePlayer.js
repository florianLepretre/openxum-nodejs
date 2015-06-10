"use strict";

Bubblebattle.RealTimePlayer = function (c, e, u, o, g) {
// private attributes
    var _that;
    var _color = c;
    var _uid = u;
    var _gameID = g;
    var _opponentID = o;
    var _connection;
    var _engine = e;

// private methods
    var init = function () {
        _connection = new WebSocket('ws://192.168.22.176:3000');

        _connection.onopen = function () {

        };

        _connection.onerror = function (error) {

        };

        _connection.onmessage = function (message) {
            var msg = JSON.parse(message.data);
            var move;

            // Messages received
            if (msg.type === 'start') {
                console.log('ready !!!!');
            }
            if(msg.type === 'move'){
                _engine.moveEnnemy(msg.waitingCamp,msg.camp);
            }
            if(msg.type === 'finish'){
                $('#winnerBodyText').html('<h4>The winner is !</h4>');
                $("#winnerModal").modal("show");
            }
        };


        var loop = setInterval(function () {
            if (_connection.readyState !== 1) {
                console.log('error connection');
            } else {
                console.log('connecting ' + _uid + ' ...');

                var msg = {
                    type: 'play',
                    user_id: _uid,
                    opponent_id: _opponentID,
                    game_id: _gameID,
                    game_type: 'bubblebattle'
                };
                console.log('user'+_uid+" "+ _opponentID);
                _connection.send(JSON.stringify(msg));
                clearInterval(loop);
            }
        }, 1000);
    };

// public methods
    this.color = function () {
        return _color;
    };

    this.confirm = function () {
        return false;
    };

    this.finish = function () {
        var msg = {
            type: 'finish',
            user_id: _uid,
            opp_id : _opponentID,
            moves: null
        };
        $('#winnerBodyText').html('<h4>The winner is !</h4>');
        $("#winnerModal").modal("show");
        console.log('envoie');
        _connection.send(JSON.stringify(msg));
    };

    this.is_ready = function () {
        return true;
    };

    this.get_name = function () {
        return 'bubblebattle' ;
    };

    this.that = function (t) {
        _that = t;
    };

    this.move = function(waitingCamp, camp){
        var msg = {
            type        : 'move',
            user_id     : _uid,
            opp_id      : _opponentID,
            waitingCamp : waitingCamp,
            camp        : camp
        };

        console.log('envoie move');
        _connection.send(JSON.stringify(msg));
    };

    this.engine = function () {
        return _engine;
    };

    init();

};
