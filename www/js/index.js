/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {

    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById("deviceready").addEventListener('click', this.takePhoto);
    },


    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    undoReceivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        console.log('a');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:none;');

        console.log('UnReceived Event: ' + id);
    },
    onSuccess: function(acceleration) {

        if (Math.abs(9.81 - acceleration.z) <= .2) {

            app.receivedEvent('deviceready');
        } else {
            app.unReceivedEvent('deviceready');
            console.log(acceleration.x);
            console.log(acceleration.y);
            
        }
        //alert(acceleration.z);
    },

    onError: function() {
        console.log('Accellerometer problem - Device might not have accellerometer');

    },


    onDeviceReady: function() {
        var options = { frequency: 1000 }; // Update every 1 second
        navigator.accelerometer.watchAcceleration(this.onSuccess, this.onError, options);
    },
    takePhoto: function() {
        function cameraSuccess(imageData) {
            var image = document.getElementById('myImage');
            image.src = "data:image/jpeg;base64," + imageData;
        }

        function cameraError(message) {
            console.log(message);
        }
        navigator.camera.getPicture(cameraSuccess, cameraError);
    }

};

app.initialize();