'use strict';

var auth = {
    setToken: function (token) {
        this.token = token;
    },
    getToken: function () {
        return this.token;
    },
    getTokenParam: function () {
        return '?token=' + this.token;
    }
};
