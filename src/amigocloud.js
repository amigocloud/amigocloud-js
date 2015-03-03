'use strict';

L.amigo = {
    map: map,
    constants: constants,
    utils: utils,
    auth: auth,
    AmigoStreet: L.tileLayer(this.constants.amigoLayersData[0].tiles + '/{z}/{x}/{y}.png'),
    AmigoGray: L.tileLayer(this.constants.amigoLayersData[1].tiles + '/{z}/{x}/{y}.png'),
    AmigoSatellite: L.tileLayer(this.constants.amigoLayersData[2].tiles + '/{z}/{x}/{y}.png'),
};
