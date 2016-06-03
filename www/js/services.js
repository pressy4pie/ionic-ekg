angular.module('app.services', [])
.factory('Mqtt', [function() {
    var Mqtt_service = new Paho.MQTT.Client("ekg.westus.cloudapp.azure.com", 3002,"testApp");
    
    var mqtt_options = {
        timeout: 3,
        onSuccess: function () {
            console.log("mqtt connected");
            // Connection succeeded; subscribe to our topic, you can add multile lines of these
            Mqtt_service.subscribe('/zc/test_serial/#', {qos: 1});
            initmessage = new Paho.MQTT.Message("connect");
            initmessage.destinationName = "/zc/test_serial/";
            Mqtt_service.send(initmessage);
        },
    };
    
    Mqtt_service.onConnectionLost = function(){
        console.log('connection lost - trying to reconnect.');
        // Try to reconnect. 
        // This should probably be in a set_timeout type thing butfukit.
        //Mqtt_service.connect(mqtt_options);
    };
    
    // Do the connect. 
    Mqtt_service.connect(mqtt_options);
    return Mqtt_service;
}]);