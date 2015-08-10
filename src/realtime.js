'use strict';

var realtime = {
    authenticate: function (userId, websocketSession, extra) {
        var data = {
            'userid' : userId,
            'websocket_session': websocketSession
        };

        for (var attr in extra) {
            data[attr] = extra[attr];
        }

        this.socket.emit('authenticate', data);
    },
    emit: function (eventName, data, callback) {
        var _this = this;
        this.socket.emit(eventName, data, function () {
            var args = arguments;
            if (callback) {
                callback.apply(_this.socket, args);
            }
        });
    },
    on: function (eventName, callback) {
        this.socket.on(eventName, callback);
    },
    setAccessToken: function (token) {
        this.token = token;
    },
    connectDatasetById: function (userId, projectId, datasetId) {
        this.userId = userId;
        this.projectId = projectId;
        this.datasetId = datasetId;

        this.startListening(
            L.amigo.constants.baseUrl + L.amigo.constants.apiUrl +
                '/users/' + userId +
                '/projects/' + projectId +
                '/datasets/' + datasetId +
                '/start_websocket_session'
        );
    },
    connectDatasetByUrl: function (url) {
        var tokens;

        if (url.indexOf('start_websocket_session') === -1) {
            url += '/start_websocket_session';
        }

        tokens = url.split('/');

        this.userId = tokens[tokens.indexOf('users') + 1];
        this.projectId = tokens[tokens.indexOf('projects') + 1];
        this.datasetId = tokens[tokens.indexOf('datasets') + 1];

        this.startListening(url);
    },
    startListening: function (url) {
        var _this = this,
            get = L.amigo.utils.get,
            constants = L.amigo.constants;

        get(constants.baseUrl + constants.apiUrl +
            '/me?token=' + this.token + '&format=json').
            then(function (meData) {
                _this.userId = parseInt(meData.id);
                get(url + '?token=' + _this.token + '&format=json').
                    then(function (data) {
                        _this.authenticate(
                            parseInt(_this.userId),
                            data.websocket_session,
                            {
                                datasetid: parseInt(_this.datasetId)
                            }
                        );
                    });
            });
    }
};
