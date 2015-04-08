/**
 * Created by Calvin . T . Murray on 14/02/2015.
 */

/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/googlemaps/google.maps.d.ts"/>

'use strict';

module services {

    export interface IBusReliabilityService {
        get(): Stop[];
        put(busReliabilities : Stop[]) : void;
    }

    export interface Stop {
        id : number;
        name : string;
        latitude : number;
        longitude : number;
        score: number;
    }

    export class BusReliabilityDataStore implements IBusReliabilityService {
        static busReliabilities : Stop[];

        constructor() {
        }

        get(): Stop[] {
            return BusReliabilityDataStore.busReliabilities;
        }

        put(data : Stop[]) {
            BusReliabilityDataStore.busReliabilities = data;
        }

    }

    export interface IPositionService {
        getCurrentPosition() : google.maps.LatLng;
        setCurrentPosition(currentPosition : google.maps.LatLng);

        getSearchLocation() : google.maps.places.PlaceResult;
        setSearchLocation(searchPosition : google.maps.places.PlaceResult);

    }

    export class LocationDataStore implements IPositionService {
        static currentPosition : google.maps.LatLng = null;
        static searchLocation : google.maps.places.PlaceResult = null;

        $inject = ['$rootScope'];

        constructor(public $rootScope) {}


        getCurrentPosition():google.maps.LatLng {
            return LocationDataStore.currentPosition;
        }

        setCurrentPosition(currentPosition:google.maps.LatLng) {
            LocationDataStore.currentPosition = currentPosition;
            this.$rootScope.$broadcast("UpdatedCurrentPosition", currentPosition);
            //console.log(currentPosition);
        }

        getSearchLocation():google.maps.places.PlaceResult {
            return LocationDataStore.searchLocation;
        }

        setSearchLocation(searchLocation:google.maps.places.PlaceResult) {
            //console.log("Set Search Location");
            LocationDataStore.searchLocation = searchLocation;
            this.$rootScope.$broadcast("UpdatedSearchLocation", searchLocation);
        }
    }

    export interface IStopsAndMarkers {
        get() : StopAndMarker[]
        set(stopsAndMarkers : StopAndMarker[]);
    }

    export class StopsAndMarkersDataStore implements IStopsAndMarkers {
        static  stopsAndMarkers : StopAndMarker[];

        static $inject= ['$rootScope'];
        constructor(public $rootScope) {}

        get() {
            return StopsAndMarkersDataStore.stopsAndMarkers;
        }

        set(stopsAndMarkers: StopAndMarker[]) {
            StopsAndMarkersDataStore.stopsAndMarkers = stopsAndMarkers;
            this.$rootScope.$broadcast("UpdatedStopsAndMarkers", stopsAndMarkers);

        }
    }

}

class StopAndMarker {

    constructor (private stop : services.Stop, private marker : google.maps.Marker) {

    }

    getStop() {
        return this.stop;
    }

    getMarker() {
        return this.marker;
    }
}

interface MainCtrlScope extends ng.IScope {

    busReliabilities : services.Stop[];
    getBusReliabilities;
    initialize;

    searchNearby;
    searchLocation;

}

