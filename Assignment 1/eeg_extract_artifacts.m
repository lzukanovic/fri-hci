% This 1st seminar is based on the 2nd exercise with the following 
% instructions.
%
% For an arbitrarily selected subject of the EEGMMI DS database, implement 
% a procedure for extracting eye artifacts using the independent component 
% analysis (ICA) procedure. As part of the task, also implement a graphic 
% display of basic signals, signals in the component space and corrected 
% signals.
%
% Author: Lan Zukanovic

% Capture subject and record selection from user
subjects = {'S001'};
[indxS,~] = listdlg('ListString',subjects,'SelectionMode','single',...
    'PromptString','Select a subject.');

records = {'R01','R02','R03','R04','R05','R06','R07','R08','R09','R10',...
    'R11','R12','R13','R14'};
[indxR,~] = listdlg('ListString',records,'SelectionMode','single',...
    'PromptString','Select a record.');

defaultValuesUsed = false;
if isempty(indxS)
    subject = 'S001';
    defaultValuesUsed = true;
else
    subject = string(subjects(indxS));
end

if isempty(indxR)
    recording = 'R01';
    defaultValuesUsed = true;
else
    recording = string(records(indxR));
end

if defaultValuesUsed
    answer = questdlg('You have not selected all values. The program will continue with these default values: S001, R01. Do you wish to continue?','Use default values?');
    if ~strcmp(answer, 'Yes')
        return;
    end
end

path = sprintf('data/%s/%s%s.edf', subject, subject, recording);

if exist(path, 'file') ~= 2
    msgbox(['The selected file couldn''t be found. Please make sure you have the following file structure: ' path],'File not found','modal');
    return;
end

%% Original signals
% Import the necessary components for a selected recording from a subject
global freq;
[sig, freq, tm] = rdsamp(path, 1:64);

