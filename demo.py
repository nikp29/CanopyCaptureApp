# A Rapid Proof of Concept for the eDensiometer
# Copyright 2018, Nikhil Patel. All Rights Reserved.

# Imports
from PIL import Image
from pprint import pprint
import numpy as np
import time as time_

def millis(): # from https://stackoverflow.com/questions/5998245/get-current-time-in-milliseconds-in-python/6000198#6000198
    return int(round(time_.time() * 1000))

start = millis()

# Constants
# BRIGHT_CUTOFF = 175
RED_CUTOFF = 200
GREEN_CUTOFF = 150
BLUE_CUTOFF = 200


# Pull from test.jpg image in local directory
temp = np.asarray(Image.open('test.jpg'))
print(temp.shape)

# Variable Initialization
result = np.zeros((temp.shape[0], temp.shape[1], temp.shape[2]))
temp_bright = np.zeros((temp.shape[0], temp.shape[1]))
count_total = 0
count_open = 0

# Cycle through image
for row in range(0, temp.shape[0]):
    for element in range(0, temp.shape[1]):
        count_total += 1
        temp_bright[row, element] = (int(temp[row][element][0]) + int(temp[row][element][1]) + int(temp[row][element][2]))/3
        # bright = temp_bright[row][element] > BRIGHT_CUTOFF
        red_enough = temp[row][element][0] > RED_CUTOFF
        green_enough = temp[row][element][1] > GREEN_CUTOFF
        blue_enough = temp[row][element][2] > BLUE_CUTOFF
        if red_enough and green_enough and blue_enough:
            # print(temp[row, element])
            count_open += 1
            result[row, element] = [255, 255, 255]

# Save filtered image as final.jpg
final = Image.fromarray(result.astype('uint8'), 'RGB')
final.save('final.jpg')

# Return/Print Percent Coverage
percent_open = count_open/count_total
percent_cover = 1 - percent_open

end = millis()

print("Percent Open: " + str(percent_open))
print("Percent Cover: " + str(percent_cover))

runtime = end-start
print("Runtime in MS: " + str(runtime))