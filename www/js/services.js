angular.module('app.services', [])
.factory('Mqtt', function($rootScope) {
    $rootScope.serial_number = "test_serial";
    var random_string_id_thing = Math.floor(Math.random() * (1000 - 0 + 1)) + 1000;
    var Mqtt_service = new Paho.MQTT.Client("ekg.westus.cloudapp.azure.com", 3002,random_string_id_thing.toString()  );
    var serial_number = $rootScope.serial_number;
    /** Options for the connection */
    var mqtt_options = {
        timeout: 3,
        onSuccess: function () {
            console.log("mqtt connected");
            // Connection succeeded; subscribe to our topic, you can add multile lines of these
            Mqtt_service.subscribe('/zc/' + serial_number + '/#', {qos: 1});
            initmessage = new Paho.MQTT.Message("connect");
            initmessage.destinationName = "/zc/" + serial_number +"/";
            Mqtt_service.send(initmessage);
        },
        onFailure : function (err) {
            console.log('problem connecting.' + err);
        }
    };
    
    /** when we loose a connection. */
    Mqtt_service.onConnectionLost = function(err){
        console.log('connection lost' + JSON.stringify(err));
    };
    
    Mqtt_service.onMessageArrived = function(payload) {
        /** If it is a node message.  */
        if (payload.destinationName == "/zc/"+serial_number+"/node/" && payload.payloadString != "done") {
            node = JSON.parse(payload.payloadString);
            if (!$rootScope.nodes) { $rootScope.nodes = []}
                $rootScope.nodes[node._id-1] = node;
            }
            
        /** Inclusion mode message.  */
        else if (payload.destinationName == "/zc/"+serial_number+"/current_inclusion_mode/"){
                if(payload.payloadString == 'off'){
                    $rootScope.inclusionmode = false;
                }else if(payload.payloadString == 'on'){
                    $rootScope.inclusionmode = true;
                }
        }
        
        /** Alarm message. */
        else if (payload.destinationName == "/zc/"+serial_number+"/alarm/" && payload.payloadString != "done") {
            alarm = JSON.parse(payload.payloadString);
            if (!$rootScope.alarms) { $rootScope.alarms = [] }
            $rootScope.alarms[alarm._id-1] = alarm;
        }
        
        /** Timer Message */
        else if (payload.destinationName == "/zc/"+serial_number+"/timer/" && payload.payloadString != "done") {
            timer = JSON.parse(payload.payloadString);
            if (!$rootScope.timers) { $rootScope.timers = [] }
            $rootScope.timers[timer._id-1] = timer;
        }
        
        /** Apply a message */
        $rootScope.$apply();
    }

    // Do the connect. 
    Mqtt_service.connect(mqtt_options);
    return Mqtt_service;
});