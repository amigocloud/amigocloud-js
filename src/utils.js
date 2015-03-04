'use strict';

var utils = {
    parseUrl: function (url) {
        if (url.substr(0, 4) === 'http') {
            return url
        } else {
            return L.amigo.constants.baseUrl + L.amigo.constants.apiUrl + url;
        }
    },
    http: function (method, url, data, headers, async) {
        var xmlHttp = new XMLHttpRequest(),

        url = L.amigo.utils.parseUrl(url);

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

        if (data) {
            xmlHttp.send(L.amigo.utils.params(data));
        } else {
            xmlHttp.send();
        }

        return xmlHttp;
    },
    me: function () {
        return L.amigo.utils.get('/me');
    },
    get: function (url) {
        return L.amigo.utils.http('GET', url);
    },
    post: function (url, data, headers) {
        if (headers) {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } else {
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        return L.amigo.utils.http('POST', url, data, headers);
    },
    params: function (params) {
        var parts = [];
        for (var attr in params) {
            parts.push([attr, encodeURIComponent(params[attr])].join('='));
        }
        return parts.join('&');
    }
};

