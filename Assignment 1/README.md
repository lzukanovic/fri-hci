The goal of this assignment is to use the independent component analysis method on EEG data from the [EEGMMI dataset](https://www.physionet.org/content/eegmmidb/1.0.0/) to extract eye and other artifacts from the data.
Included are the following files:
- Instruction.pdf with the instructions for the assignment (in Slovene)
- The report for the assignment (in Slovene). The report is written in such a way that it can be followed as a tutorial for the assignment.
- The MATLAB code for the assignment `eeg_extract_artifacts.m`. The code requires the following:
    - wfdb app toolbox for MATLAB to enable EEG data interpretation
        ```MATLAB
        % Library URL
        wfdb_url='https://physionet.org/physiotools/matlab/wfdb-app-matlab/wfdb-app-toolbox-0-10-0.zip';
        % Download the ZIP
        [filestr,status] = urlwrite(wfdb_url,'wfdb-app-toolbox-0-10-0.zip');
        % Unzip the file
        unzip('wfdb-app-toolbox-0-10-0.zip');
        % Add the library to the path
        cd mcode/
        addpath(pwd);
        cd ..
        savepath
        ```
    - EEGMMI dataset. The dataset can be downloaded from the [EEGMMI dataset](https://www.physionet.org/content/eegmmidb/1.0.0/) website. The dataset should be inside of the folder named `data` in the same directory as the MATLAB code. Example what the path for the first record should look like: `data/S001/S001R01.edf`
    - Implementation of the ICA algorithm. Provided in the `fastica.m` file.
