'use strict';

exports.init = function (req, res) {
    if (req.user) {
        res.render('games/create/index', { game: req.param('game') });
    } else {
        res.redirect('/');
    }
};

exports.create = function (req, res) {
    if (req.param('game_type') === 'ai' ||
        req.param('game_type') === 'remote_ai' ||
        req.param('game_type') === 'gui') {
        res.redirect('/games/play/?game=' + req.param('game') +
            '&color=' + req.param('color') + '&mode=' + req.param('mode') + '&game_type=' + req.param('game_type') + '&game_id=-1');
    } else if (req.param('game_type') === 'offline') {
        req.app.db.models.GameType.findOne({ name: req.param('game') }, null,
            { safe: true }, function (err, gametype) {
                req.app.db.models.Game.findOne({ name: req.param('name') }, null,
                    { safe: true }, function (err, game) {
                        if (!game) {
                            var fieldsToSet = {
                                name: req.param('name'),
                                game: gametype._id,
                                color: req.param('color'),
                                mode: req.param('mode'),
                                type: 'offline',
                                status: 'wait',
                                userCreated: {
                                    id: req.user._id,
                                    name: req.user.username
                                },
                                opponent: { id: null },
                                currentColor: req.param('color')
                            };
                            req.app.db.models.Game.create(fieldsToSet, function (err, user) {
                            });
                        }
                    });
            });
        res.redirect('/games/new/?game=' + req.param('game'));
    } else { // online
        req.app.db.models.GameType.findOne({ name: req.param('game') }, null,
            { safe: true }, function (err, gametype) {
                req.app.db.models.Game.findOne({ name: req.param('name') }, null,
                    { safe: true }, function (err, game) {
                        if (!game) {
                            var fieldsToSet = {
                                name: req.param('name'),
                                game: gametype._id,
                                color: req.param('color'),
                                mode: req.param('mode'),
                                type: 'online',
                                status: 'wait',
                                userCreated: {
                                    id: req.user._id,
                                    name: req.user.username
                                },
                                opponent: { id: null }
                            };
                            req.app.db.models.Game.create(fieldsToSet, function (err, user) {
                            });
                        }
                    });
            });

        res.redirect('/games/new/?game='  + req.param('game'));
    }
};
