'use strict';

var utils = {
    parseUrl: function (url) {
        if (url.substr(0, 4) === 'http') {
            return url;
        } else {
            return L.amigo.constants.baseUrl + L.amigo.constants.apiUrl + url;
        }
    },
    http: function (method, url, data, headers, async) {
        var xmlHttp = new XMLHttpRequest(),

        url = L.amigo.utils.parseUrl(url);

        xmlHttp.then = function (callback, errorCallback) {
            this.onreadystatechange = function () {
                if (xmlHttp.readyState === 4) {
                    if (xmlHttp.status === 200) {
                        callback(JSON.parse(this.responseText));
                    } else {
                        errorCallback(JSON.parse(this.responseText));
                    }
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
    get: function (url, data) {
        if (typeof data !== 'undefined') {
            url += '?' + L.amigo.utils.params(data) + '&token=' + L.amigo.auth.getToken() + '&format=json';
        } else {
            url += '?token=' + L.amigo.auth.getToken() + '&format=json';
        }
        return L.amigo.utils.http('GET', url);
    },
    post: function (url, data, headers) {
        if (headers) {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
        } else {
            headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
        }
        return L.amigo.utils.http('POST', url, data, headers);
    },
    params: function (params) {
        var parts = [];
        for (var attr in params) {
            parts.push([attr, encodeURIComponent(params[attr])].join('='));
        }
        return parts.join('&');
    },
    buildPopupHTML: function (data, config) {
        var header =  '<h3 class="title">';
        var body = '<div class="content"><ul>';
        var name;

        if (config.popupTitle) {
            header += data.data[0][config.popupTitle];
        }

        header += '</h3>';

        for (var i = 0; i < data.columns.length; i++) {
            if (data.columns[i].type === 'geometry') {
                continue;
            }
            name = data.columns[i].name;
            body += '<li class="row-attribute">'
            body += '<label>' + name + ': </label>';
            body += '<span>' + data.data[0][name] + '</span>';
            body += '</li>';
        }

        body += '</ul></div>';

        return header + body;
    },
    buildPopupQuery: function (e, config) {
        var query = 'SELECT ';

        if (config.displayFields) {
            query += config.displayFields.join(',');
        } else {
            query += '*'
        }
        query += ' FROM ' + e.target.options.datasetData.table_name +
            " WHERE amigo_id='" + e.data.amigo_id + "'";

        return query;
    },
    showPopup: function (e, config, map) {
        var datasetData = e.target.options.datasetData,
            popupHTMLString, queryString, queryURL;
        if (e.data) {
            // First request the row's data'
            queryURL = datasetData.project;
            queryString = L.amigo.utils.buildPopupQuery(e, config);
            L.amigo.utils.get(
                queryURL + '/sql',
                {
                    query: queryString
                }
            ).then(function (data) {
                //Now build the HTML for the popup with data
                popupHTMLString = L.amigo.utils.buildPopupHTML(data, config);

                L.popup({
                    className: 'ac-feature-popup ' + config.className
                }).setLatLng(e.latlng)
                    .setContent(popupHTMLString)
                    .openOn(map);
            }, function (error) {
                L.popup({
                    className: 'ac-feature-popup error' + config.className
                }).setLatLng(e.latlng)
                    .setContent(
                        'There was an error requesting the data. ' +
                            'Please check that the display fields are exact matches of column names on this dataset.'
                    ).openOn(map);
            });
        }
    },
    processAdditionalDatasetConfig: function (datasetLayer, config, map) {
        if (config.popup) {
            L.amigo.utils.processPopupDatasetConfig(
                datasetLayer,
                config.popup,
                map
            );
        }

        return datasetLayer;
    },
    processPopupDatasetConfig: function (datasetLayer, popupConfig, map) {
        var name = datasetLayer.options.datasetData.name;

        if (!map.utfGrids) {
            map.utfGrids = {};
        }

        map.on('overlayadd', function (e) {
            map.utfGrids[name] = new L.UtfGrid(
                e.layer.options.datasetData.tiles + '/{z}/{x}/{y}.json' +
                    L.amigo.auth.getTokenParam(),
                {
                    useJsonP: false,
                    minZoom: 0,
                    maxZoom: 20,
                    datasetData: e.layer.options.datasetData
                }
            );

            map.utfGrids[name].on('click', function (e) {
                if (popupConfig.overrideCallback) {
                    popupConfig.overrideCallback(e, map);
                } else {
                    L.amigo.utils.showPopup(e, popupConfig, map);
                }

                if (popupConfig.additionalCallback) {
                    popupConfig.additionalCallback(e, map);
                }
            });

            map.addLayer(map.utfGrids[name]);
        });

        map.on('overlayremove', function (e) {
            map.removeLayer(map.utfGrids[name]);
            delete map.utfGrids[name];
        });
    },

};
