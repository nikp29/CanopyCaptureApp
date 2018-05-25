// Copyright 2018, Nikhil Patel and Billy Pierce. All Rights Reserved.
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
    newDataPoint: function(coverVal) {
        window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {

            console.log('file system open: ' + fs.name);
            createFile(fs.root, "newTempFile.txt", false);
        
        }, onErrorLoadFs);
        function createFile(dirEntry, fileName, isAppend) {
            // Creates a new file or returns the file if it already exists.
            dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {
        
                writeFile(fileEntry, null, isAppend);
        
            }, onErrorCreateFile);
        
        }
        function writeFile(fileEntry, dataObj) {
            // Create a FileWriter object for our FileEntry (log.txt).
            fileEntry.createWriter(function (fileWriter) {
        
                fileWriter.onwriteend = function() {
                    console.log("Successful file write...");
                    readFile(fileEntry);
                };
        
                fileWriter.onerror = function (e) {
                    console.log("Failed file write: " + e.toString());
                };
        
                // If data object is not passed in,
                // create a new Blob instead.
                if (!dataObj) {
                    dataObj = new Blob(['some file data'], { type: 'text/plain' });
                }
        
                fileWriter.write(dataObj);
            });
        }
    },
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
                left.style.color = "rgba(237,101,88,0)";
                right.style.color = "rgba(237,101,88,0)";
                up.style.color = "rgba(237,101,88,0)";
                down.style.color = "rgba(237,101,88,0)";
                border.style.borderColor = "rgba(157, 182, 31,1)";
                rightIcon.classList.remove("fas");
                rightIcon.classList.remove("fa-spin");
                rightIcon.classList.remove("fa-sync");
                rightIcon.classList.add("far");
                rightIcon.classList.add("fa-check-circle");
                // this.deviceSynced = true;
                app.receivedEvent('deviceready');
            } else {
                // this.deviceSynced = false;
                border.style.borderColor = "rgba(157, 182, 31,0)";
                if (rightIcon.classList.contains("fa-spin") == true) {
                } else {
                    rightIcon.classList.add("fas");
                    rightIcon.classList.add("fa-spin");
                    rightIcon.classList.add("fa-sync");
                    rightIcon.classList.remove("far");
                    rightIcon.classList.remove("fa-check-circle");
                }

                if (gamma > 0) { // Left/Right
                    left.style.color = "rgba(237,101,88," + (gamma / 8).toString() + ")"; //Left
                    right.style.color = "rgba(237,101,88,0)";
                } else {
                    right.style.color = "rgba(237,101,88," + (-1 * gamma / 8).toString() + ")"; //Right
                    left.style.color = "rgba(237,101,88,0)";
                }

                if (beta > 0) { //Up/Down
                    up.style.color = "rgba(237,101,88," + (beta / 8).toString() + ")"; //Down
                    down.style.color = "rgba(237,101,88,0)";
                } else {
                    down.style.color = "rgba(237,101,88," + (-1 * beta / 8).toString() + ")"; //Up
                    up.style.color = "rgba(237,101,88,0)";
                }
            }
        } else {
            border.style.borderColor = "rgba(157, 182, 31,0)";
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
        }

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
                setupCanvas(image);
            };
            

        }
        function setupCanvas(image) {
            console.log("settingUp");
            var canvas = document.getElementById("canvasMan");
            canvas.width = image.width;
            canvas.height = image.height;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
            percent_cover = processPhoto(canvas);
            canvas.style = image.style;
            document.getElementById("main-text").innerHTML = percent_cover.toFixed(2) + "% Canopy Cover";
            image.style.display = "none";
        }
            
        function processPhoto(canvas) {
            var percent_cover = 0.00;
            var RED_CUTOFF = 0;
            var GREEN_CUTOFF = 0;
            var BLUE_CUTOFF = 200;
            count_canopy = 0;
            var ctx = canvas.getContext('2d');
            total_size = canvas.width * canvas.height;
            console.log(total_size);
            var imageDataObject = ctx.getImageData(0,0,canvas.width,canvas.height);
            var imageData = imageDataObject.data
            for (index = 0; index < imageData.length; index+=4) {
                var hsvData = rgbToHsv(imageData[index], imageData[index+1], imageData[index+2]);
                if (canopyTest(hsvData,imageData[index], imageData[index+1], imageData[index+2]) == true) {
                    imageData[index]=255;
                    imageData[index+1]=0;
                    imageData[index+2]=0;
                } else {
                    count_canopy += 1;
                }
                // if ((imageData[index] < RED_CUTOFF) || (imageData[index+1] < GREEN_CUTOFF) || (imageData[index+2] < BLUE_CUTOFF)) {
                //     // console.log("Hue: " + HSV_Data.h + ". Saturation: " + HSV_Data.s + ". Brightness: " + HSV_Data.v);
                //     // (Brightness <= 50) && 
                //     // if ((Hue >= 170 && Hue =< 250) && (Saturation < 10)) {
                //         // ctx.fillStyle = "red";
                //         // ctx.fillRect(i, j, 1, 1);
                //         // ctx.stroke()
                //     count_canopy += 1;
                // } else {
                //     imageData[index]=255
                //     imageData[index+1]=0
                //     imageData[index+2]=0
                // }
                
            }
            imageDataObject.data = imageData;
            ctx.putImageData(imageDataObject,0,0);
            percent_cover = (count_canopy / total_size) * 100;
            return (percent_cover);
        }
        function canopyTest(hsv,r,g,b){
            if (hsv[2] >= .3 && ((hsv[0]*360 >= 170 && hsv[0]*360 <=255)|| (hsv[1] < .25))) {
                return true;
            } else {
                return false;
            }
            // //Detects sky from http://ijcsi.org/papers/IJCSI-10-4-1-222-226.pdf
            // if (abs(r - g)<5 && abs(g - b)<5 && b > t
            // && b>g && b>50 && b<230 ) {
            //     return true;
            // }
            // //Detects Clouds
            // else if (hsv[1] < .2 && hsv[2]>=.65) {
            //     return true
            // }
        }
        function rgbToHsv(r, g, b){
            r = r/255;
            g = g/255;
            b = b/255;
            var max = rgbMax(r, g, b);
            var min = rgbMin(r, g, b);
            var h = max;
            var s = max;
            var v = max;
        
            var d = max - min;
            s = max == 0 ? 0 : d / max;
        
            if(max == min){
                h = 0; // achromatic
            }else{
                switch(max){
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return [h, s, v];
        }
        function rgbMax(r,g,b){
            if (r>=g){
                if (r>=b){
                    return r
                }
                else {
                    return b
                }
            } else if (g>=b) {
                return g
            } else {
                return b
            }
        }
        function rgbMin(r,g,b){
            if (r<=g){
                if (r<=b){
                    return r
                }
                else {
                    return b
                }
            } else if (g<=b) {
                return g
            } else {
                return b
            }
        }
    }
};
app.initialize();