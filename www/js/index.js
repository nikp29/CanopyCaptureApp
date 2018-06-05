// Copyright 2018, Nikhil Patel and Billy Pierce. All Rights Reserved.
var app = {
    // Application Constructor
    initialize: function() { // Add Events listener once the application is initialized.
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById("border").addEventListener('click', this.takePhoto);
        document.getElementById("right-navbar").addEventListener('click', this.restartCameraView);
    },
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    // Update DOM on a Received Event
    receivedEvent: function(id) { // Take a received element and change the display of its various elements
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
        this.startCameraAbove(); // Start the Camera.
        window.addEventListener("deviceorientation", this.handleOrientation, true); // Handle the device orientation.
        screen.orientation.lock('portrait-primary'); // Lock to straight orientation
        var cameraView = document.getElementById('camera-interface'); //Default to camera view.
        cameraView.style.display = "block";
        var analyzeView = document.getElementById('analyze-interface');
        analyzeView.style.display = "none";
        CameraPreview.show(); // Start the active camera preview
        document.getElementById("border").style.position = "absolute";
        document.getElementById("border").style.display = "block";
    },

    restartCameraView: function() {

        window.addEventListener("deviceorientation", this.handleOrientation, true); // When the camera is restarted, readd the event listener.
        var image = document.getElementById('my-image');
        image.src = "#"; // Reset the image source.
        var canvas = document.getElementById("canvasMan");
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        // Reset to camera view (per the function name)
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
    initAnalyzeView: function() { // Initialize a view of the camera.
        var cameraView = document.getElementById('camera-interface');
        cameraView.style.display = "none";
        var analyzeView = document.getElementById('analyze-interface');
        analyzeView.style.display = "block";

    },
    handleOrientation: function(event) { // When the image orients, deal with it.
        var absolute = event.absolute;
        var alpha = event.alpha; // yaw
        var beta = event.beta; // pitch
        var gamma = event.gamma; // roll

        var right = document.getElementById('right');
        var left = document.getElementById('left');
        var up = document.getElementById('up');
        var down = document.getElementById('down');
        var border = document.getElementById("border");
        var prompt1 = document.getElementById("prompt-text1");
        var prompt2 = document.getElementById("prompt-text2");
        var promptBox = document.getElementById('prompt-box');

        var straight = Math.abs(beta) < 2 && Math.abs(gamma) < 2; // If phone rotation is within 2.5 degrees, count it as striaght.
        var rightIcon = document.getElementById('right-icon');
        if (document.getElementById('analyze-interface').style.display == "none") { // If in the camera interface.
            
            promptBox.style.backgroundColor = "rgba(100,147,100,1)";
            promptBox.style.color = "rgba(255,255,1)";
            prompt1.style.color = "rgba(255,255,255,1)";
            prompt2.style.color = "rgba(255,255,255,1)";
            
            if (straight) { // If straight.
                prompt1.innerText = "Tap anywhere on camera";
                prompt2.innerText = "view to capture photo";
                promptBox.style.left = "calc(50% - 218.13px/2)";
                left.style.color = "rgba(100,147,100,0)"; // Set the opacity of the arrows to 0.
                right.style.color = "rgba(100,147,100,0)";
                up.style.color = "rgba(100,147,100,0)";
                down.style.color = "rgba(100,147,100,0)";
                border.style.borderColor = "rgba(100,147,100,1)"; // Light up the sides of the display.
                // Set the top-right icon to a check if straight.
                rightIcon.classList.remove("fas");
                rightIcon.classList.remove("fa-spin");
                rightIcon.classList.remove("fa-sync");
                rightIcon.classList.add("far");
                rightIcon.classList.add("fa-check-circle");
                // app.receivedEvent('deviceready'); // Set "deviceready" to received.
            } else {
                border.style.borderColor = "rgba(100,147,100,0)"; // Reset the border
                prompt1.innerText = "Follow the guiding arrows to";
                prompt2.innerText = "tilt phone until it is level";
                promptBox.style.left = "calc(50% - 240.13px/2)";
                if (!rightIcon.classList.contains("fa-spin")) { // If the top-right icon isn't already spinning, make it spin.
                    rightIcon.classList.add("fas");
                    rightIcon.classList.add("fa-spin");
                    rightIcon.classList.add("fa-sync");
                    rightIcon.classList.remove("far");
                    rightIcon.classList.remove("fa-check-circle");
                }

                if (gamma > 0) { // Set the Left/Right arrows based on the angle
                    // Phone titled to the right.
                    left.style.color = "rgba(100,147,100," + (gamma / 8).toString() + ")"; //Left
                    right.style.color = "rgba(100,147,100,0)";
                } else {
                    // Phone titled to the left.
                    right.style.color = "rgba(100,147,100," + (-1 * gamma / 8).toString() + ")"; //Right
                    left.style.color = "rgba(100,147,100,0)";
                }

                if (beta > 0) { // Set the Up/Down arrows based on the angle
                    // Phone titled towards the user.
                    up.style.color = "rgba(100,147,100," + (beta / 8).toString() + ")"; //Up
                    down.style.color = "rgba(100,147,100,0)";
                } else {
                    // Phone titled away from the user.
                    down.style.color = "rgba(100,147,100," + (-1 * beta / 8).toString() + ")"; //Down
                    up.style.color = "rgba(100,147,100,0)";
                }
            }
        } else {
            border.style.borderColor = "rgba(100,147,100,0)"; // If analyze-view, remove border.
            rightIcon.classList.add("fas"); // Change top-right for resetting option.
            rightIcon.classList.add("fa-redo");
            rightIcon.classList.remove("far");
            rightIcon.classList.remove("fa-check-circle");
        }


    },
    startCameraAbove: function() { // Start the camera preview.
        CameraPreview.startCamera({
            x: 0,
            y: (window.screen.height * .1),
            width: window.screen.width,
            height: (window.screen.height * .9),
            toBack: true,
            previewDrag: false,
            tapPhoto: false
        });
        CameraPreview.setFlashMode(CameraPreview.FLASH_MODE.OFF); // Turn off the flash.
    },

    stopCamera: function() { // Stop the camera.
        CameraPreview.stopCamera();
    },

    takePhoto: function() {
        if (document.getElementById('right-icon').classList.contains("fa-check-circle") == true) { // If the phone is straight.
            CameraPreview.takePicture(function(base64PictureData) {
                imageSrcData = 'data:image/jpeg;base64,' + base64PictureData;
                cameraSuccess(imageSrcData);
            });
        }

        function cameraSuccess(imageURI) {
            // Display the image we just took,  replace the picture taking element with a restart 
            // button, and give the canopy cover value
            var image = document.getElementById('my-image');
            var analyzeView = document.getElementById('analyze-interface');
            var cameraView = document.getElementById('camera-interface');
            var promptBox = document.getElementById('prompt-box');
            var prompt1 = document.getElementById("prompt-text1");
            var prompt2 = document.getElementById("prompt-text2");
            promptBox.style.backgroundColor = "rgba(100,147,100,0)";
            promptBox.style.color = "rgba(255,255,255,0)";
            prompt1.style.color = "rgba(255,255,255,0)";
            prompt2.style.color = "rgba(255,255,255,0)";
            cameraView.style.display = "none";
            cameraView.style.color = "rgba(0,0,0,0)";
            // Set to analyze view.
            document.getElementById("border").style.position = "static";
            document.getElementById("border").style.display = "none";
            document.getElementById("main-text").innerHTML = "Calculating";
            analyzeView.style.display = "block";
            CameraPreview.hide(); // Hide the camera preview.
            // Image Working
            image.src = imageURI;
            image.onload = function() {
                setupCanvas(image); // Setup the canvas from the loaded image.
            };
        }

        function setupCanvas(image) {
            var canvas = document.getElementById("canvasMan"); // Load our canvas.
            canvas.width = image.width; // Set the canvas width/height to match the image.
            canvas.height = image.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            percent_cover = processPhoto(canvas); // Calculate the percentcover from the canvas.
            canvas.style = image.style; // Set the canvas and image to the same style.
            document.getElementById("main-text").innerHTML = percent_cover.toFixed(2) + "% Canopy Cover";
            image.style.display = "none";
        }

        function processPhoto(canvas) { // Process the photo
            var count_canopy = 0;
            var ctx = canvas.getContext('2d');
            total_size = canvas.width * canvas.height;
            var imageDataObject = ctx.getImageData(0, 0, canvas.width, canvas.height); // Get image data from the canvas.
            var imageData = imageDataObject.data;
            for (index = 0; index < imageData.length; index += 4) { // Cycle through the image data in sets of RGBA
                var hsvData = rgbToHsv(imageData[index], imageData[index + 1], imageData[index + 2]); // Convert RGB to HSV for more accurate filtering.
                var x = canopyTest(hsvData);
                if (x == 0) { // Test the individual pixel.
                    count_canopy += 1;
                } else if (x==1) {
                    // Set non-canopy to red.
                    imageData[index] = 59;
                    imageData[index + 1] = 115;
                    imageData[index + 2] = 208;
                }
                else {
                    imageData[index] = 255;
                    imageData[index + 1] = 0;
                    imageData[index + 2] = 0;
                }
            }
            imageDataObject.data = imageData; // Set the image data to match the color filtering change.
            ctx.putImageData(imageDataObject, 0, 0); // Update the canvas.
            return (count_canopy / total_size) * 100; // Return the percent cover.
        }

        function canopyTest(hsv) { //Detects sky from http://ijcsi.org/papers/IJCSI-10-4-1-222-226.pdf
            if (hsv[2] >= .55 && (hsv[0] * 360 >= 190 && hsv[0] * 360 <= 255)) {
                return 1;
            } else if (hsv[2] >= .7 && hsv[1] < .15) {
                return 0;
            }
            else {
                return 0
            }
        }

        function rgbToHsv(r, g, b) { // Convert RGB to HSV
            // Rescale RGB from 0-1
            var r = r / 255;
            var g = g / 255;
            var b = b / 255;
            var max = Math.max(r, g, b);
            var min = Math.min(r, g, b);
            var v = max;
            var d = max - min;
            var s = max == 0 ? 0 : d / max;

            if (max == min) {
                h = 0; // achromatic
            } else {
                switch (max) {
                    case r: // If red is the biggest value.
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g: // If green is the biggest value
                        h = (b - r) / d + 2;
                        break;
                    case b: // If blue is the biggest value.
                        h = (r - g) / d + 4;
                        break;
                }
                h /= 6;
            }
            return [h, s, v];
        }
    }
};
app.initialize();