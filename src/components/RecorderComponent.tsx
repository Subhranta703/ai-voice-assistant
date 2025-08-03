'use client';

import React, { useRef, useState } from 'react';
import { WhisperTranscriber } from 'whisper-web-transcriber';

const RecorderComponent: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const transcriberRef = useRef<WhisperTranscriber | null>(null);

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setTranscript('');
      setResponse('');

      transcriberRef.current = new WhisperTranscriber({
        workerUrl: '/whisper-deps/helpers.js',
        serviceWorkerUrl: '/whisper-deps/coi-serviceworker.js',
        modelPath: '/models/whisper/whisper.bin',
        debug: false,
      });

      // Load model
      await transcriberRef.current.init();

      // Subscribe to transcription updates
      transcriberRef.current.onTranscription = (final) => {
        if (final && final.length > 0) {
          setTranscript(final[final.length - 1].text);
        }
      };

      // Start microphone
      await transcriberRef.current.start();
    } catch (err: any) {
      console.error('Could not start microphone:', err);
      alert('Could not start microphone. Check permissions or browser support.');
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      if (transcriberRef.current) {
        await transcriberRef.current.stop();
      }
      setIsRecording(false);

      // Send to backend
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: transcript }),
      });

      const data = await res.json();
      setResponse(data.response);

      // Speak the response
      const utterance = new SpeechSynthesisUtterance(data.response);
      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
      console.error('Error stopping recording:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center p-10 bg-gradient-to-br from-gray-900 to-black text-white rounded-xl shadow-lg w-full max-w-xl mx-auto mt-12">
      <h2 className="text-2xl font-bold">🎙️ AI Voice Assistant</h2>

      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-6 py-3 text-lg font-semibold rounded-md transition-all duration-300 ${
          isRecording
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isRecording ? 'Stop Recording' : 'Start Talking'}
      </button>

      {transcript && (
        <div className="bg-gray-800 p-4 rounded-md text-left w-full">
          <h3 className="font-semibold text-blue-400 mb-1">🗣️ You said:</h3>
          <p className="text-gray-100">{transcript}</p>
        </div>
      )}

      {response && (
        <div className="bg-gray-800 p-4 rounded-md text-left w-full">
          <h3 className="font-semibold text-green-400 mb-1">🤖 Assistant:</h3>
          <p className="text-gray-100">{response}</p>
        </div>
      )}
    </div>
  );
};

export default RecorderComponent;
