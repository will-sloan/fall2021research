# This takes the raw CSV files and converts them to Celsius.
# Note that there is loss of accuracy when this is done. 

import os
import csv
import sys

directory = 'SeekOFix/TestSeek/bin/Debug/export/'

for filename in os.listdir(directory):
    if filename.startswith("seek_") and filename.endswith(".txt"):
        output = list()
        with open(directory + filename, 'r') as f:
            output = list(csv.reader(f))
        # output is now a 2d list with the raw data
        newFileName = directory + filename
        newFileName = newFileName.replace("seek_", "temp_")

        # We iterate through output, converting each value to its temperature equivalent
        for r_index,row in enumerate(output):
            # each row is a list
            for c_index,cell in enumerate(row):
                # cell is the individual values
                # The output is Celsius!
                output[r_index][c_index] = (int(cell) - 5950) / 40

        # Then we save the values into a similarily named txt file
        with open(newFileName,"w+") as new_csv:
            csvWriter = csv.writer(new_csv,delimiter=',')
            csvWriter.writerows(output)


# print(len(output)) # Number of rows which is the height (should be 156)
# print(len(output[0])) # Number of columns which is width (should be 208)