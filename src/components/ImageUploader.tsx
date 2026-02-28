import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { motion } from 'motion/react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0]);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1
  });

  // Extract conflicting props
  const { 
    onAnimationStart: _onAnimationStart,
    onDragStart: _onDragStart,
    onDragEnd: _onDragEnd,
    onDrag: _onDrag,
    ...rootProps 
  } = getRootProps();

  return (
    <motion.div
      {...rootProps}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors
        ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}`}
    >
      <input {...getInputProps()} />
      <Upload className={`w-12 h-12 mb-4 ${isDragActive ? 'text-indigo-500' : 'text-gray-400'}`} />
      <p className="text-center text-gray-600 font-medium">
        {isDragActive ? "Drop the image here..." : "Drag & drop an image, or click to select"}
      </p>
      <p className="text-center text-gray-400 text-sm mt-2">
        Supports PNG, JPG, WEBP
      </p>
    </motion.div>
  );
}
