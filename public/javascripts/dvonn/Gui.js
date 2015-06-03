"use strict";

Dvonn.Gui = function (c, e, l, g) {
// private attributes
    var _engine = e;
    var _color = c;
    var _gui = g;

    var canvas;
    var context;
    var manager;
    var height;
    var width;

    var tolerance = 15;

    var delta_x;
    var delta_y;
    var delta_xy;
    var offset;

    var scaleX;
    var scaleY;

    var opponentPresent = l;

    var pointerX = -1;
    var pointerY = -1;

    var selected_color;
    var selected_coordinates;
    var selected_piece;

// public methods
    this.color = function () {
        return _color;
    };

    this.draw = function () {
        compute_deltas();


        // background
        context.strokeStyle = "#000000";
        context.fillStyle = "#ffffff";
        roundRect(0, 0, canvas.width, canvas.height, 17, true, true);

        // grid
        draw_grid();
        draw_coordinates();

        //state
        draw_state();

        //intersection
        show_intersection();

        if (_engine.phase() === Dvonn.Phase.MOVE_STACK && selected_piece && selected_piece.is_valid()) {
            draw_possible_moving();
         }
    };

    this.engine = function () {
        return _engine;
    };

    this.get_move = function () {
        var move = null;

        if (_engine.phase() === Dvonn.Phase.PUT_DVONN_PIECE) {
            move = new Dvonn.Move(Dvonn.Phase.PUT_DVONN_PIECE, _engine.current_color(), this.get_selected_coordinates());
        } else if (_engine.phase() === Dvonn.Phase.PUT_PIECE) {
            move = new Dvonn.Move(Dvonn.Phase.PUT_PIECE, _engine.current_color(), this.get_selected_coordinates());
        } else if (_engine.phase() === Dvonn.Phase.MOVE_STACK) {
            var e = _engine.clone();

            e.move_stack(this.get_selected_piece(), this.get_selected_coordinates());
            move = new Dvonn.Move(Dvonn.Phase.MOVE_STACK, _engine.current_color(), this.get_selected_piece(), this.get_selected_coordinates(), e.remove_isolated_stacks());
        }
        return move;
    };

    this.get_selected_coordinates = function () {
        return selected_coordinates;
    };

    this.get_selected_piece = function () {
        return selected_piece;
    };

    this.is_animate = function () {
        return false;
    };

    this.is_remote = function () {
        return false;
    };

    this.move = function (move, color) {
        manager.play();
    };

    this.ready = function (r) {
        opponentPresent = r;
        if (manager) {
            manager.redraw();
        }
    };

    this.set_canvas = function (c) {
        canvas = c;
        context = c.getContext("2d");
        height = canvas.height;
        width = canvas.width;

        scaleX = width / canvas.offsetWidth;
        scaleY = height / canvas.offsetHeight;

        canvas.addEventListener("click", onClick);
        canvas.addEventListener('mousemove', onMove, false);

        this.draw();
    };

    this.set_manager = function (m) {
        manager = m;
    };

    this.unselect = function() {
        selected_color = Dvonn.Color.NONE;
        selected_coordinates = null;
        selected_piece = null;
    };

// private methods
    var compute_coordinates = function (letter, number) {
        return [ offset + 1.5 * delta_x + (letter - 'A'.charCodeAt(0)) * delta_x - (number - 1) * 0.5 * delta_x,
            height / 2 + (number - 1) * delta_y - 2.5 * delta_y ];
    };

    var compute_deltas = function () {
        offset = 30;
        delta_x = (width - 2 * offset) / 11.0;
        delta_y = delta_x;
        delta_xy = delta_y / 2;
    };

    var compute_letter = function (x, y) {
        var _letter = 'X';
        var pt = compute_coordinates('A'.charCodeAt(0), 1);

        // translation to A1 and rotation
        var X = x - pt[0];
        var Y = y - pt[1];
        var cos_alpha = 1. / Math.sqrt(5);
        var sin_alpha = 2. * cos_alpha;

        var x2 = (X * sin_alpha + Y * cos_alpha);
        var delta_x2 = delta_x * sin_alpha;
        var index = Math.floor((x2 + tolerance) / delta_x2 + 1);

        if (index > 0 && index < 12) {
            var ref = (index - 1) * delta_x2 + tolerance;

            if (x2 < ref) {
                _letter = Dvonn.letters[index - 1];
            }
        }
        return _letter;
    };

    var compute_number = function (x, y) {
        var index = Math.floor(((y + tolerance) - height / 2 + 2.5 * delta_y) / delta_y) + 1;
        var _number = -1;

        if (index > 0 && index < 6) {
            var ref = height / 2 + (index - 1) * delta_y - 2.5 * delta_y + tolerance;

            if (y < ref) {
                _number = index;
            }
        }
        return _number;
    };

    var compute_pointer = function (x, y) {
        var change = false;
        var letter = compute_letter(x, y);

        if (letter != 'X') {
            var number = compute_number(x, y);

            if (number != -1) {
                if (_engine.exist_intersection(letter, number)) {
                    var pt = compute_coordinates(letter.charCodeAt(0), number);

                    pointerX = pt[0];
                    pointerY = pt[1];
                    change = true;
                } else {
                    pointerX = pointerY = -1;
                    change = true;
                }
            } else {
                if (pointerX != -1) {
                    pointerX = pointerY = -1;
                    change = true;
                }
            }
        } else {
            if (pointerX != -1) {
                pointerX = pointerY = -1;
                change = true;
            }
        }
        return change;
    };

    var draw_coordinates = function () {
        var pt;

        context.fillStyle = "#000000";
        context.font = "16px _sans";
        context.textBaseline = "bottom";
        // letters
        for (var l = 'A'.charCodeAt(0); l < 'L'.charCodeAt(0); ++l) {
            pt = compute_coordinates(l, Dvonn.begin_number[l - 'A'.charCodeAt(0)]);
            pt[0] += 5;
            pt[1] -= 5;

            context.fillText(String.fromCharCode(l), pt[0], pt[1]);
        }

        // numbers
        context.textBaseline = "bottom";
        for (var n = 1; n < 6; ++n) {
            pt = compute_coordinates(Dvonn.begin_letter[n - 1].charCodeAt(0), n);
            pt[0] -= 15 + (n > 3 ? 5 : 0);
            pt[1] -= 3;

            context.fillText(n.toString(), pt[0], pt[1]);
        }
    };

    var draw_grid = function () {
        var _pt_begin;
        var _pt_end;

        context.lineWidth = 1;
        context.strokeStyle = "#000000";
        for (var l = 'A'.charCodeAt(0); l < 'L'.charCodeAt(0); ++l) {
            var index = l - 'A'.charCodeAt(0);

            _pt_begin = compute_coordinates(l, Dvonn.begin_number[index]);
            _pt_end = compute_coordinates(l, Dvonn.end_number[index]);
            context.moveTo(_pt_begin[0], _pt_begin[1]);
            context.lineTo(_pt_end[0], _pt_end[1]);
        }

        for (var n = 1; n < 6; ++n) {
            _pt_begin = compute_coordinates(Dvonn.begin_letter[n - 1].charCodeAt(0), n);
            _pt_end = compute_coordinates(Dvonn.end_letter[n - 1].charCodeAt(0), n);
            context.moveTo(_pt_begin[0], _pt_begin[1]);
            context.lineTo(_pt_end[0], _pt_end[1]);
        }

        for (var i = 0; i < 11; ++i) {
            _pt_begin = compute_coordinates(Dvonn.begin_diagonal_letter[i].charCodeAt(0),
                Dvonn.begin_diagonal_number[i]);
            _pt_end = compute_coordinates(Dvonn.end_diagonal_letter[i].charCodeAt(0),
                Dvonn.end_diagonal_number[i]);
            context.moveTo(_pt_begin[0], _pt_begin[1]);
            context.lineTo(_pt_end[0], _pt_end[1]);
        }
        context.stroke();
    };

    var draw_piece = function (x, y, color, selected) {
        if (selected) {
            context.strokeStyle = "#00ff00";
            context.fillStyle = "#00ff00";
            context.lineWidth = delta_x / 5;
            context.beginPath();
            context.arc(x, y, delta_x * (1.0 / 3 - 1.0 / 10) - 1, 0.0, 2 * Math.PI);
            context.closePath();
            context.fill();
            context.stroke();
        } else {
            draw_ring(x, y, color);
        }
    };

    var draw_possible_moving = function() {
        var list = _engine.get_stack_possible_move(selected_piece);

        for (var index in list) {
            var coordinates = list[index];
            var pt = compute_coordinates(coordinates.letter().charCodeAt(0), coordinates.number());

            context.lineWidth = 1;
            context.strokeStyle = "#00ff00";
            context.fillStyle = "#00ff00";
            context.beginPath();
            context.arc(pt[0], pt[1], 5, 0.0, 2 * Math.PI);
            context.closePath();
            context.fill();
            context.stroke();
        }
    };

    var draw_ring = function (x, y, color) {
        context.beginPath();
        context.lineWidth = 1;
        context.strokeStyle = "#000000";
        context.arc(x, y, delta_x * (1.0 / 3 + 1.0 / 10), 0.0, 2 * Math.PI, false);
        context.stroke();
        context.arc(x, y, delta_x * (1.0 / 3 - 1.0 / 10) - 1, 0.0, 2 * Math.PI, false);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.lineWidth = delta_x / 5;

        if (color === Dvonn.Color.BLACK) {
            context.strokeStyle = "#000000";
        } else if (color === Dvonn.Color.WHITE) {
            context.strokeStyle = "#ffffff";
        } else {
            context.strokeStyle = "#ff0000";
        }

        context.arc(x, y, delta_x / 3, 0.0, 2 * Math.PI, false);
        context.stroke();
        context.closePath();
    };

    var draw_state = function () {
        for (var index in _engine.get_intersections()) {
            var intersection = _engine.get_intersections()[index];

            if (intersection.state() === Dvonn.State.NO_VACANT) {
                var pt = compute_coordinates(intersection.letter().charCodeAt(0), intersection.number());
                var n = intersection.size();

                draw_piece(pt[0], pt[1], intersection.color(), selected_piece && selected_piece.is_valid() && intersection.coordinates().hash() === selected_piece.hash());
                if (n > 1) {
                    var text;
                    var shift_x = 0;

                    context.font = "10px _sans";
                    context.textBaseline = "top";
                    if (intersection.color() === Dvonn.Color.WHITE) {
                        context.fillStyle = "#000000";
                    } else {
                        context.fillStyle = "#ffffff";
                    }
                    if (n < 10) {
                        text = n.toString();
                        shift_x = 3;
                    } else {
                        text = '1' + (n - 10).toString();
                        shift_x = 8;
                    }
                    context.fillText(text, pt[0] - shift_x, pt[1] - delta_y * (1.0 / 3 + 1.0 / 10));
                }
                if (n > 1 && intersection.dvonn()) {
                    var text = 'D';

                    context.font = "10px _sans";
                    context.textBaseline = "bottom";
                    if (intersection.color() === Dvonn.Color.WHITE) {
                        context.fillStyle = "#000000";
                    } else {
                        context.fillStyle = "#ffffff";
                    }
                    context.fillText(text, pt[0] - 3, pt[1] + delta_y * (1.0 / 3 + 1.0 / 10));
                }
            }
        }
    };

    var getClickPosition = function (e) {
        var rect = canvas.getBoundingClientRect();

        return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    };

    var init = function () {
        selected_color = Dvonn.Color.NONE;
        selected_coordinates = null;
        selected_piece = null;
    };

    var onClick = function (event) {
        if (_engine.current_color() === _color || _gui) {
            var pos = getClickPosition(event);
            var letter = compute_letter(pos.x, pos.y);

            if (letter !== 'X') {
                var number = compute_number(pos.x, pos.y);

                if (number !== -1) {
                    var ok = false;

                    if (_engine.phase() === Dvonn.Phase.PUT_DVONN_PIECE && _engine.get_intersection(letter, number).state() === Dvonn.State.VACANT) {
                        selected_coordinates = new Dvonn.Coordinates(letter, number);
                        ok = true;
                    } else if (_engine.phase() === Dvonn.Phase.PUT_PIECE && _engine.get_intersection(letter, number).state() === Dvonn.State.VACANT) {
                        selected_coordinates = new Dvonn.Coordinates(letter, number);
                        ok = true;
                    } else if (_engine.phase() === Dvonn.Phase.MOVE_STACK && _engine.get_intersection(letter, number).state() === Dvonn.State.NO_VACANT) {
                        if (selected_piece && selected_piece.is_valid()) {
                            if (_engine.verify_moving(selected_piece, new Dvonn.Coordinates(letter, number))) {
                                selected_coordinates = new Dvonn.Coordinates(letter, number);
                                ok = true;
                            }
                        } else {
                            var coordinates = new Dvonn.Coordinates(letter, number);

                            if (_engine.can_move(coordinates)) {
                                var color = _engine.get_intersection(letter, number).color();

                                if (color !== Dvonn.Color.RED && _engine.current_color() === color) {
                                    selected_piece = coordinates;
                                    selected_color = color;
                                    manager.redraw();
                                }
                            }
                        }
                    }
                    if (ok) {
                        manager.play();
                    }
                }
            }
        }
    };

    var onMove = function (event) {
        if (_engine.current_color() === _color || _gui) {
            var pos = getClickPosition(event);
            var letter = compute_letter(pos.x, pos.y);

            if (letter != 'X') {
                var number = compute_number(pos.x, pos.y);

                if (number != -1) {
                    if (compute_pointer(pos.x, pos.y)) {
                        manager.redraw();
                    }
                }
            }
        }
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

    var show_intersection = function () {
        if (pointerX != -1 && pointerY != -1) {
            context.fillStyle = "#0000ff";
            context.strokeStyle = "#0000ff";
            context.lineWidth = 1;
            context.beginPath();
            context.arc(pointerX, pointerY, 5, 0.0, 2 * Math.PI);
            context.closePath();
            context.fill();
            context.stroke();
        }
    };

    init();
};
