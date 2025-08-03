
self.importScripts('/models/whisper.cpp/whisper.wasm');

let whisper: any;

self.onmessage = async (e) => {
  const { type, data } = e.data;
  if (type === 'init') {
    whisper = await loadWhisperModel('/models/whisper.bin');
  }
  if (type === 'chunk') {
    const partial = whisper.pushAudio(data);
    self.postMessage({ type: 'partial', text: partial });
  }
  if (type === 'end') {
    const full = whisper.finalize();
    self.postMessage({ type: 'final', text: full });
  }
}
