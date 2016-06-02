angular.module('app.controllers', [])
  
.controller('nodesCtrl', function($scope, Mqtt) {
    Mqtt.on('connecting', function(){
        console.log('MQTT connecting.');
    });
    
    Mqtt.on('connect', function(){
        Mqtt.subscribe('/zc/test_serial/#', 1, function(error, granted) {
            if (error) {
                console.log("Unable to subscribe. Error: " + error);
            }
            console.log("Subscribed, granted QoS of: " + granted);
            Mqtt.publish("get", "/zc/test_serial/get_nodes/",
            {
                qos: 1
            },
                function () {
                    console.log("Get message sent.");
                }
            
            );
        });
        console.log('MQTT connected.');
    });
    Mqtt.on('disconnect', function(){
        console.log('MQTT disconnected.');
    });
    Mqtt.on('offline', function(){
        console.log('MQTT offline. Reconnect manually.');
    });
    
    Mqtt.on('message', function(topic, payload, details) {
        if (topic == "/zc/test_serial/node/" && payload != "done") {
            node = JSON.parse(payload);
            if (!$scope.nodes) { $scope.nodes = []}
            $scope.nodes[node._id-1] = node;
        }
        $scope.$apply();
    });
    Mqtt.connect();
})
   
.controller('alarmsCtrl', function($scope, Mqtt) {

})
   
.controller('timersCtrl', function($scope, Mqtt) {

})
    