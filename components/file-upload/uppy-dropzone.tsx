'use client';

import React, { useCallback, useState } from 'react';
import { useFileUpload, FileUploadOptions, FileUploadState } from '@/lib/hooks/useFileUpload';
import { cn } from '@/lib/utils';
import { Upload, X, Check, Loader2 } from 'lucide-react';

export interface UppyDropzoneProps {
  uploadOptions?: FileUploadOptions;
  onStateChange?: (state: FileUploadState) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  showPreview?: boolean;
}

export function UppyDropzone({
  uploadOptions = {},
  onStateChange,
  className,
  children,
  disabled = false,
  showPreview = true,
}: UppyDropzoneProps) {
  const { uppy, state, addFiles } = useFileUpload({
    autoProceed: true,
    ...uploadOptions,
  });

  const [dragActive, setDragActive] = useState(false);
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);

  React.useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [disabled]);

  const handleFiles = useCallback((files: File[]) => {
    addFiles(files);

    if (showPreview) {
      // Generate previews for images
      const newPreviews = files
        .filter(file => file.type.startsWith('image/'))
        .map(file => ({
          file,
          url: URL.createObjectURL(file),
        }));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  }, [addFiles, showPreview]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  }, [handleFiles]);

  const removePreview = useCallback((index: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].url);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  }, []);

  // Cleanup URLs on unmount
  React.useEffect(() => {
    return () => {
      previews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-colors",
          {
            "border-blue-400 bg-blue-50": dragActive,
            "border-green-400 bg-green-50": state.success,
            "border-red-400 bg-red-50": state.error,
            "opacity-50 cursor-not-allowed": disabled,
            "hover:border-gray-400 cursor-pointer": !disabled && !dragActive,
          }
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple={uploadOptions.maxNumberOfFiles !== 1}
          accept={uploadOptions.allowedFileTypes?.join(',')}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        {children || (
          <div className="space-y-2">
            {state.uploading ? (
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
            ) : state.success ? (
              <Check className="mx-auto h-8 w-8 text-green-500" />
            ) : (
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
            )}

            <div className="text-sm text-gray-600">
              {state.uploading ? (
                <span>Uploading... {state.progress}%</span>
              ) : state.success ? (
                <span className="text-green-600">Upload successful!</span>
              ) : (
                <>
                  <span className="font-medium">Click to upload</span>
                  <span className="block">or drag and drop files here</span>
                </>
              )}
            </div>

            {!state.uploading && !state.success && (
              <div className="text-xs text-gray-500">
                {uploadOptions.allowedFileTypes?.join(', ') || 'Any file type'} •
                Max {uploadOptions.maxFileSize ? Math.round((uploadOptions.maxFileSize || 0) / 1024 / 1024) : 10}MB
              </div>
            )}
          </div>
        )}

        {state.uploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-500 mb-2" />
              <div className="text-sm text-gray-600">Uploading {state.progress}%</div>
            </div>
          </div>
        )}
      </div>

      {state.error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {state.error}
        </div>
      )}

      {showPreview && previews.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview.url}
                alt={preview.file.name}
                className="w-full h-24 object-cover rounded border"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePreview(index);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b truncate">
                {preview.file.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {state.uploadedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
          {state.uploadedFiles.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded text-sm">
              <span className="text-green-700">{file.filename}</span>
              <span className="text-green-600 text-xs">{Math.round(file.size / 1024)}KB</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}