% Plot original signals
simpleEEGPlot(sig, 'Original EEG Signals (all)')
pageableEEGPlot(sig.', 64, 'Original EEG Signals')

%% Independent Components
global A icasig;
[icasig, A, W] = fastica(sig.');

%% Artifact identification and removal

% Plot component space and add checkboxes for artifact selection
% at the end plot cleaned signals
pageableICAPlots(icasig)

%% Functions

% Create a pageable figure with plots of different ICA components
% Add a checkbox to each component and update selected
% When finalized, call function to calculate cleaned signals and plot
function pageableICAPlots(icasig)
    global artifactSelections checkboxHandles A freq;
    
    % Number of pages
    numSignals = size(icasig, 1);
    signalsPerPage = 4;
    totalPages = ceil(numSignals / signalsPerPage);

    % Initialize global variables
    artifactSelections = false(numSignals, 1);
    checkboxHandles = cell(1, numSignals);

    % Create the main figure
    hFig = figure('Name', 'Independent Components');
    currentPage = 1;

    % Function to update the plot
    function updateICAPlot(pageNum)
        signalLength = length(icasig);
        signalDuration = signalLength / freq;
        tickInterval = 5 * freq; % 5 seconds interval

        % Clear current figure content
        clf(hFig);
        
        for i = 1:signalsPerPage
            componentIndex = (pageNum - 1) * signalsPerPage + i;
            if componentIndex > numSignals
                break;
            end
            subplot(signalsPerPage, 1, i);
            plot(icasig(componentIndex, :));

            % Add time markers
            xticks(0:tickInterval:signalLength); % Set ticks every tickInterval samples
            xticklabels(0:5:signalDuration); % Set tick labels from 0 to the duration of the signal in seconds
            xlabel('Time [s]');

            title(['Component ' num2str(componentIndex)]);
            
            % Checkbox for each component
            pos = get(gca, 'Position');
            checkboxPos = [pos(1), pos(2) + pos(4) - 0.01, 0.05, 0.05];
            checkboxHandles{componentIndex} = uicontrol('Style', 'checkbox', ...
                                                        'Units', 'normalized', ...
                                                        'Position', checkboxPos, ...
                                                        'BackgroundColor', 'white', ...
                                                        'Value', artifactSelections(componentIndex), ...
                                                        'Callback', @checkboxCallback);
        end

        % Navigation buttons and pagination
        uicontrol('Style', 'pushbutton', ...
            'String', '< Prev', ...
            'Units', 'normalized', ...
            'Position', [0.13 0.01 0.1 0.05], ...
            'Callback', @prevPageCallback);

        uicontrol('Style', 'text', ...
            'Units', 'normalized', ...
            'Position', [0.24 0.004 0.08 0.05], ...
            'String', [num2str(pageNum) ' / ' num2str(totalPages)], ...
            'BackgroundColor', 'white');

        uicontrol('Style', 'pushbutton', ...
            'String', 'Next >', ...
            'Units', 'normalized', ...
            'Position', [0.33 0.01 0.1 0.05], ...
            'Callback', @nextPageCallback);

        % Component selection buttons
        uicontrol('Style', 'pushbutton', ...
            'String', 'Finish', ...
            'Units', 'normalized', ...
            'Position', [0.75 0.01 0.15 0.05], ...
            'Callback', @finalizeSelection);
    end

    % Callbacks for navigation buttons
    function prevPageCallback(~, ~)
        if currentPage > 1
            currentPage = currentPage - 1;
            updateICAPlot(currentPage);
        end
    end

    function nextPageCallback(~, ~)
        if currentPage < totalPages
            currentPage = currentPage + 1;
            updateICAPlot(currentPage);
        end
    end

    % Update artifact selections based on checkbox state
    function updateSelections()
        for i = 1:numSignals
            if ishandle(checkboxHandles{i})
                artifactSelections(i) = get(checkboxHandles{i}, 'Value');
            end
        end
    end

    % Checkbox callback function to store the selection
    function checkboxCallback(~, ~)
        updateSelections();
        selectedArtifacts = find(artifactSelections)';
        disp(['Current artifact components: ', num2str(selectedArtifacts)]);
    end

    % Finalize and process selections
    function finalizeSelection(~, ~)
        % confirm modal
        answer = questdlg('Are you sure you have selected all artifacts?','Finish');
        if strcmp(answer, 'Yes')
            % process selected artifacts
            selectedArtifacts = find(artifactSelections)';
            disp(['Final artifact components: ', num2str(selectedArtifacts)]);
            processAndPlotEEGSignals(selectedArtifacts, A, icasig);
        end
    end

    % Initial plot
    updateICAPlot(currentPage);
end


% Read user selected artifacts for removal, clean the signals and plot
function processAndPlotEEGSignals(componentsToRemove, A, icasig)
    if isempty(componentsToRemove)
        return
    end

    % Sort the components in descending order for correct indexing
    componentsToRemove = sort(componentsToRemove, 'descend');

    % Remove the identified artifact components
    A(:, componentsToRemove) = [];
    icasig(componentsToRemove, :) = [];

    % Clean the signals
    cleaned = A * icasig;

    % Plot the cleaned signals
    simpleEEGPlot(cleaned.', 'Cleaned EEG Signals (all)')
    pageableEEGPlot(cleaned, 64, 'Cleaned EEG Signals')
end

% Create a simple plot of all signals together
function simpleEEGPlot(eegData, figTitle)
    global freq;
    signalLength = length(eegData);
    signalDuration = signalLength / freq;
    tickInterval = 5 * freq; % 5 seconds interval
    
    % Plot
    figure('Name', figTitle);
    plot(eegData);

    % Add time markers
    xticks(0:tickInterval:signalLength);
    xticklabels(0:5:signalDuration);
    xlabel('Time [s]');

    title(figTitle);
end

% Create a pageable figure to show simple plots of signals
% Shows 4 signals per page
function pageableEEGPlot(eegData, numSignals, figTitle)
    global freq;
    % Number of channels to display per page
    signalsPerPage = 4;  
    totalPages = ceil(numSignals / signalsPerPage);
    
    % Create a figure
    hFig = figure('Name', figTitle);

    % Initialize page number
    currentPage = 1;

    % Function to update the plot
    function updatePlot(pageNum)
        % Calculate range of signals for the current page
        signalsToShow = ((pageNum - 1) * signalsPerPage + 1):min(pageNum * signalsPerPage, numSignals);
        signalLength = length(eegData);
        signalDuration = signalLength / freq;
        tickInterval = 5 * freq; % 5 seconds interval

        % Clear existing plots in the figure
        clf(hFig);

        % Plot each channel in the range
        for i = 1:length(signalsToShow)
            subplot(signalsPerPage, 1, i);
            plot(eegData(signalsToShow(i), :));
            
            % Add time markers
            xticks(0:tickInterval:signalLength); % Set ticks every tickInterval samples
            xticklabels(0:5:signalDuration); % Set tick labels from 0 to the duration of the signal in seconds
            xlabel('Time [s]');

            title(['Channel ' num2str(signalsToShow(i))]);
        end

        % Navigation buttons and pagination
        uicontrol('Style', 'pushbutton', ...
            'String', '< Prev', ...
            'Units', 'normalized', ...
            'Position', [0.13 0.01 0.1 0.05], ...
            'Callback', @prevPageCallback);

        uicontrol('Style', 'text', ...
            'Units', 'normalized', ...
            'Position', [0.24 0.004 0.08 0.05], ...
            'String', [num2str(pageNum) ' / ' num2str(totalPages)], ...
            'BackgroundColor', 'white');

        uicontrol('Style', 'pushbutton', ...
            'String', 'Next >', ...
            'Units', 'normalized', ...
            'Position', [0.33 0.01 0.1 0.05], ...
            'Callback', @nextPageCallback);
    end

    % Callbacks for buttons
    function prevPageCallback(~, ~)
        if currentPage > 1
            currentPage = currentPage - 1;
            updatePlot(currentPage);
        end
    end

    function nextPageCallback(~, ~)
        if currentPage < totalPages
            currentPage = currentPage + 1;
            updatePlot(currentPage);
        end
    end

    % Initial plot
    updatePlot(currentPage);
end