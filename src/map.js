'use strict';

var map = L.Map.extend({
    initialize: function (element, options) {
        var layersControl, initialLayer = [];
        options.loadAmigoLayers =
            (options.loadAmigoLayers === undefined) ? true :
            options.loadAmigoLayers;

        layersControl = this.buildAmigoLayers(options.loadAmigoLayers);
        if (options.loadAmigoLayers) {
            initialLayer = [L.amigo.AmigoStreet];
        }

        L.Map.prototype.initialize.call(
            this,
            element,
            L.extend(
                L.Map.prototype.options,
                L.extend(
                    {},
                    options,
                    {
                        layers: initialLayer
                    }
                )
            )
        );
        layersControl.addTo(this);

        // Disable the default 'Leaflet' text
        if (this.attributionControl) {
            this.attributionControl.setPrefix('');
        }

        if (!this.options.center) {
            this.setView([0.0, 0.0], 10);
        }

        this.on('unload', function (e) {
            L.amigo.AmigoStreet = L.tileLayer(
                L.amigo.constants.amigoLayersData[0].tiles + '/{z}/{x}/{y}.png',
                {
                    attribution: 'Map data &copy; <a href="http://amigocloud.com">AmigoCloud</a>',
                    name: 'AmigoStreet',
                    maxZoom: 22
                }
            );
            L.amigo.AmigoGray = L.tileLayer(
                L.amigo.constants.amigoLayersData[1].tiles + '/{z}/{x}/{y}.png',
                {
                    attribution: 'Map data &copy; <a href="http://amigocloud.com">AmigoCloud</a>',
                    name: 'AmigoGray',
                    maxZoom: 22
                }
            );
            L.amigo.AmigoSatellite = L.tileLayer(
                L.amigo.constants.amigoLayersData[2].tiles + '/{z}/{x}/{y}.png',
                {
                    attribution: 'Map data &copy; <a href="http://amigocloud.com">AmigoCloud</a>',
                    name: 'AmigoSatellite',
                    maxZoom: 22
                }
            );
        });
    },
    buildAmigoLayers: function (loadAmigoLayers) {
        var layersData = L.amigo.constants.amigoLayersData,
            tileUrlSuffix = '/{z}/{x}/{y}.png',
            i;
        this.systemLayers = {};
        this.baseLayers = {};
        this.datasetLayers = {};

        this.systemLayers.AmigoStreet = L.amigo.AmigoStreet;
        this.systemLayers.AmigoGray = L.amigo.AmigoGray;
        this.systemLayers.AmigoSatellite = L.amigo.AmigoSatellite;

        this.layersControl = L.control.layers();

        if (loadAmigoLayers) {
            for (var layer in this.systemLayers) {
                this.layersControl.addBaseLayer(this.systemLayers[layer], layer);
            }
        }

        return this.layersControl;
    },
    addDatasetLayer: function (config) {
        if (config.url) {
            return this.addDatasetLayerByUrl(config);
        } else if (config.ids) {
            return this.addDatasetLayerByIds(config);
        } else {
            return;
        }
    },
    addDatasetLayerByUrl: function (config) {
        var _this = this,
            url = config.url,
            datasetData;

        if (config.options && !config.options.maxZoom) {
            config.options.maxZoom = 22;
        } else if (!config.options) {
            config.options = {maxZoom: 22};
        }

        url += L.amigo.auth.getTokenParam();
        L.amigo.utils.get(url).then(function (data) {
            datasetData = data;
            _this.datasetLayers[datasetData.name] =
                L.tileLayer(
                    datasetData.tiles + '/{z}/{x}/{y}.png' + L.amigo.auth.getTokenParam(),
                    L.extend(
                        {},
                        config.options,
                        {
                            datasetData: datasetData
                        }
                    )
                );
            _this.layersControl.addOverlay(_this.datasetLayers[datasetData.name], datasetData.name);
            return _this.datasetLayers[datasetData.name];
        });
    },
    addDatasetLayerByIds: function (config) {
        var url = '/users/' + config.ids.user + '/projects/' +
            config.ids.project +
            ((config.type === 'vector') ? '/datasets/' : '/raster_datasets/') +
            config.ids.dataset + L.amigo.auth.getTokenParam(),
            _this = this,
            datasetData;

        if (config.options && !config.options.maxZoom) {
            config.options.maxZoom = 22;
        } else if (!config.options) {
            config.options = {maxZoom: 22};
        }

        L.amigo.utils.get(url).then(function (data) {
            datasetData = data;
            _this.datasetLayers[datasetData.name] =
                L.tileLayer(
                    datasetData.tiles + '/{z}/{x}/{y}.png' + L.amigo.auth.getTokenParam(),
                    L.extend(
                        {},
                        config.options,
                        {
                            datasetData: datasetData
                        }
                    )
                );
            _this.layersControl.addOverlay(_this.datasetLayers[datasetData.name], datasetData.name);
            return _this.datasetLayers[datasetData.name];
        });
    },
    addBaseLayer: function (config, options) {
        var layersCount = 0, layer;
        if (config.url) {
            this.addBaseLayerByUrl(config);
        } else if (config.id) {
            this.addBaseLayerById(config);
        } else if (config.getContainer) {
            this.addBaseLayerWithLayer(config, options);
        }
        for (layer in this.baseLayers) {
            layersCount++;
        }
        if (layersCount === 1) {
            this.addLayer(this.baseLayers[layer].redraw());
        }
    },
    addExternalBaseLayer: function (name, url, options) {
        var layersCount = 0, layer;
        this.baseLayers[name] =
            L.tileLayer(url, options);
        this.layersControl.addBaseLayer(this.baseLayers[name], name);

        for (layer in this.baseLayers) {
            layersCount++;
        }
        if (layersCount === 1) {
            this.addLayer(this.baseLayers[layer]);
        }
    },
    addBaseLayerByUrl: function (config) {
        var url = config.url + L.amigo.auth.getTokenParam(),
            _this = this,
            baseLayerData;

        if (config.options && !config.options.maxZoom) {
            config.options.maxZoom = 22;
        } else if (!config.options) {
            config.options = {maxZoom: 22};
        }

        L.amigo.utils.get(url).then(function (data) {
            baseLayerData = data;
            _this.baseLayers[baseLayerData.name] =
                L.tileLayer(
                    baseLayerData.tiles + '/{z}/{x}/{y}.png' + L.amigo.auth.getTokenParam(),
                    L.extend(
                        {},
                        config.options,
                        {
                            datasetData: datasetData
                        }
                    )
                );
            _this.layersControl.addBaseLayer(_this.baseLayers[baseLayerData.name], baseLayerData.name);
        });
    },
    addBaseLayerById: function (config) {
        var url = '/base_layers/' + config.id + L.amigo.auth.getTokenParam(),
            _this = this,
            baseLayerData;

        if (config.options && !config.options.maxZoom) {
            config.options.maxZoom = 22;
        } else if (!config.options) {
            config.options = {maxZoom: 22};
        }

        L.amigo.utils.get(url).then(function (data) {
            baseLayerData = data;
            _this.baseLayers[baseLayerData.name] =
                L.tileLayer(
                    baseLayerData.tiles + '/{z}/{x}/{y}.png' + L.amigo.auth.getTokenParam(),
                    L.extend(
                        {},
                        config.options,
                        {
                            baseLayerData: baseLayerData
                        }
                    )
                );
            _this.layersControl.addBaseLayer(_this.baseLayers[baseLayerData.name], baseLayerData.name);
        });
    },
    addBaseLayerWithLayer: function (layer, options) {
        for (var option in options) {
            layer.options[option] = options[option];
        }
        this.baseLayers[layer.options.name] = layer;
        this.layersControl.addBaseLayer(this.baseLayers[layer.options.name], layer.options.name);
    },
    getBaseLayers: function () {
        return this.baseLayers;
    },
    getDatasetLayers: function () {
        return this.datasetLayers;
    }
});
