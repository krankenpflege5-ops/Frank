import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { removeWatermark } from './services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, AlertCircle, Wand2 } from 'lucide-react';

export default function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("Remove the watermark from this image");

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setOriginalImage(e.target.result as string);
        setEditedImage(null);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProcessImage = async () => {
    if (!originalImage) return;

    setLoading(true);
    setError(null);

    try {
      // Extract base64 data and mime type
      const match = originalImage.match(/^data:(.+);base64,(.+)$/);
      if (!match) {
        throw new Error("Invalid image format");
      }
      const mimeType = match[1];
      const base64Data = match[2];

      const result = await removeWatermark(base64Data, mimeType, prompt);
      setEditedImage(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to process image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setEditedImage(null);
    setError(null);
    setPrompt("Remove the watermark from this image");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <header className="bg-white border-b border-gray-200 py-4 px-6 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wand2 className="w-6 h-6 text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Watermark Remover
            </h1>
          </div>
          <p className="text-sm text-gray-500 hidden sm:block">
            Powered by Gemini 2.5 Flash Image
          </p>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!originalImage ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-2xl text-center space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                  Remove Watermarks Instantly
                </h2>
                <p className="text-lg text-gray-600 max-w-xl mx-auto">
                  Upload an image and let our AI magically erase watermarks, logos, and unwanted objects in seconds.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <ImageUploader onImageUpload={handleImageUpload} />
              </div>
            </motion.div>
          ) : !editedImage ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/2 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                    <img 
                      src={originalImage} 
                      alt="Preview" 
                      className="max-w-full max-h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
                      Editing Instruction
                    </label>
                    <textarea
                      id="prompt"
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none text-gray-900 placeholder-gray-400"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe what you want to remove..."
                    />
                    <p className="text-xs text-gray-500">
                      Tip: Be specific. E.g., "Remove the text in the bottom right corner" or "Remove the logo".
                    </p>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleReset}
                      className="flex-1 px-6 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleProcessImage}
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-indigo-600 rounded-xl text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Remove Watermark"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <ResultDisplay 
              originalImage={originalImage} 
              editedImage={editedImage} 
              onReset={handleReset} 
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
