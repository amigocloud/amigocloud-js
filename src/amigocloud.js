'use strict';

L.amigo = {
    map: map,
    marker: marker,
    featureLayer: featureLayer,
    constants: constants,
    utils: utils,
    auth: auth,
    realtime: realtime,
    events: events,
    AmigoStreet: L.tileLayer(
        this.constants.amigoLayersData[0].tiles + '/{z}/{x}/{y}.png',
        {
            attribution: 'Map data &copy; <a href="http://amigocloud.com">AmigoCloud</a>',
            name: 'AmigoStreet',
            maxZoom: 22
        }
    ),
    AmigoGray: L.tileLayer(
        this.constants.amigoLayersData[1].tiles + '/{z}/{x}/{y}.png',
        {
            attribution: 'Map data &copy; <a href="http://amigocloud.com">AmigoCloud</a>',
            name: 'AmigoGray',
            maxZoom: 22
        }
    ),
    AmigoSatellite: L.tileLayer(
        this.constants.amigoLayersData[2].tiles + '/{z}/{x}/{y}.png',
        {
            attribution: 'Map data &copy; <a href="http://amigocloud.com">AmigoCloud</a>',
            name: 'AmigoSatellite',
            maxZoom: 22
        }
    ),
    version: '1.0.4'
};

L.amigo.realtime.socket = amigo_io.connect(constants.socketServerUrl);
