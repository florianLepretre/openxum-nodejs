"use strict";

Battlesheep.RealTimePlayer = function (c, e, u, o, g) {
// private attributes
    var _that = this;
    var _color = c;
    var _uid = u;
    var _gameID = g;
    var _opponentID = o;
    var _connection;
    var _engine = e;
    var finish = false;

// private methods
    var init = function () {
        _connection = new WebSocket('ws://127.0.0.1:3000');

        _connection.onopen = function () {

        };

        _connection.onerror = function (error) {

        };

        _connection.onmessage = function (message) {
            var msg = JSON.parse(message.data);
            var move;

            // Messages received
            if (msg.type === 'start') {
                console.log('Ready !');
                _that.begin();
            }
            else if (msg.type === 'ack') {
                _engine.move(msg.waitingCamp,msg.camp, msg.troop);
            }
            else if(msg.type === 'moveRT'){
                _engine.moveEnnemy(msg.waitingCamp,msg.camp, msg.troop);
            }
            else if(msg.type === 'state'){
                _engine.setState(msg);
            }
            else if(msg.type === 'ackdel'){
                if( !finish){
                    _engine.deleteBubble(msg.troop_id , msg.bulle_id);
                }
            }
            else if(msg.type === 'finishRT'){
                finish = true;
                $('#winnerBodyText').html('<h4>The winner is '+ msg._uid +'</h4>');
                $("#winnerModal").modal("show");
            }
        };


        var loop = setInterval(function () {
            if (_connection.readyState !== 1) {
                console.log('error connection');
            } else {
                console.log('connecting ' + _uid + ' ...');

                var msg = {
                    type: 'playRT',
                    user_id: _uid,
                    opponent_id: _opponentID,
                    game_id: _gameID,
                    game_type: 'battlesheep'
                };
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

    this.begin = function(){
        var msg = {
            type : 'begin',
            user_id : _uid,
            opp_id : _opponentID
        };
        _connection.send(JSON.stringify(msg));
    };

    this.finish = function () {
        finish = true;
        var msg = {
            type: 'finishRT',
            user_id: _uid,
            opp_id : _opponentID,
            moves: null
        };
        $('#winnerBodyText').html('<h4>The winner is ' + _uid + ' </h4>');
        $("#winnerModal").modal("show");
        _connection.send(JSON.stringify(msg));
    };

    this.is_ready = function () {
        return true;
    };

    this.get_name = function () {
        return 'battlesheep' ;
    };

    this.that = function (t) {
        _that = t;
    };

    this.move = function(waitingCamp, camp){
        var msg = {
            type        : 'moveRT',
            user_id     : _uid,
            opp_id      : _opponentID,
            waitingCamp : waitingCamp,
            camp        : camp
        };
        _connection.send(JSON.stringify(msg));
    };

    this.ACK = function(waitingCamp, camp){

        var population = _engine.getCampPopulation(waitingCamp);
        var t = parseInt(population /2);

        var msg = {
            type        : 'ack',
            user_id     : _uid,
            opp_id      : _opponentID,
            waitingCamp : waitingCamp,
            camp        : camp,
            troop       : t
        };

        if( !finish){
            _connection.send(JSON.stringify(msg));
        }

    };

    this.ACKDelete = function(i , j){
        var id_dest = _engine.getTroopDest(i);
        var color = _engine.getTroopColor(i);
        var msg = {
            type        : 'ackdelete',
            user_id     : _uid,
            opp_id      : _opponentID,
            bulle_id    :  j,
            troop_id    :  i,
            camp_id     : id_dest,
            color       : color
        };

        if (! finish){
            _connection.send(JSON.stringify(msg));
        }

    };

    this.engine = function () {
        return _engine;
    };

    init();

};