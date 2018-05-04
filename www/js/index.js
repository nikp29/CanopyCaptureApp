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
        document.getElementById("restart-button").addEventListener('click', this.restartApp);
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

    },

    onSuccess: function(acceleration) {

        if (Math.abs(9.81 - acceleration.z) <= .2) {

            app.receivedEvent('deviceready');

        } else {
            var id = 'deviceready'
            var parentElement = document.getElementById(id);
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');
            listeningElement.setAttribute('style', 'display:block;');
            receivedElement.setAttribute('style', 'display:none;');

        }
        //alert(acceleration.z);
    },

    onError: function() {
        console.log('Accellerometer problem - Device might not have accellerometer');

    },


    onDeviceReady: function() {
        var options = { frequency: 50 }; // Update every .05 seconds
        navigator.accelerometer.watchAcceleration(this.onSuccess, this.onError, options);
    },
    
    restartApp: function(){
        var image = document.getElementById('myImage');
        var photoButton = document.getElementById('deviceready');
        var restartButton = document.getElementById('restart-button');
        image.setAttribute('style', 'display:none;');
        photoButton.setAttribute('style', 'display:block;');
        restartButton.setAttribute('style', 'display:none;');
        document.getElementById("main-text").innerHTML = "Take a Photo to Begin";
    },

    takePhoto: function() {
        console.log("recognized func");
        if (document.getElementById('phone-straight').style.display == "block") {
            navigator.camera.getPicture(cameraSuccess, cameraError, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI
            });
            
            function cameraSuccess(imageURI) {
                // Display the image we just took,  replace the picture taking element with a restart 
                // button, and give the canopy cover value
                var image = document.getElementById('myImage');
                var photoButton = document.getElementById('deviceready');
                var restartButton = document.getElementById('restart-button');
                image.setAttribute('style', 'display:block;');
                image.src = imageURI;
                photoButton.setAttribute('style', 'display:none;');
                restartButton.setAttribute('style', 'display:block;');
                document.getElementById("main-text").innerHTML = "__% Canopy Cover";
            }

            function cameraError(message) {
                console.log('Failed because: ' + message);
            }
            
            
        }
    }

};

app.initialize();