import React from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface ResultDisplayProps {
  originalImage: string;
  editedImage: string;
  onReset: () => void;
}

export function ResultDisplay({ originalImage, editedImage, onReset }: ResultDisplayProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = 'edited-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center w-full max-w-4xl mx-auto space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Original</h3>
          <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-gray-50">
            <img
              src={originalImage}
              alt="Original"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Edited</h3>
          <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-lg border border-indigo-100 bg-indigo-50">
            <img
              src={editedImage}
              alt="Edited"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="flex items-center px-6 py-3 bg-white border border-gray-300 rounded-full text-gray-700 font-medium shadow-sm hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          Try Another
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="flex items-center px-6 py-3 bg-indigo-600 rounded-full text-white font-medium shadow-md hover:bg-indigo-700 transition-colors"
        >
          <Download className="w-5 h-5 mr-2" />
          Download Result
        </motion.button>
      </div>
    </motion.div>
  );
}
