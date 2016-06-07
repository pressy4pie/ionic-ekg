angular.module('app.controllers', [])
.controller('nodesCtrl', function($scope, Mqtt) {  
    $scope.node_info={};
    $scope.node_folded={};
    
    /** display the edit info box.  */
    $scope.handle_node_info = function(node_id){
        if($scope.node_info[node_id] == null){ $scope.node_info[node_id] = false; }
        if($scope.node_info[node_id] == true){
            $scope.node_info[node_id] = false;
        }else if( $scope.node_info[node_id] == false ){
            $scope.node_info[node_id] = true;
        }       
    };
    
    /** update the node display name. */
    $scope.update_node_display_name = function(node_id, display_name) {
        if(display_name != null ){
            var msg = {'node_id': node_id, 'diaplayName': display_name };
            message = new Paho.MQTT.Message( JSON.stringify(msg) ) ;
            message.destinationName = "/zc/test_serial/update_node_display_name/";
            Mqtt.send(message);
            $scope.reboot_node(node_id);
        }
    };
    
    /** folds this node in display if you click the fold button. */
    $scope.handle_node_folding = function(node_id){
        if($scope.node_folded[node_id] == null){ $scope.node_folded[node_id] = false; }
        if($scope.node_folded[node_id] == true){
            $scope.node_folded[node_id] = false;
        }else if( $scope.node_folded[node_id] == false ){
            $scope.node_folded[node_id] = true;
        }       
    };
    /** update the hb frequency until the node is declared dead.  */
    $scope.update_node_hb_freq = function(node_id, hb_freq) {
        if(hb_freq != null){
            
        }
    }
    
    /** displays green node header if the node is alive, or red if not. */
    $scope.handle_node_alive = function(is_node_alive,node_id){
      if(is_node_alive) return 'bar-balanced';
      else {
          $scope.node_folded[node_id] = true;
          return 'bar-assertive' ;
      }
    };
    
    /** turn on inclusion mode. */
    $scope.force_inclusion_mode = function(){
        var msg = 'set';
        var message = new Paho.MQTT.Message( msg ) ;
        message.destinationName = '/zc/' + "test_serial" + "/set_inclusion_mode/";
        Mqtt.send(message);
    };
    
    /** reboot the node. */
    $scope.reboot_node = function(node_id){
        var msg = {'node_id': node_id};
        message = new Paho.MQTT.Message( JSON.stringify(msg) ) ;
        message.destinationName = "/zc/test_serial/reboot_node/";
        Mqtt.send(message);
    }
    
    /** changes the inclusion button color depending on the current inclusion mode.  */
    $scope.get_current_inclusion_mode = function(){
        if($scope.inclusionmode == true) {
            //Make the button green when inclusion mode is enabled.
            var button = 'button-balanced';
            var button_text = 'Including';            
        } else {
            var button =  'button-dark';
            var button_text = 'Inclusion Mode';
        }
        return {
            button_color : button,
            button_text : button_text
        };
    };
    
    /** change the color of a boolean button. (not toggle switch.) */
    $scope.get_boolean_button_color = function(value){
        if(parseInt(value) == 1){
            return 'button-balanced';
        }else{
            return 'button-dark';
        }
    };
    
    /** Send a 1 get a 0. */
    $scope.invert_boolean_value = function(value){
        if(parseInt(value) == 1){
            return 0;
        } else if(parseInt(value) == 0) {
            return 1;
        }
    };
    
    /** Update a boolean value.  */
    $scope.update_boolean_sensor_var = function(nodeid,sensorid,vartype,value){
        var msg = {'node_id': nodeid, 'sensor_id' : sensorid, 'payload': value, 'msg_cmd': 1, 'msg_type' :vartype };
        message = new Paho.MQTT.Message( JSON.stringify(msg) ) ;
        message.destinationName = "/zc/test_serial/update_sensor_variable/";
        Mqtt.send(message);
    };
    
    /** return the type of sensor based on mymessage.h/mymessage.js */
    $scope.check_sensor_type = function(sensor_type){
        switch(sensor_type){
            case 5:
                return 'cover';
            case 3:
                return 'binary';
        }
    };
    
    /** return the type of variable according to mymessage.h */
    $scope.vartype_toString = function(var_type, value){
        switch(parseInt(var_type)){
            case 29:
                return 'MOTORS UP  ';
            case 30:
                return 'MOTORS DOWN  ';
            case 31: 
                return 'STOP MOTORS  ';
            case 2: 
                return 'SMART SWITCH'
            default:
                return 'UNSORTED OR UNKNOWN ' + var_type;
        }
    }; 
    
    /** send 1 return ON */
    $scope.boolean_toString = function(bool_value){
        switch(bool_value){
            case 1: return 'ON';
            case 0: return 'OFF';
        }
    };
    
    /** Display a date according to the epoch_time */
    $scope.get_date = function(epoch_time){
        var eDate = new Date(parseFloat(epoch_time));
        var nowDate = Date.now();
        var this_time = (nowDate - eDate);
        var hours = Math.floor(this_time / 3600000);
        var minutes = Math.floor(this_time / 60000);
        var seconds = ((this_time % 60000) / 1000).toFixed(0);
        
        if( minutes > 10 ){
            if( minutes < 60){
               return minutes  + " minutes ago" ; 
            }
            else if(minutes > 60){
                return hours + " hours ago";
            }
        }
        else if( minutes < 10 ){ // like two minutes i guess. 
            return 'NOW';
        } 
        else {
            return eDate.getHours() + " : " + eDate.getMinutes() + " " + eDate.toDateString();
        } 
    }
    
    /** if the node is or isn't alive and return a string accordingly. */
    $scope.get_node_alive_status = function(alive_or_dead){
        if(alive_or_dead == false){
            return 'NODE NOT RESPONDING';
        }
    }
    
    /** Display the units of a node variable type */
    $scope.parse_var_and_value = function(variable, value){
        switch(parseInt(variable)){
            case 0:
                return value + " Degrees";
            case 1:
                return value + "%";
            case 37: 
                return value + " Lumins";
            
        }
    }
    
})

/** ALARMS */
.controller('alarmsCtrl', function($scope, Mqtt) {
    initmessage = new Paho.MQTT.Message("get");
    initmessage.destinationName = "/zc/test_serial/get_alarms/";
    Mqtt.send(initmessage); 
})

/** TIMERS */
.controller('timersCtrl',function($scope,Mqtt){
    initmessage = new Paho.MQTT.Message("get");
    initmessage.destinationName = "/zc/test_serial/get_timers/";
    Mqtt.send(initmessage);    
})

.controller('weatherCtrl', function($scope){
    
});