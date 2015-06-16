"use strict";

OpenXum.RealTimeGamePage = function (namespace, n, fc, c, oc, gt, gi, m, u, oi, opi, r) {
// private attributes
    var canvas;
    var canvas_div;
    var engine;
    var gui;
    var manager;
    var opponent;
    var realTimePlayer;

// private methods

    var build_canvas = function () {
        var row = $('<div/>', { class: 'row' });
        var col = $('<div>', { class: 'col-md-12', id: 'boardDiv' });

        $('<canvas/>', {
            id: 'board',
            style: 'width: 600px; height: 600px; padding-left: 0; padding-right: 0; margin-left: auto; margin-right: auto; display: block; box-shadow: 8px 8px 2px #aaa;'
        }).appendTo(col);
        col.appendTo(row);
        row.appendTo($('#main'));
    };

    var build_engine = function (namespace, mode, color, opponent_color) {
        engine = new namespace.Engine(mode, color, opponent_color);
    };

    var build_gui = function (namespace, color, game_id , r) {
        gui = new namespace.Gui(color, engine, game_id === '-1', opponent === gui, r);
    };

    var build_realTimePlayer = function(opponent_color,engine,owner_id,opponent_id,game_id){
        realTimePlayer = new namespace.RealTimePlayer(opponent_color,engine,owner_id,opponent_id,game_id,gui);
    };

    var build_manager = function (namespace) {
        manager = new namespace.Manager(engine, gui, opponent, new OpenXum.Status(document.getElementById("status")));
    };

    var build_winner_modal = function () {
        var modal = $('<div/>', {
            class: 'modal fade',
            id: 'winnerModal',
            tabindex: '-1',
            role: 'dialog',
            'aria-labelledby': 'winnerModalLabel',
            'aria-hidden': 'true'
        });
        var modalDialog = $('<div/>', { class: 'modal-dialog'});
        var modalContent = $('<div/>', { class: 'modal-content'});
        var button = $('<button/>', { class: 'close', 'data-dismiss': 'modal' });
        var modalBody = $('<div/>', { class: 'modal-body', id: 'winnerBodyText' });
        var modalFooter = $('<div/>', { class: 'modal-footer'});

        $('<a/>', {
            class: 'btn btn-primary new-game-button',
            href: '#',
            html: 'New game'}).appendTo($('<div/>', { class: 'btn-group' }).appendTo(modalFooter));
        modalBody.appendTo(modalContent);
        modalFooter.appendTo(modalContent);
        modalContent.appendTo(modalDialog);
        modalDialog.appendTo(modal);
        modal.appendTo($('#main'));
    };

    var set_gui = function () {
        canvas = document.getElementById("board");
        canvas_div = document.getElementById("boardDiv");
        if (canvas_div.clientHeight < canvas_div.clientWidth) {
            canvas.height = canvas_div.clientHeight;
            canvas.width = canvas_div.clientHeight;
        } else {
            canvas.height = canvas_div.clientWidth;
            canvas.width = canvas_div.clientWidth;
        }
        gui.set_canvas(canvas);
    };

    var init = function (namespace, name, first_color, color, opponent_color, game_type, game_id, mode, username, owner_id, opponent_id, replay) {
        build_winner_modal();

        $('<br/>').appendTo($('#main'));

        build_canvas();

        $('#winnerModal .new-game-button').click(function () {
            $('#winnerModal').modal('hide');
            window.location.href = '/games';
        });
        console.log(color , opponent_color);
        build_engine(namespace, mode, color, opponent_color);

        build_realTimePlayer(opponent_color,engine,owner_id,opponent_id,game_id);

        build_gui(namespace, color, game_id, realTimePlayer);

        set_gui();
    };

    init(namespace, n, fc, c, oc, gt, gi, m, u, oi, opi, r);
};