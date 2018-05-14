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
        document.getElementById("border").addEventListener('click', this.takePhoto);
        document.getElementById("restart-button").addEventListener('click', this.restartApp);
        this.initCameraView();
    },
    // deviceSynced: Boolean() = false,
    // 0 == 
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

    onDeviceReady: function() {
        var options = {
            frequency: 10
        }; // Update every .05 seconds
        this.startCameraAbove();
        window.addEventListener("deviceorientation", this.handleOrientation, true);
    },
    initCameraView: function() {
        var cameraView = document.getElementById('camera-interface');
        cameraView.display = "block";
        var analyzeView = document.getElementById('analyze-interface');
        analyzeView.display = "none";

    },
    initAnalyzeView: function() {
        var cameraView = document.getElementById('camera-interface');
        cameraView.display = "none";
        var analyzeView = document.getElementById('analyze-interface');
        analyzeView.display = "block";

    },
    handleOrientation: function(event) {
        var absolute = event.absolute;
        var alpha = event.alpha; // yaw
        var beta = event.beta; // pitch
        var gamma = event.gamma; // roll

        var right = document.getElementById('right');
        var left = document.getElementById('left');
        var up = document.getElementById('up');
        var down = document.getElementById('down');
        var border = document.getElementById("border");

        var straight = Math.abs(beta) < 2 && Math.abs(gamma) < 2;
        var rightIcon = document.getElementById('right-icon')
        if (straight) {
            left.style.color = "rgba(63, 140, 233,0)";
            right.style.color = "rgba(63, 140, 233,0)";
            up.style.color = "rgba(63, 140, 233,0)";
            down.style.color = "rgba(63, 140, 233,0)";
            border.style.borderColor = "rgba(63, 140, 233,1)";
            rightIcon.classList.remove("fas");
            rightIcon.classList.remove("fa-spin");
            rightIcon.classList.remove("fa-sync");
            rightIcon.classList.add("far");
            rightIcon.classList.add("fa-check-circle");
            // this.deviceSynced = true;
            app.receivedEvent('deviceready');
        } else {
            // this.deviceSynced = false;
            border.style.borderColor = "rgba(63, 140, 233,0)";
            if (rightIcon.classList.contains("fa-spin") == true) {
                console.log("true");
            } else {
                rightIcon.classList.add("fas");
                rightIcon.classList.add("fa-spin");
                rightIcon.classList.add("fa-sync");
                rightIcon.classList.remove("far");
                rightIcon.classList.remove("fa-check-circle");
            }
            console.log(gamma / 4)

            if (gamma > 0) { // Left/Right
                console.log("moister")
                left.style.color = "rgba(63, 140, 233," + (gamma / 8).toString() + ")"; //Left
                right.style.color = "rgba(63, 140, 233,0)";
            } else {
                console.log("cloister");
                right.style.color = "rgba(63, 140, 233," + (-1 * gamma / 8).toString() + ")"; //Right
                left.style.color = "rgba(63, 140, 233,0)";
            }

            if (beta > 0) { //Up/Down
                up.style.color = "rgba(63, 140, 233," + (beta / 8).toString() + ")"; //Down
                down.style.color = "rgba(63, 140, 233,0)";
            } else {
                down.style.color = "rgba(63, 140, 233," + (-1 * beta / 8).toString() + ")"; //Up
                up.style.color = "rgba(63, 140, 233,0)";
            }
        }

    },

    restartApp: function() {
        var image = document.getElementById('myImage');
        var photoButton = document.getElementById('deviceready');
        var restartButton = document.getElementById('restart-button');
        image.setAttribute('style', 'display:none;');
        photoButton.setAttribute('style', 'display:block;');
        restartButton.setAttribute('style', 'display:none;');
        document.getElementById("main-text").innerHTML = "Take a Photo to Begin";
    },
    startCameraAbove: function() {
        CameraPreview.startCamera({ x: 0, y: (window.screen.height * .1), width: window.screen.width, height: (window.screen.height * .9), toBack: true, previewDrag: false, tapPhoto: false });
        CameraPreview.setFlashMode(CameraPreview.FLASH_MODE.OFF);
    },

    stopCamera: function() {
        CameraPreview.stopCamera();
    },

    takePicture: function() {
        CameraPreview.takePicture(function(imgData) {
            // document.getElementById('originalPicture').src = 'data:image/jpeg;base64,' + imgData;
        });
    },

    takePhoto: function() {
        console.log("recognized func");
        if (document.getElementById('right-icon').classList.contains("fa-check-circle") == true) {
            CameraPreview.takePicture(function(base64PictureData){
                /* code here */
                console.log("passed");
                imageSrcData = 'data:image/jpeg;base64,' +base64PictureData;
                cameraSuccess(imageSrcData);
            });

            function cameraSuccess(imageURI) {
                // import ImageParser from 'js/image-parser.js';
                // Display the image we just took,  replace the picture taking element with a restart 
                // button, and give the canopy cover value
                console.log("reached");
                var cameraView = document.getElementById('camera-interface');
                cameraView.display = "none";
                var analyzeView = document.getElementById('analyze-interface');
                analyzeView.display = "block";
                var image = document.getElementById('my-image');
                // var photoButton = document.getElementById('deviceready');
                // var restartButton = document.getElementById('restart-button');
                image.src = imageURI;
                // Style Changes
                image.setAttribute('style', 'display:block;');
                // photoButton.setAttribute('style', 'display:none;');
                // restartButton.setAttribute('style', 'display:block;');
                document.getElementById("main-text").innerHTML = "Calculating";

                // Image Working
                image.src = imageURI;
                var percent_cover = 0.00;
                var RED_CUTOFF = 200;
                var GREEN_CUTOFF = 150;
                var BLUE_CUTOFF = 200;
                console.log("hi")
                    // var require: 'image-parser';
                    // let ImageParser = require("image-parser");
                let img = new ImageParser(imageURI);
                console.log("hi");
                img.parse(err => {
                    if (err) {
                        return console.error(err);
                    }
                    console.log(img.getPixel(3, 3));
                    // PixelClass { r: 34, g: 30, b: 31, a: 1 }
                    var total_size = img.width() * img.height();
                    var count_canopy = 0;
                    for (i = 0; i < img.width(); i++) {
                        for (j = 0; j < img.height(); j++) {
                            if ((img.getPixel(i, j).r < RED_CUTOFF) || (img.getPixel(i, j).g < GREEN_CUTOFF) || (img.getPixel(i, j).b < BLUE_CUTOFF)) {
                                count_canopy += 1;
                            }
                        }
                    }
                    percent_cover = Math.round(count_canopy / total_size);
                });
                document.getElementById("main-text").innerHTML = percent_cover.toString() + "% Canopy Cover";
            }

            function cameraError(message) {
                console.log('Failed because: ' + message);
            }


        }
    },

};

app.initialize();