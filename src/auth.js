'use strict';

var auth = {
    setToken: function (token) {
        this.token = token;
    },
    getToken: function () {
        return this.token;
    },
    getTokenParam: function () {
        if (this.token) {
            return '?token=' + this.token;
        } else {
            return '';
        }
    }
};