angular.module('MainApp', ['ngMaterial', 'ngAria'])

    .factory('mapsDataStore', function() {
        var map = null;

        var get = function() {

            return map;
        };

        var put = function(map) {
            this.map = map;
            return map;
        };

        return {
            get: get,
            put: put
        }
    })

    .service("BusReliabilityService", services.BusReliabilityDataStore)
    .service("PositionService", services.LocationDataStore)
    .service("StopsAndMarkersService", services.StopsAndMarkersDataStore)

    .controller('MainCtrl', ['$scope', 'BusReliabilityService', 'PositionService', '$http', 'mapsDataStore', 'StopsAndMarkersService',
        function($scope : MainCtrlScope, BusReliabilityService : services.IBusReliabilityService,
                 PositionService : services.IPositionService, $http, mapsDataStore,
                 StopsAndMarkersService : services.IStopsAndMarkers) {

            $scope.searchNearby = "Current Location";
            $scope.searchLocation = PositionService.getSearchLocation() !== null ? PositionService.getSearchLocation() : "Search Location";

            $scope.$on("UpdatedSearchLocation", function(event, value) {
                //console.log(value.name);
                $scope.searchLocation = value !== null ? value.name : "Search Location";
                $scope.$apply();
            });

            $scope.getBusReliabilities = function() {
                return $http.get("http://curlyarrows.byethost9.com/api/scores").success(function(response) {
                    console.log("Retrieving bus reliabilities");
                    $scope.busReliabilities = response.stops;
                    BusReliabilityService.put(response.stops);
                });
            };

            $scope.initialize = function () {
                //var appleton : google.maps.LatLng = new google.maps.LatLng(55.9444, -3.1872);
                //
                var mapOptions : google.maps.MapOptions = {
                    //center: new google.maps.LatLng(55.9531, -3.1889),
                    zoom: 14
                };

                //var contentString = '<div id="content">'+
                //    '<p>This is Appleton Tower<p>'+
                //    '</div>';
                //
                //var infowindow = new google.maps.InfoWindow({
                //    content: contentString
                //});

                var map = mapsDataStore.put(new google.maps.Map(document.getElementById('map-canvas'), mapOptions));

                initialiseAutocomplete(map);

                initialiseGeolocation(map);

                //var marker = new google.maps.Marker({
                //    position:appleton ,
                //    title:"Appleton Tower"
                //});
                //
                //google.maps.event.addListener(marker, 'click', function() {
                //    infowindow.open(map,marker);
                //});
                //google.maps.event.addDomListener(window, 'load', $scope.initialize);
                // To add the marker to the map, call setMap();
                //marker.setMap(map);

                //google.maps.event.addDomListener(window, 'load', $scope.initialize);

                $scope.getBusReliabilities().then(function() {
                    initialiseMarkers(map, $scope.busReliabilities);
                });
            };

            function initialiseGeolocation(map : google.maps.Map) {
                if(navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {

                        var pos = new google.maps.LatLng(position.coords.latitude,
                            position.coords.longitude);

                        PositionService.setCurrentPosition(pos);

                        //var infowindow = new google.maps.InfoWindow({
                        //    map: map,
                        //    position: pos,
                        //    content: 'You are here!'
                        //});

                        var currentMarker = new google.maps.Marker({
                            position: pos,
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 10
                            },
                            map: map
                        });

                        var infowindow = new google.maps.InfoWindow({
                            content: "Current Location"
                        });

                        google.maps.event.addListener(currentMarker, 'click', function() {
                            infowindow.open(map,currentMarker);
                        });

                        map.setCenter(pos);
                    }, function() {
                        handleNoGeolocation(true);
                    });
                } else {
                    // Browser doesn't support Geolocation
                    handleNoGeolocation(false);
                }

                function handleNoGeolocation(errorFlag : boolean) {
                    if (errorFlag) {
                        var content = 'Error: The Geolocation service failed.';
                    } else {
                        var content = 'Error: Your browser doesn\'t support geolocation.';
                    }

                    var options = {
                        map: map,
                        position: new google.maps.LatLng(60, 105),
                        content: content
                    };

                    var infowindow = new google.maps.InfoWindow(options);
                    map.setCenter(options.position);
                }
            }

            function initialiseMarkers(map : google.maps.Map, data : services.Stop[]) {

                var markers = [];

                angular.forEach(data, function(value : services.Stop, key) {

                    var content : string =
                        "<p><strong>" +
                        value.name + "</strong></br>" +
                        value.score + "%" +
                        "</p>";

                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(value.latitude, value.longitude),
                        map: map
                    });

                    markers.push(new StopAndMarker(value, marker));

                    var infowindow = new google.maps.InfoWindow({
                        content: content
                    });

                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.open(map,marker);
                    });

                });

                StopsAndMarkersService.set(markers);

            }

            function initialiseAutocomplete(map) {

                var input = document.getElementById('searchInput');

                // region of edinburgh
                var options = {
                    bounds: new google.maps.LatLngBounds(new google.maps.LatLng(55.95, 3.18), new google.maps.LatLng(55.95, 3.18)),
                    componentRestrictions: "gb"
                };

                var autocomplete = new google.maps.places.Autocomplete(input);

                autocomplete.bindTo('bounds', map);

                var infowindow = new google.maps.InfoWindow();
                var marker = new google.maps.Marker({
                    map: map,
                    anchorPoint: new google.maps.Point(0, -29)
                });

                google.maps.event.addListener(autocomplete, 'place_changed', function() {
                    infowindow.close();
                    marker.setVisible(false);
                    var place = autocomplete.getPlace();
                    if (!place.geometry) {
                        PositionService.setSearchLocation(null);    // Set the search position to null
                        return;
                    }

                    PositionService.setSearchLocation(place); // Set the search position to the place that was searched
                    // If the place has a geometry, then present it on a map.
                    if (place.geometry.viewport) {
                        map.fitBounds(place.geometry.viewport);
                    } else {
                        map.setCenter(place.geometry.location);
                        map.setZoom(17);  // Why 17? Because it looks good.
                    }
                    marker.setIcon(/** @type {google.maps.Icon} */({
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(35, 35)
                    }));
                    marker.setPosition(place.geometry.location);
                    marker.setVisible(true);


                    var address = '';
                    if (place.address_components) {
                        address = [
                            (place.address_components[0] && place.address_components[0].short_name || ''),
                            (place.address_components[1] && place.address_components[1].short_name || ''),
                            (place.address_components[2] && place.address_components[2].short_name || '')
                        ].join(' ');
                    }

                    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
                    infowindow.open(map, marker);

                    google.maps.event.addListener(marker, 'click', function() {
                        infowindow.open(map,marker);
                    });
                });
            }

        }])

    .controller('StopReliabilityListCtrl', ['$scope', 'StopsAndMarkersService',
        function($scope, StopsAndMarkersService : services.IStopsAndMarkers) {

            $scope.stopsAndMarkers = StopsAndMarkersService.get();

            $scope.$on("UpdatedStopsAndMarkers", function(event, value) {
                $scope.stopsAndMarkers = value;
                console.log(value);
            })

        }]);