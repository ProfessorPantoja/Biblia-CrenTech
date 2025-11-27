
import React, { useState, useRef, useCallback } from 'react';
import { Mic, Square, Sparkles, Zap, Flame } from 'lucide-react';
import { blobToBase64 } from '../utils/audioUtils';
import { AppTheme } from '../types';

interface RecorderButtonProps {
  onRecordingComplete: (base64Audio: string) => void;
  isProcessing: boolean;
  theme: AppTheme;
}

const RecorderButton: React.FC<RecorderButtonProps> = ({ onRecordingComplete, isProcessing, theme }) => {
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
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Erro ao acessar o microfone.");
    }
  }, [onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  // --- THEME STYLING LOGIC ---
  const getThemeStyles = () => {
    if (isProcessing) return {
      container: "animate-pulse",
      button: "bg-gray-800 border-4 border-gray-600 cursor-wait",
      icon: <Sparkles className="w-8 h-8 text-yellow-400 animate-spin" />
    };

    if (isRecording) return {
      container: "scale-110",
      button: "bg-red-600 border-4 border-red-400 shadow-[0_0_30px_rgba(255,0,0,0.6)] animate-pulse",
      icon: <Square className="w-8 h-8 text-white fill-current" />
    };

    switch (theme) {
      case 'pentecostal':
        return {
          container: "btn-fire-container",
          button: "fire-core border-0 animate-fire-pulse",
          icon: <Flame className="w-10 h-10 text-yellow-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
        };
      case 'hitech':
        return {
          container: "relative",
          button: "bg-black border border-cyan-500 shadow-[0_0_15px_#00ffff] hover:shadow-[0_0_30px_#00ffff] transition-all",
          icon: <Zap className="w-8 h-8 text-cyan-400" />,
          extra: <div className="absolute inset-0 -m-1 radar-ring pointer-events-none"></div>
        };
      case 'jesus':
        return {
          container: "",
          button: "bg-[#f4ebd9] border border-amber-400 shadow-[0_0_20px_#d4af37] animate-glow",
          icon: <Mic className="w-8 h-8 text-amber-800" />
        };
      case 'medieval':
        return {
          container: "",
          button: "bg-[#8b4513] border-4 border-[#d4c5a3] shadow-lg rounded-full",
          icon: <Mic className="w-8 h-8 text-[#d4c5a3]" />
        };
      case 'catholic':
        return {
            container: "",
            button: "bg-slate-900 border border-slate-500 shadow-[0_0_20px_rgba(255,255,255,0.2)]",
            icon: <Mic className="w-8 h-8 text-yellow-500" />
        };
      default:
        return {
          container: "",
          // Use the 'animate-breathing-glow' class defined in index.html
          button: "bg-blue-600 hover:bg-blue-500 shadow-xl animate-breathing-glow border border-blue-400",
          icon: <Mic className="w-8 h-8 text-white" />
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`flex flex-col items-center justify-center transition-all duration-500 ${styles.container}`}>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${styles.button}`}
      >
        {styles.extra}
        {styles.icon}
      </button>
      <p className={`mt-4 font-bold text-xs tracking-widest uppercase transition-colors ${theme === 'hitech' ? 'text-cyan-400' : theme === 'pentecostal' ? 'text-orange-500' : 'text-slate-400'}`}>
        {isProcessing ? 'Processando...' : isRecording ? 'Ouvindo...' : 'Toque para Falar'}
      </p>
    </div>
  );
};

export default RecorderButton;
