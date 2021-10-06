# fall2021research

`raw_to_temp.py` converts `.txt` files found in `SeekOFix\TestSeek\bin\Debug\export` to csv files containing celsius data. 

To enable writing the raw data, click the `Auto Save` checkbox while SeekOFix is running.
`Auto Save` saves the raw data and not the calibrated `firstAfterCalc` image, so it saves a lot of data. Running for a few seconds can take up to a few mbs, so probably don't run for long. 

`webcam_test.py` is a work in progress.