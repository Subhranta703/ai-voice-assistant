self.importScripts('/models/tts/coqui-tts.wasm');

let tts: any;
self.onmessage = async (e) => {
    const { type, text } = e.data;
    if (type === 'init') {
      tts = await loadTTS('/models/tts/model.bin');
    }
    if (type === 'speak') {
      const audio = await tts.synthesize(text);
      self.postMessage({ audio }, [audio]);
    }
};
