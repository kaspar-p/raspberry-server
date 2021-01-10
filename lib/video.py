# # import the necessary packages
# from picamera.array import PiRGBArray
# from picamera import PiCamera
import requests
import time
import json
import numpy as np
import random

imgWidth = 300
imgHeight = 200

img = np.zeros(shape=(imgHeight, imgWidth, 4), dtype=int)

for j in range(imgHeight):
    for i in range(imgWidth):
        img[j, i] = np.array([random.randint(0, 255), random.randint(
            0, 255), random.randint(0, 255), 255])


body = {"imageHeight": imgHeight, "imageWidth": imgWidth,
        "imageData": img.flatten().tolist()}
body = json.dumps(body)
headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}
serverURL = 'http://localhost:1441/api/video'

requests.post(serverURL, data=body, headers=headers)

# # initialize the camera and grab a reference to the raw camera capture
# camera = PiCamera()
# camera.resolution = (640, 480)
# camera.framerate = 32
# rawCapture = PiRGBArray(camera, size=(640, 480))

# # allow the camera to warmup
# time.sleep(0.1)
# serverURL = 'http://localhost:1441/video'

# # capture frames from the camera
# for frame in camera.capture_continuous(rawCapture, format="bgr", use_video_port=True):
#     # grab the raw NumPy array representing the image, then initialize the timestamp
#     # and occupied/unoccupied text
#     image = frame.array
#     headers = {'Content-Type': 'application/json', 'Accept':'application/json'}
#     body = json.dumps(frame.array.tolist())
#     x = requests.post(serverURL, data=body, headers=headers)

#     # clear the stream in preparation for the next frame
#     rawCapture.truncate(0)
