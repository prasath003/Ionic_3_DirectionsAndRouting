import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {isUndefined} from "ionic-angular/util/util";
declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  Destination: any = '';
  MyLocation: any;
  From:any = '';

  constructor(public navCtrl: NavController) {

  }

  DisplayAndAnimateRoute() {
    let here = this;

    let directionsProvider = new google.maps.DirectionsService;
    let directionsRender = new google.maps.DirectionsRenderer;

    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: {lat: 20.5837, lng: 78.9629}
    });
    directionsRender.setMap(map);
    console.log("From :",this.From);

    if(this.From == null || this.From=='' ||this.From == isUndefined ){
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.setCenter(pos);
          here.MyLocation = new google.maps.LatLng(pos);

        }, function() {

        });
      } else {
        // Browser doesn't support Geolocation
        // Give Notifications or your actions
      }
    }else{
      here.MyLocation = this.From;
    }

    //Animate Function
    function animateCircle(line) {
      let count = 0;
      window.setInterval(function() {
        count = (count + 1) % 200;
        let icons = line.get('icons');
        icons[0].offset = (count / 2) + '%';
        line.set('icons', icons);
      }, 60);
    }

    directionsProvider.route({
    origin: this.MyLocation,
    destination: this.Destination,
    travelMode: 'DRIVING'

  }, function(response, status) {

    if (status === 'OK') {
      directionsRender.setDirections(response);

      //In Response Draw polyline
      let polypath = response.routes[0].overview_polyline;

      //Just a circle with red background you can modify on your own/images
      let symbolOne = {
        path: 'M -2,0 0,-2 2,0 0,2 z',
        strokeColor: '#F00',
        fillColor: '#F00',
        fillOpacity: 1
      };


      let polyline = new google.maps.Polyline({

        path: google.maps.geometry.encoding.decodePath(polypath),
        geodesic: true,
        strokeColor: '#000000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        icons: [{
          icon: symbolOne,
          offset: '100%'
        }],
        map: map
      });
      let bounds = new google.maps.LatLngBounds();
      for (let i = 0; i < polyline.getPath().getLength(); i++) {
        bounds.extend(polyline.getPath().getAt(i));
      }

      animateCircle(polyline);
      map.fitBounds(bounds);
      console.log(response);

    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}


}
