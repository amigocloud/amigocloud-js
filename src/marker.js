'use strict';

var marker = {
    icon: function (fp, options) {
        var sizes, size, symbol, color;

        fp = fp || {};

        sizes = {
            small: [20, 50],
            medium: [30, 70],
            large: [35, 90]
        };
        size = fp['marker-size'] || 'medium';
        symbol = ('marker-symbol' in fp && fp['marker-symbol'] !== '') ?
            '-' + fp['marker-symbol'] : '';
        color = (fp['marker-color'] || '7e7e7e').replace('#', '');

        return L.icon({
            iconUrl: url('/marker/' +
                         'pin-' + size.charAt(0) + symbol + '+' + color +
                         // detect and use retina markers, which are x2 resolution
                         (L.Browser.retina ? '@2x' : '') + '.png', options && options.accessToken),
            iconSize: sizes[size],
            iconAnchor: [sizes[size][0] / 2, sizes[size][1] / 2],
            popupAnchor: [0, -sizes[size][1] / 2]
        });
    }
};
