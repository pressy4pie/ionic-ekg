angular.module('app.controllers', [])
  
.controller('nodesCtrl', function($scope, Mqtt) {
    var options = {
      timeout: 3,
      onSuccess: function () {
        console.log("mqtt connected");
        // Connection succeeded; subscribe to our topic, you can add multile lines of these
        Mqtt.subscribe('/zc/test_serial/#', {qos: 1});
        initmessage = new Paho.MQTT.Message("connect");
        initmessage.destinationName = "/zc/test_serial/";
        Mqtt.send(initmessage);
      },
      onFailure: function (message) {
        console.log("Connection failed: " + message.errorMessage);
      }
    };
    Mqtt.connect(options);

    Mqtt.onMessageArrived = function(payload) {
        if (payload.destinationName == "/zc/test_serial/node/" && payload.payloadString != "done") {
            console.log('getting node');
            node = JSON.parse(payload.payloadString);
            if (!$scope.nodes) { $scope.nodes = []}
            $scope.nodes[node._id-1] = node;
        }
        $scope.$apply();
    };
});