import React, { useState, useRef, useCallback } from 'react';
import { Mic, Square } from 'lucide-react';
import { blobToBase64 } from '../utils/audioUtils';

interface RecorderButtonProps {
  onRecordingComplete: (base64Audio: string) => void;
  isProcessing: boolean;
}

const RecorderButton: React.FC<RecorderButtonProps> = ({ onRecordingComplete, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const base64 = await blobToBase64(blob);
        onRecordingComplete(base64);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Erro ao acessar o microfone. Verifique as permissões.");
    }
  }, [onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center animate-pulse">
        <div className="w-20 h-20 rounded-full bg-bible-gold/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-bible-gold/50 flex items-center justify-center">
                <Mic className="w-8 h-8 text-bible-paper animate-bounce" />
            </div>
        </div>
        <p className="mt-4 text-sm text-gray-400 font-medium tracking-wide">PROCESSANDO...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl ${
          isRecording 
            ? 'bg-red-500 shadow-red-500/50 scale-110' 
            : 'bg-bible-accent hover:bg-blue-500 shadow-blue-500/50'
        }`}
      >
        {isRecording && (
          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></span>
        )}
        {isRecording ? (
          <Square className="w-10 h-10 text-white fill-current" />
        ) : (
          <Mic className="w-10 h-10 text-white" />
        )}
      </button>
      <p className="mt-6 text-slate-400 font-light text-sm tracking-widest uppercase">
        {isRecording ? 'Ouvindo... Toque para parar' : 'Toque para Falar'}
      </p>
    </div>
  );
};

export default RecorderButton;