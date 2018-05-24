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

// const ImageParser = require("image-parser");
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById("border").addEventListener('click', this.takePhoto);
        document.getElementById("right-navbar").addEventListener('click', this.restartCameraView);
        // this.initCameraView();
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
        screen.orientation.lock('portrait-primary');
        var cameraView = document.getElementById('camera-interface');
        cameraView.style.display = "block";
        var analyzeView = document.getElementById('analyze-interface');
        analyzeView.style.display = "none";
        CameraPreview.show();
        document.getElementById("border").style.position = "absolute";
        document.getElementById("border").style.display = "block";
    },
    // initCameraView: function() {
        
        

    // },
    restartCameraView: function() {

        window.addEventListener("deviceorientation", this.handleOrientation, true);
        var image = document.getElementById('my-image');
        image.src = "#";
        var canvas = document.getElementById("canvasMan");
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        var analyzeView = document.getElementById('analyze-interface');
        var cameraView = document.getElementById('camera-interface');
        var rightIcon = document.getElementById('right-icon')
        
        cameraView.style.display = "block";
        cameraView.style.color = "rgba(0,0,0,0)";
        document.getElementById("border").style.position = "absolute";
        document.getElementById("border").style.display = "block";
        document.getElementById("main-text").innerHTML = "Calculating";
        analyzeView.style.display = "none";
        CameraPreview.show();

    },
    initAnalyzeView: function() {
        //window.removeEventListener("deviceorientation", this.handleOrientation, true);
        var cameraView = document.getElementById('camera-interface');
        cameraView.style.display = "none";
        var analyzeView = document.getElementById('analyze-interface');
        analyzeView.style.display = "block";

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
        var rightIcon = document.getElementById('right-icon');
        if (document.getElementById('analyze-interface').style.display == "none") {
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
                } else {
                    rightIcon.classList.add("fas");
                    rightIcon.classList.add("fa-spin");
                    rightIcon.classList.add("fa-sync");
                    rightIcon.classList.remove("far");
                    rightIcon.classList.remove("fa-check-circle");
                }

                if (gamma > 0) { // Left/Right
                    left.style.color = "rgba(63, 140, 233," + (gamma / 8).toString() + ")"; //Left
                    right.style.color = "rgba(63, 140, 233,0)";
                } else {
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
        } else {
            border.style.borderColor = "rgba(63, 140, 233,0)";
            rightIcon.classList.add("fas");
            rightIcon.classList.add("fa-redo");
            rightIcon.classList.remove("far");
            rightIcon.classList.remove("fa-check-circle");
        }


    },
    startCameraAbove: function() {
        CameraPreview.startCamera({ x: 0, y: (window.screen.height * .1), width: window.screen.width, height: (window.screen.height * .9), toBack: true, previewDrag: false, tapPhoto: false });
        CameraPreview.setFlashMode(CameraPreview.FLASH_MODE.OFF);
    },

    stopCamera: function() {
        CameraPreview.stopCamera();
    },
    
    takePhoto: function() {
        console.log("recognized func");
        if (document.getElementById('right-icon').classList.contains("fa-check-circle") == true) {
            console.log("eventtriggered");
            CameraPreview.takePicture(function(base64PictureData) {
                /* code here */
                
                imageSrcData = 'data:image/jpeg;base64,' + base64PictureData;
                console.log("1")
                cameraSuccess(imageSrcData);
            });


            function cameraSuccess(imageURI) {
                // import ImageParser from 'js/image-parser.js';
                // Display the image we just took,  replace the picture taking element with a restart 
                // button, and give the canopy cover value
                console.log("2");

                var image = document.getElementById('my-image');
                var analyzeView = document.getElementById('analyze-interface');
                var cameraView = document.getElementById('camera-interface');

                cameraView.style.display = "none";
                cameraView.style.color = "rgba(0,0,0,0)";
                document.getElementById("border").style.position = "static";
                document.getElementById("border").style.display = "none";
                document.getElementById("main-text").innerHTML = "Calculating";
                analyzeView.style.display = "block";
                console.log("3");
                CameraPreview.hide();
                // Image Working
                console.log("4");
                image.src = imageURI;
                console.log("5");
                image.onload = function() {
                    console.log("6");
                    var canvas = document.getElementById("canvasMan");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    console.log("7");
                    ctx = canvas.getContext('2d');
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                    percent_cover = processPhoto(canvas);
                    canvas.style = image.style;
                    document.getElementById("main-text").innerHTML = percent_cover.toFixed(2) + "% Canopy Cover";
                    image.style.display = "none";
                };

            }

            function processPhoto(canvas) {
                var percent_cover = 0.00;
                var RED_CUTOFF = 0;
                var GREEN_CUTOFF = 0;
                var BLUE_CUTOFF = 200;
                count_canopy = 0;
                total_size = canvas.width * canvas.height;
                console.log(total_size);
                for (i = 0; i < canvas.width; i++) {
                    for (j = 0; j < canvas.height; j++) {
                        Data = ctx.getImageData(i, j, 1, 1).data;
                        // var HSV_Data = rgbToHsv(Data[0], Data[1], Data[2]);
                        // var Hue = HSV_Data[0];
                        // var Saturation = HSV_Data[1];
                        // var Brightness = HSV_Data[2];
                        if ((Data[0] < RED_CUTOFF) || (Data[1] < GREEN_CUTOFF) || (Data[2] < BLUE_CUTOFF)) {
                            // console.log("Hue: " + HSV_Data.h + ". Saturation: " + HSV_Data.s + ". Brightness: " + HSV_Data.v);
                            // (Brightness <= 50) && 
                            // if ((Hue >= 170 && Hue =< 250) && (Saturation < 10)) {
                                // ctx.fillStyle = "red";
                                // ctx.fillRect(i, j, 1, 1);
                                // ctx.stroke()
                            count_canopy += 1;
                        } else {
                            ctx.fillStyle = "red";
                            ctx.fillRect(i, j, 1, 1);
                            ctx.stroke();
                        }
                    }
                }
                percent_cover = (count_canopy / total_size) * 100;
                return (percent_cover);
            }
            function rgbToHsv(r, g, b) {  //From https://gist.github.com/mjackson/5311256
                r /= 255, g /= 255, b /= 255;
              
                var max = Math.max(r, g, b), min = Math.min(r, g, b);
                var h, s, v = max;
              
                var d = max - min;
                s = max == 0 ? 0 : d / max;
              
                if (max == min) {
                  h = 0; // achromatic
                } else {
                  switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                  }
              
                  h /= 6;
                }
              
                return [ h, s, v ];
              }
        }
    },

};

app.initialize();