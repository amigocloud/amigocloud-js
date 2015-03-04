'use strict';

L.amigo = {
    map: map,
    constants: constants,
    utils: utils,
    auth: auth,
    AmigoStreet: L.tileLayer(this.constants.amigoLayersData[0].tiles + '/{z}/{x}/{y}.png', {attribution: 'Map data &copy; <a href="http://amigocloud.com">AmigoCloud</a>', name: 'AmigoStreet'}),
    AmigoGray: L.tileLayer(this.constants.amigoLayersData[1].tiles + '/{z}/{x}/{y}.png', {attribution: 'Map data &copy; <a href="http://amigocloud.com">AmigoCloud</a>', name: 'AmigoGray'}),
    AmigoSatellite: L.tileLayer(this.constants.amigoLayersData[2].tiles + '/{z}/{x}/{y}.png', {attribution: 'Map data &copy; <a href="http://amigocloud.com">AmigoCloud</a>', name: 'AmigoSatellite'}),
    version: '1.0.2'
};