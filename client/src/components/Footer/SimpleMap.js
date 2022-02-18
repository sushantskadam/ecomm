import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";

const mapStyles = {
  position: "relative",
  width: "100%",
  height: "100%",
};

class SimpleMap extends Component {
  constructor() {
    super();
    this.state = {
      name: "React",
      latitude: 19.0244,
      longitude: 72.8443,
    };
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    });
  }

  render() {
    return (
      <div>
        <Map
          google={this.props.google}
          zoom={14}
          style={mapStyles}
          initialCenter={{
            lat: 19.0244,
            lng: 72.8443,
          }}
        >
          <Marker onClick={this.onMarkerClick} name={"This is test name"} />
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAfqzFyA0cdy6404EUdkJf6xJAaQ4WbJlE",
})(SimpleMap);
