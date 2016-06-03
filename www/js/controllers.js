angular.module('app.controllers', [])
.controller('nodesCtrl', function($scope, Mqtt) {     
    Mqtt.onMessageArrived = function(payload) {
        if (payload.destinationName == "/zc/test_serial/node/" && payload.payloadString != "done") {
            node = JSON.parse(payload.payloadString);
            if (!$scope.nodes) { $scope.nodes = []}
            $scope.nodes[node._id-1] = node;
        }
        $scope.$apply();
    };
    
    $scope.update_boolean_sensor_var = function(nodeid,sensorid,vartype,value){
        var msg = {'node_id': nodeid, 'sensor_id' : sensorid, 'displpayloadayName': value, 'msg_cmd': 1, 'msg_type' :vartype };
        message = new Paho.MQTT.Message( JSON.stringify(msg) ) ;
        message.destinationName = "/zc/test_serial/update_sensor_variable/";
        Mqtt.send(message);
    };
    
    $scope.check_sensor_type = function(sensor_type){
        switch(sensor_type){
            case 5:
                return 'cover';
            case 3:
                return 'binary';
        }
    };
    
    $scope.vartype_toString = function(var_type, value){
        switch(parseInt(var_type)){
            case 29:
                if(parseInt(value) == 1){
                    return 'UP *'
                }
                return 'UP  ';
            case 30:
                if(parseInt(value) == 1){
                    return 'DOWN *'
                }
                return 'DOWN  ';
            case 31: 
                if(parseInt(value) == 1){
                    return 'STOP *'
                }
                return 'STOP  ';
            default:
                return 'UNSORTED OR UNKNOWN';
        }
    }; 
    
    $scope.boolean_toString = function(bool_value){
        switch(bool_value){
            case 1: return 'ON';
            case 0: return 'OFF';
        }
    };
    
    $scope.update_node_name = function(node_id, newName){
        console.log (node_id, newName);
    }
    
    $scope.get_date = function(epoch_time){
        var eDate = new Date(parseFloat(epoch_time));
        if( (eDate - Date.now() ) < 120000 ){ // like two minutes i guess. 
            return 'NOW';
        }
        else{
            return eDate.getHours() + " : " + eDate.getMinutes() + " " + eDate.toDateString();
        } 
    }
    
    $scope.get_node_alive_status = function(alive_or_dead){
        if(alive_or_dead == false){
            return 'NODE NOT RESPONDING';
        }
    }
})
.controller('alarmsCtrl', function($scope, Mqtt) {
    initmessage = new Paho.MQTT.Message("get");
            initmessage.destinationName = "/zc/test_serial/get_alarms/";
            Mqtt.send(initmessage); 
    Mqtt.onMessageArrived = function(payload) {
        if (payload.destinationName == "/zc/test_serial/alarm/" && payload.payloadString != "done") {
            alarm = JSON.parse(payload.payloadString);
            if (!$scope.alarms) { $scope.alarms = []}
            $scope.alarms[alarm._id-1] = alarm;
        }
        $scope.$apply();
    };
});
