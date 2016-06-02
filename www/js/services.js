angular.module('app.services', [])
.factory('Mqtt', [function() {
    return new MqttClient({
         host: 'ekg.westus.cloudapp.azure.com',
         port: 3002
    });
}]);