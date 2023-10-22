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
            "C": "sound-file-C.mp3",
            "C#": "sound-file-C#.mp3",
            "Db": "sound-file-Db.mp3",
            "D": "sound-file-D.mp3",
            "D#": "sound-file-D#.mp3",
            "E": "sound-file-E.mp3",
            "F": "sound-file-F.mp3",
            "F#": "sound-file-F#.mp3",
            "Gb": "sound-file-Gb.mp3",
            "G": "sound-file-G.mp3",
            "G#": "sound-file-G#.mp3",
            "Ab": "sound-file-Ab.mp3",
            "A": "sound-file-A.mp3",
            "A#": "sound-file-A#.mp3",
            "Bb": "sound-file-Bb.mp3",
            "B": "sound-file-B.mp3",
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
        var imageName = soundFileName.replace("sounds/", "images/").replace("sound-file-", "image-").replace(".mp3", ".jpg"); // Updated image file path
        soundImage.src = imageName;
    }
});
