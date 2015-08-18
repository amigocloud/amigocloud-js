'use strict';

var events = {
    token: '',
    socket: io.connect(constants.socketServerUrl, {port: 443}),
    authenticate: function () {
        var data = {
            'userid' : this.userId,
            'websocket_session': this.websocketSession
        };

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
    startListening: function () {
        var _this = this,
            get = L.amigo.utils.get,
            constants = L.amigo.constants,
            auth = L.amigo.auth;

        _this.token = auth.getToken();
        get(constants.baseUrl + constants.apiUrl + '/me').
            then(function (meData) {
                _this.userId = parseInt(meData.id);
                get(meData.start_websocket_session).
                    then(function (data) {
                        _this.websocketSession = data.websocket_session;
                        _this.authenticate();
                    });
            });
    }
};
