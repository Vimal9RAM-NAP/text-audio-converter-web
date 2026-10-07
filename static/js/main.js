const textInput = document.getElementById('text-input');
const fileInput = document.getElementById('file-input');
const dropZone = document.getElementById('drop-zone');

const rateRange = document.getElementById('rate-range');
const pitchRange = document.getElementById('pitch-range');
const volumeRange = document.getElementById('volume-range');

const rateVal = document.getElementById('rate-val');
const pitchVal = document.getElementById('pitch-val');
const volumeVal = document.getElementById('volume-val');

const statWords = document.getElementById('stat-words');
const statChars = document.getElementById('stat-chars');
const statTime = document.getElementById('stat-time');


fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
        textInput.value = evt.target.result;
        updateMetrics();
    };
    reader.readAsText(file);
});

['dragenter', 'dragover'].forEach(eName => {
    dropZone.addEventListener(eName, (e) => {
        e.preventDefault();
        dropZone.classList.add('dropzone-active');
    });
});

['dragleave', 'drop'].forEach(eName => {
    dropZone.addEventListener(eName, (e) => {
        e.preventDefault();
        dropZone.classList.remove('dropzone-active');
    });
});

dropZone.addEventListener('drop', (e) => {
    if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        fileInput.dispatchEvent(new Event('change'));
    }
});


rateRange.addEventListener('input', (e) => {
    rateVal.innerText = `${e.target.value}x`;
    updateMetrics();
});

pitchRange.addEventListener('input', (e) => {
    pitchVal.innerText = e.target.value;
});

volumeRange.addEventListener('input', (e) => {
    volumeVal.innerText = `${Math.round(e.target.value * 100)}%`;
});

textInput.addEventListener('input', updateMetrics);

function updateMetrics() {
    const text = textInput.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = text.length;

    const rate = parseFloat(rateRange.value);
    const estSeconds = Math.round((words / (150 * rate)) * 60);

    statWords.innerText = words;
    statChars.innerText = chars;
    statTime.innerText = `${estSeconds}s`;
}