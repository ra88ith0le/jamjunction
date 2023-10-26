document.addEventListener("DOMContentLoaded", function () {
    var playButton = document.getElementById("playButton");
    var inputs = document.querySelectorAll(".sound-input");
    var repetitionsInput = document.getElementById("repetitions");
    var audio = new Audio();
    var soundFiles = [];
    var currentIndex = 0;
    var repetitions = 1;
    var soundImage = document.getElementById("soundImage");
    var bpmInput = document.getElementById("bpmInput");

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
            "C": "sound-file-C-maj-7.mp3",
            "C#": "sound-file-Cs-maj-7.mp3",
            "Db": "sound-file-Db-maj-7.mp3",
            "D": "sound-file-D-maj-7.mp3",
            "D#": "sound-file-Ds-maj-7.mp3",
            "Eb": "sound-file-Eb-maj-7.mp3",
            "E": "sound-file-E-maj-7.mp3",
            "F": "sound-file-F-maj-7.mp3",
            "F#": "sound-file-Fs-maj-7.mp3",
            "Gb": "sound-file-Gb-maj-7.mp3",
            "G": "sound-file-G-maj-7.mp3",
            "G#": "sound-file-Gs-maj-7.mp3",
            "Ab": "sound-file-Ab-maj-7.mp3",
            "A": "sound-file-A-maj-7.mp3",
            "A#": "sound-file-As-maj-7.mp3",
            "Bb": "sound-file-Bb-maj-7.mp3",
            "B": "sound-file-B-maj-7.mp3",
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

            setTimeout(function () {
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
