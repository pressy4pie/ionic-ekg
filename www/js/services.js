angular.module('app.services', [])
.factory('Mqtt', [function() {
    return new Paho.MQTT.Client("ekg.westus.cloudapp.azure.com", 3002,
        "testApp");
}]);