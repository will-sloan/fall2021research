# fall2021research

To set up the folders to run the experiment create the following folders within Participant_data:

subject_name
subject_name\seek_camera1
subject_name\seek_camera2

Then on line 768/770 (depending on which Seek project you are editing, there are two so make sure to change both)
of Form1.cs, change test_subject to the participants name.
Ex: 
"C:\\Users\\sam3sim\\Documents\\fall2021research-main\\fall2021research-main\\Participant_data\\test_subject_1\\seek_camera2\\seek_camera2_"
For participant "Evan" changes to
"C:\\Users\\sam3sim\\Documents\\fall2021research-main\\fall2021research-main\\Participant_data\\evan\\seek_camera2\\seek_camera2_"

This is done for both projects. 

The command for the vernier sensor when in the following folder: C:\Users\sam3sim\Documents\fall2021research-main\fall2021research-main\respiration-belt
`python -m verniersl --order_code GDX-RB --enable [1,2] --filename C:\Users\sam3sim\Documents\fall2021research-main\fall2021research-main\Participant_data\test_subject_1\vernier_respiratory_data.txt`

Change the `--filename` to the participants name or folder used above. 



`raw_to_temp.py` converts `.txt` files found in `SeekOFix\TestSeek\bin\Debug\export` to csv files containing celsius data. 

To enable writing the raw data, click the `Auto Save` checkbox while SeekOFix is running.
`Auto Save` saves the raw data and not the calibrated `firstAfterCalc` image, so it saves a lot of data. Running for a few seconds can take up to a few mbs, so probably don't run for long. 
