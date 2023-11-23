document.addEventListener("DOMContentLoaded", function () {
    var playButton = document.getElementById("playButton");
    var stopButton = document.getElementById("stopButton"); // New stop button
    var inputs = document.querySelectorAll(".sound-input");
    var repetitionsInput = document.getElementById("repetitions");
    var audio = new Audio();
    var soundFiles = [];
    var currentIndex = 0;
    var repetitions = 1;
    var soundImage = document.getElementById("soundImage");
    var bpmInput = document.getElementById("bpmInput");
    var sequenceTimeout; // Variable to store the timeout ID

    // Define an array of image and sound file URLs to preload
    var preloadImages = ["images/image-C-maj-7.png", "images/image-Cs-maj-7.png", "images/image-D-maj-7.png", "images/image-Ds-maj-7.png", "images/image-Db-maj-7.png", "images/image-E-maj-7.png", "images/image-Eb-maj-7.png", "images/image-F-maj-7.png", "images/image-Fs-maj-7.png", "images/image-G-maj-7.png", "images/image-Gs-maj-7.png", "images/image-Gb-maj-7.png", "images/image-A-maj-7.png", "images/image-As-maj-7.png", "images/image-Ab-maj-7.png", "images/image-B-maj-7.png", "images/image-Bb-maj-7.png" /* Add more image URLs */];
    var preloadSounds = ["sounds/sound-file-C-maj-7.mp3", "sounds/sound-file-Cs-maj-7.mp3","sounds/sound-file-D-maj-7.mp3", "sounds/sound-file-Ds-maj-7.mp3", "sounds/sound-file-Db-maj-7.mp3", "sounds/sound-file-E-maj-7.mp3", "sounds/sound-file-Eb-maj-7.mp3", "sounds/sound-file-F-maj-7.mp3", "sounds/sound-file-Fs-maj-7.mp3", "sounds/sound-file-G-maj-7.mp3", "sounds/sound-file-Gs-maj-7.mp3", "sounds/sound-file-Gb-maj-7.mp3", "sounds/sound-file-A-maj-7.mp3", "sounds/sound-file-Ab-maj-7.mp3", "sounds/sound-file-B-maj-7.mp3", "sounds/sound-file-Bb-maj-7.mp3",/* Add more sound file URLs */];

    // Function to preload resources
    function preloadResources(resourceArray) {
        resourceArray.forEach(function (resourceUrl) {
            var preloadElement;
            if (resourceUrl.endsWith(".mp3")) {
                preloadElement = new Audio();
            } else {
                preloadElement = new Image();
            }
            preloadElement.src = resourceUrl;
        });
    }

    // Preload images and sounds
    preloadResources(preloadImages);
    preloadResources(preloadSounds);

    stopButton.addEventListener("click", function () {
        // Pause the audio immediately
        audio.pause();

        // Clear the timeout to stop the playback
        clearTimeout(sequenceTimeout);

        // Reset the sequence and current index
        sequence = [];
        currentIndex = 0;
    });


    playButton.addEventListener("click", function () {
        soundFiles = [];
        inputs.forEach(function (select) {
            var selectedOption = select.options[select.selectedIndex].value;
            var fileName = getFileNameForNote(selectedOption);
            if (fileName) {
                soundFiles.push("sounds/" + fileName); // Updated sound file path
            }
        });

        var repetitionsValue = parseInt(repetitionsInput.value);
        if (!isNaN(repetitionsValue) && repetitionsValue > 0) {
            repetitions = repetitionsValue;
        }

        var bpm = parseInt(bpmInput.value);
        if (isNaN(bpm) || bpm < 40 || bpm > 208) {
            alert("Please enter a valid BPM between 40 and 208.");
            return;
        }

        if (soundFiles.length > 0) {
            createPlaybackSequence();
            playSoundFiles(bpm);
        } else {
            alert("Please select an option in at least one dropdown field.");
        }
    });

    function getFileNameForNote(note) {
        // Mapping of notes to sound file names
        var noteToFileName = {
            "C": "sound-file-D.mp3",
            "Cm": "sound-file-D-m.mp3",
            "C7": "sound-file-D-7.mp3",
            "CM7": "sound-file-D-maj-7.mp3",
            "C#": "sound-file-Ds.mp3",
            "C#m": "sound-file-Ds-m.mp3",
            "C#7": "sound-file-Ds-7.mp3",
            "C#M7": "sound-file-Ds-maj-7.mp3",
            "Db": "sound-file-Eb.mp3",
            "Dbm": "sound-file-Eb-m.mp3",
            "Db7": "sound-file-Eb-7.mp3",
            "DbM7": "sound-file-Eb-maj-7.mp3",
            "D": "sound-file-E.mp3",
            "Dm": "sound-file-E-m.mp3",
            "D7": "sound-file-E-7.mp3",
            "DM7": "sound-file-E-maj-7.mp3",
            "D#": "sound-file-F.mp3",
            "D#m": "sound-file-F-m.mp3",
            "D7": "sound-file-F-7.mp3",
            "D#M7": "sound-file-F-maj-7.mp3",
            "Eb": "sound-file-F.mp3",
            "Ebm": "sound-file-F-m.mp3",
            "Eb7": "sound-file-F-7.mp3",
            "EbM7": "sound-file-F-maj-7.mp3",
            "E": "sound-file-Fs.mp3",
            "Em": "sound-file-Fs-m.mp3",
            "E7": "sound-file-Fs-7.mp3",
            "EM7": "sound-file-Fs-maj-7.mp3",
            "F": "sound-file-G.mp3",
            "Fm": "sound-file-G-m.mp3",
            "F7": "sound-file-G-7.mp3",
            "FM7": "sound-file-G-maj-7.mp3",
            "F#": "sound-file-Gs.mp3",
            "F#m": "sound-file-Gs-m.mp3",
            "F#7": "sound-file-Gs-7.mp3",
            "F#M7": "sound-file-Gs-maj-7.mp3",
            "Gb": "sound-file-Ab.mp3",
            "Gbm": "sound-file-Ab-m.mp3",
            "Gb7": "sound-file-Ab-7.mp3",
            "GbM7": "sound-file-Ab-maj-7.mp3",
            "G": "sound-file-A.mp3",
            "Gm": "sound-file-A-m.mp3",
            "G7": "sound-file-A-7.mp3",
            "GM7": "sound-file-A-maj-7.mp3",
            "G#": "sound-file-As.mp3",
            "G#m": "sound-file-As-m.mp3",
            "G#7": "sound-file-As-7.mp3",
            "G#M7": "sound-file-As-maj-7.mp3",
            "Ab": "sound-file-Bb.mp3",
            "Abm": "sound-file-Bb-m.mp3",
            "Ab7": "sound-file-Bb-7.mp3",
            "AbM7": "sound-file-Bb-maj-7.mp3",
            "A": "sound-file-B.mp3",
            "Am": "sound-file-B-m.mp3",
            "A7": "sound-file-B-7.mp3",
            "AM7": "sound-file-B-maj-7.mp3",
            "A#": "sound-file-C.mp3",
            "A#m": "sound-file-C-m.mp3",
            "A#7": "sound-file-C-7.mp3",
            "A#M7": "sound-file-C-maj-7.mp3",
            "Bb": "sound-file-C.mp3",
            "Bbm": "sound-file-C-m.mp3",
            "Bb7": "sound-file-C-7.mp3",
            "BbM7": "sound-file-C-maj-7.mp3",
            "B": "sound-file-Cs-.mp3",
            "Bm": "sound-file-Cs-m.mp3",
            "B7": "sound-file-Cs-7.mp3",
            "BM7": "sound-file-Cs-maj-7.mp3",
        };
        return noteToFileName[note];
    }

    function createPlaybackSequence() {
        sequence = []; // Reset the sequence
        for (var i = 0; i < repetitions; i++) {
            sequence = sequence.concat(soundFiles); // Add sound files to the sequence
        }
    }

    function playSoundFiles(bpm) {
        var beatsPerSound = 4;
        var millisecondsPerBeat = 60000 / bpm;
        var timeForSound = beatsPerSound * millisecondsPerBeat;

        if (currentIndex < sequence.length) {
            audio.src = sequence[currentIndex];
            audio.play();
            updateSoundImage(sequence[currentIndex]);

            sequenceTimeout = setTimeout(function () {
                audio.pause();
                audio.currentTime = 0; // Reset audio to the beginning
                currentIndex++;

                if (currentIndex === sequence.length) {
                    // All sound files have been played, reset the currentIndex
                    currentIndex = 0;
                } else {
                    // Continue playing the next sound file in the sequence
                    playSoundFiles(bpm);
                }
            }, timeForSound);
        }
    }

    function updateSoundImage(soundFileName) {
        var imageName = soundFileName.replace("sounds/", "images/").replace("sound-file-", "image-").replace(".mp3", ".png"); // Updated image file path
        soundImage.src = imageName;
    }
});