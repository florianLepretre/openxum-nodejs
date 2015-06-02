// namespace Bubblebattle
var Bubblebattle = { };

Bubblebattle.load = function (callback) {
    $.getScript('/javascripts/utils/utils.js', function () {
        $.getScript('/javascripts/MCTS/MCTS.js', function () {
            $.getScript('/javascripts/MCTS/Node.js', function () {
                $.getScript('/javascripts/MCTS/Player.js', function () {
                    $.getScript('/javascripts/openxum/OpenXum.js', function () {
                        $.getScript('/javascripts/openxum/Manager.js', function () {
                            $.getScript('/javascripts/openxum/RemotePlayer.js', function () {
                                $.getScript('/javascripts/openxum/MCTSPlayer.js', function () {
                                    $.getScript('/javascripts/openxum/RestWebServicePlayer.js', function () {
                                        $.getScript('/javascripts/openxum/AIManager.js', function () {
                                            $.getScript('/javascripts/openxum/RealTimeGamePage.js', function () {
                                                $.getScript('/javascripts/bubblebattle/Engine.js', function () {
                                                    $.getScript('/javascripts/bubblebattle/Gui.js', function () {
                                                        callback();
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};
