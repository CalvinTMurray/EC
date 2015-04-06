/**
 * Created by Calvin . T . Murray on 14/02/2015.
 */

/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/googlemaps/google.maps.d.ts"/>

angular.module('MainApp', ['ngMaterial'])

    .controller('mainCtrl', ['$scope', function($scope) {


        $scope.initialize = function () {
            //var appleton = new google.maps.LatLng(55.9444,-3.1872);
            var appleton = new google.maps.LatLng(55.9444, -3.1872);

            var mapOptions = {
                center: new google.maps.LatLng(55.9531, -3.1889),
                zoom: 14
            };
            var contentString = '<div id="content">'+
                '<p>This is Appleton Tower<p>'+
                '</div>';

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

            var marker = new google.maps.Marker({
                position:appleton ,
                title:"Appleton Tower"
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map,marker);
            });
            google.maps.event.addDomListener(window, 'load', $scope.initialize);
            // To add the marker to the map, call setMap();
            marker.setMap(map);
        }

    }]);
