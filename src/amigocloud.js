'use strict';

var Amigo = {
    baseUrl: 'https://www.amigocloud.com',
    apiUrl: '/api/v1',
    websocketUrl: 'https://www.amigocloud.com/amigosocket',

    clientId: '82e597d526db4fd027a7',
    clientSecret: '07b03a991c84901ac7341ff967563f1c2e4d6cd3',

    version: '0.0.0'
};

Amigo.core = {
    parseUrl: function (url) {
        if (url.substr(0, 5) === 'https') {
            return url
        } else {
            return Amigo.baseUrl + Amigo.apiUrl + url;
        }
    },
    http: function (method, url, data, headers, async) {
        var xmlHttp = new XMLHttpRequest(),
        authHeader = Amigo.auth.makeAuthHeader();

        url = Amigo.core.parseUrl(url);

        xmlHttp.then = function (callback) {
            this.onreadystatechange = function () {
                if (xmlHttp.readyState === 4) {
                    callback(JSON.parse(this.responseText));
                }
            };

            return xmlHttp;
        };

        xmlHttp.open(
            method,
            url,
            (async === undefined) ? true : async
        );

        if (headers) {
            headers['Authorization'] = authHeader['Authorization'];
        } else {
            headers = authHeader;
        }
        for (var attr in headers) {
            xmlHttp.setRequestHeader(attr, headers[attr]);
        }

        if (data) {
            xmlHttp.send(Amigo.core.params(data));
        } else {
            xmlHttp.send();
        }

        return xmlHttp;
    },
    me: function () {
        return Amigo.core.get('/me');
    },
    get: function (url) {
        return Amigo.core.http('GET', url);
    },
    post: function (url, data, headers) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        return Amigo.core.http('POST', url, data, headers);
    },
    params: function (params) {
        var parts = [];
        for (var attr in params) {
            parts.push([attr, encodeURIComponent(params[attr])].join('='));
        }
        return parts.join('&');
    }
};

Amigo.socket = {
    init: function () {
        var socket = io.connect(Amigo.websocketUrl);
        this.socket = socket;
    },
    on: function (eventName, callback) {
        this.socket.on(eventName, function () {
            callback.apply(this.socket, arguments);
        });
    },
    emit: function (eventName, data, callback) {
        this.socket.emit(eventName, data, function () {
            callback.apply(this.socket, arguments);
        });
    },
    authenticate: function (userid, websocket_session, extra) {
        var data = {
            'userid' : userid,
            'websocket_session': websocket_session
        };

        for (var attr in extra) {
            data[attr] = extra[attr];
        }

        this.socket.emit('authenticate', data);
    },
    listenUserEvents: function () {
        Amigo.core.get(Amigo.user.start_websocket_session).
            then(function (data) {
                Amigo.socket.authenticate(
                    Amigo.user.id,
                    data.websocket_session
                );
            });
    },
    listenDatasetEvents: function (userId, projectId, datasetId) {
        Amigo.core.get(
            '/users/' + userId +
                '/projects/' + projectId +
                '/datasets/' + datasetId +
                '/start_websocket_session'
        ).then(function (data) {
            Amigo.socket.authenticate(
                Amigo.user.id,
                data.websocket_session,
                { datasetid: datasetId }
            );
        });
    },
    removeAllListeners: function (eventName) {
        this.socket.removeAllListeners(eventName);
    }
};

Amigo.auth = {
    makeAuthHeader: function () {
        if (Amigo.auth.accessToken) {
            return {
                'Authorization': 'Bearer ' + Amigo.auth.accessToken
            };
        }
    },
    login: function (email, password) {
        var postData = {
            client_id: Amigo.clientId,
            client_secret: Amigo.clientSecret,
            grant_type: 'password',
            username: email,
            password: password
        },
        xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState === 4) {
                var data = JSON.parse(this.responseText);

                Amigo.auth.accessToken = data.access_token;
                Amigo.auth.tokenType = data.token_type;
                Amigo.auth.expiresIn = data.expires_in;
                Amigo.auth.scope = data.scope;

                Amigo.core.me().then(function (data) {
                    Amigo.user = data;
                });
            }
        };

        xmlHttp.open(
            'POST',
            Amigo.baseUrl + Amigo.apiUrl + '/oauth2/access_token',
            false
        );

        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlHttp.send(Amigo.core.params(postData));
    }
};
