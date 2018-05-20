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
        document.getElementById("right-navbar").addEventListener('click', this.restartCameraView);
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
        this.initCameraView();
    },
    initCameraView: function() {
        window.addEventListener("deviceorientation", this.handleOrientation, true);
        screen.orientation.lock('portrait-primary');
        console.log("hi");
        var cameraView = document.getElementById('camera-interface');
        cameraView.style.display = "block";
        var analyzeView = document.getElementById('analyze-interface');
        analyzeView.style.display = "none";
        CameraPreview.show();
        document.getElementById("border").style.position = "absolute";
        document.getElementById("border").style.display = "block";

    },
    restartCameraView: function() {

        window.addEventListener("deviceorientation", this.handleOrientation, true);

        var image = document.getElementById('my-image');
        var analyzeView = document.getElementById('analyze-interface');
        var cameraView = document.getElementById('camera-interface');
        var rightIcon = document.getElementById('right-icon')

        cameraView.style.display = "block";
        cameraView.style.color = "rgba(0,0,0,0)";
        document.getElementById("border").style.position = "absolute";
        document.getElementById("border").style.display = "block";
        document.getElementById("main-text").innerHTML = "Calculating";
        analyzeView.style.display = "none";
        console.log(analyzeView.style.display);
        CameraPreview.show();



    },
    initAnalyzeView: function() {
        window.removeEventListener("deviceorientation", this.handleOrientation, true);
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
        } else {
            border.style.borderColor = "rgba(63, 140, 233,0)";
            rightIcon.classList.add("fas");
            rightIcon.classList.add("fa-redo");
            rightIcon.classList.remove("far");
            rightIcon.classList.remove("fa-check-circle");
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


    takePhoto: function() {
        console.log("recognized func");
        if (document.getElementById('right-icon').classList.contains("fa-check-circle") == true) {
            CameraPreview.takePicture(function(base64PictureData) {
                /* code here */
                imageSrcData = 'data:image/jpeg;base64,' + base64PictureData;
                cameraSuccess(imageSrcData);
            });

            function cameraSuccess(imageURI) {
                // import ImageParser from 'js/image-parser.js';
                // Display the image we just took,  replace the picture taking element with a restart 
                // button, and give the canopy cover value
                console.log("reached");

                var image = document.getElementById('my-image');
                var analyzeView = document.getElementById('analyze-interface');
                var cameraView = document.getElementById('camera-interface');

                cameraView.style.display = "none";
                cameraView.style.color = "rgba(0,0,0,0)";
                document.getElementById("border").style.position = "static";
                document.getElementById("border").style.display = "none";
                document.getElementById("main-text").innerHTML = "Calculating";
                analyzeView.style.display = "block";
                console.log(analyzeView.style.display);
                CameraPreview.hide();
                // Image Working
                image.src = imageURI;
                image.onload = function() {
                    var canvas = document.getElementById("canvasMan");
                    canvas.width = image.width;
                    canvas.height = image.height;
                    ctx = canvas.getContext('2d')
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                    percent_cover = processPhoto(canvas)
                    canvas.style = image.style;
                    document.getElementById("main-text").innerHTML = percent_cover.toFixed(2) + "% Canopy Cover";
                    image.style.display = "none";
                };

            }

            function processPhoto(canvas) {
                var percent_cover = 0.00;
                var RED_CUTOFF = 0;
                var GREEN_CUTOFF = 0;
                var BLUE_CUTOFF = 150;
                count_canopy = 0;
                total_size = canvas.width * canvas.height;
                for (i = 0; i < canvas.width; i++) {
                    for (j = 0; j < canvas.height; j++) {
                        Data = ctx.getImageData(i, j, 1, 1).data;
                        var HSV_Data = rgb2hsv(Data[0], Data[1], Data[2]);
                        var Hue = HSV_Data.h
                        var Saturation = HSV_Data.s;
                        var Brightness = HSV_Data.v;
                        // if ((Data[0] < RED_CUTOFF) || (Data[1] < GREEN_CUTOFF) || (Data[2] < BLUE_CUTOFF)) {
                        if ((Brightness <= 0.5) && (Hue < 170 || Hue > 250) && (Saturation > 13)) {
                            count_canopy += 1;
                        } else {
                            ctx.fillStyle = "white";
                            ctx.fillRect(i, j, 1, 1);
                            ctx.stroke();
                        }
                    }
                }
                percent_cover = (count_canopy / total_size) * 100;
                return (percent_cover);
            }

            function rgb2hsv() { // From https://stackoverflow.com/questions/8022885/rgb-to-hsv-color-in-javascript?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
                var rr, gg, bb,
                    r = arguments[0] / 255,
                    g = arguments[1] / 255,
                    b = arguments[2] / 255,
                    h, s,
                    v = Math.max(r, g, b),
                    diff = v - Math.min(r, g, b),
                    diffc = function(c) {
                        return (v - c) / 6 / diff + 1 / 2;
                    };

                if (diff == 0) {
                    h = s = 0;
                } else {
                    s = diff / v;
                    rr = diffc(r);
                    gg = diffc(g);
                    bb = diffc(b);

                    if (r === v) {
                        h = bb - gg;
                    } else if (g === v) {
                        h = (1 / 3) + rr - bb;
                    } else if (b === v) {
                        h = (2 / 3) + gg - rr;
                    }
                    if (h < 0) {
                        h += 1;
                    } else if (h > 1) {
                        h -= 1;
                    }
                }
                return {
                    h: Math.round(h * 360),
                    s: Math.round(s * 100),
                    v: Math.round(v * 100)
                };
            }

            function cameraError(message) {
                console.log('Failed because: ' + message);
            }


        }
    },

};

app.initialize();