let synth = window.speechSynthesis;
let voices = [];
let animFrameId = null;

const voiceSelect = document.getElementById('voice-select');
const canvas = document.getElementById('visualizer-canvas');
const ctx = canvas.getContext('2d');

function initCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', initCanvas);
initCanvas();

function populateVoices() {
    if (!synth) return;
    voices = synth.getVoices();
    voiceSelect.innerHTML = '';

    voices.forEach((voice, i) => {
        const option = document.createElement('option');
        option.textContent = `${voice.name} (${voice.lang})`;
        option.value = i;
        if (voice.default) option.selected = true;
        voiceSelect.appendChild(option);
    });
}

populateVoices();
if (synth && synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = populateVoices;
}

function drawWave(active) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const bars = 32;
    const barWidth = canvas.width / bars;

    for (let i = 0; i < bars; i++) {
        const height = active ? Math.random() * (canvas.height - 10) + 10 : 4;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(i * barWidth, (canvas.height - height) / 2, barWidth - 3, height);
    }

    if (active) {
        animFrameId = requestAnimationFrame(() => drawWave(true));
    } else {
        cancelAnimationFrame(animFrameId);
    }
}

function playSpeech() {
    if (!synth) return;

    if (synth.paused) {
        synth.resume();
        drawWave(true);
        return;
    }

    synth.cancel();
    const text = document.getElementById('text-input').value;
    if (!text.trim()) return;

    const utter = new SpeechSynthesisUtterance(text);
    if (voices[voiceSelect.value]) {
        utter.voice = voices[voiceSelect.value];
    }

    utter.rate = parseFloat(document.getElementById('rate-range').value);
    utter.pitch = parseFloat(document.getElementById('pitch-range').value);
    utter.volume = parseFloat(document.getElementById('volume-range').value);

    utter.onstart = () => drawWave(true);
    utter.onend = () => drawWave(false);
    utter.onerror = () => drawWave(false);

    synth.speak(utter);
}

function pauseSpeech() {
    if (synth && synth.speaking) {
        synth.pause();
        drawWave(false);
    }
}

function stopSpeech() {
    if (synth) {
        synth.cancel();
        drawWave(false);
    }
}

function downloadExport() {
    const text = document.getElementById('text-input').value;
    const format = document.getElementById('export-format').value;

    if (!text.trim()) {
        alert('Please enter text first.');
        return;
    }

    const mimeTypes = { txt: 'text/plain', md: 'text/markdown', wav: 'audio/wav' };
    const blob = new Blob([text], { type: mimeTypes[format] || 'text/plain' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `mimic_you_export_${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

drawWave(false);