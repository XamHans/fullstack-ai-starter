'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Uppy, { UppyFile, UppyOptions } from '@uppy/core';
import XHRUpload from '@uppy/xhr-upload';
import AwsS3 from '@uppy/aws-s3';
import Tus from '@uppy/tus';
import Compressor from '@uppy/compressor';

export interface FileUploadOptions {
  maxFileSize?: number;
  maxNumberOfFiles?: number;
  allowedFileTypes?: string[];
  autoProceed?: boolean;
  uploadMethod?: 'xhr' | 's3' | 'tus';
  compressionEnabled?: boolean;
  endpoint?: string;
  meta?: Record<string, any>;
}

export interface UploadResult {
  url: string;
  key: string;
  filename: string;
  size: number;
  contentType: string;
}

export interface FileUploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
  uploadedFiles: UploadResult[];
}

export function useFileUpload(options: FileUploadOptions = {}) {
  const {
    maxFileSize = 10 * 1024 * 1024, // 10MB
    maxNumberOfFiles = 1,
    allowedFileTypes = ['image/*', 'video/*', 'application/pdf'],
    autoProceed = false,
    uploadMethod = 'xhr',
    compressionEnabled = true,
    endpoint = '/api/upload',
    meta = {},
  } = options;

  const uppyRef = useRef<Uppy | null>(null);
  const [state, setState] = useState<FileUploadState>({
    uploading: false,
    progress: 0,
    error: null,
    success: false,
    uploadedFiles: [],
  });

  // Initialize Uppy instance
  const initializeUppy = useCallback(() => {
    if (uppyRef.current) {
      uppyRef.current.destroy();
    }

    const uppyOptions: UppyOptions = {
      restrictions: {
        maxFileSize,
        maxNumberOfFiles,
        allowedFileTypes,
      },
      autoProceed,
      meta,
      onBeforeFileAdded: (currentFile) => {
        // Additional validation can be added here
        return true;
      },
    };

    const uppy = new Uppy(uppyOptions);

    // Add compression plugin if enabled
    if (compressionEnabled) {
      uppy.use(Compressor, {
        quality: 0.8,
        limit: 5,
      });
    }

    // Configure upload method
    switch (uploadMethod) {
      case 'xhr':
        uppy.use(XHRUpload, {
          endpoint,
          formData: true,
          fieldName: 'file',
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        });
        break;

      case 's3':
        uppy.use(AwsS3, {
          getUploadParameters: async (file) => {
            const response = await fetch(`${endpoint}?filename=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`);
            const data = await response.json();

            return {
              method: 'PUT',
              url: data.presignedUrl,
              fields: {},
              headers: {
                'Content-Type': file.type,
              },
            };
          },
        });
        break;

      case 'tus':
        uppy.use(Tus, {
          endpoint: `${endpoint}/tus`,
          resume: true,
          removeFingerprintOnSuccess: true,
        });
        break;
    }

    // Event handlers
    uppy.on('upload', () => {
      setState(prev => ({ ...prev, uploading: true, error: null, success: false }));
    });

    uppy.on('upload-progress', (file, progress) => {
      const percentage = Math.round((progress.bytesUploaded / progress.bytesTotal) * 100);
      setState(prev => ({ ...prev, progress: percentage }));
    });

    uppy.on('upload-success', (file, response) => {
      const uploadResult: UploadResult = {
        url: response.body?.url || response.uploadURL,
        key: response.body?.key || file.name,
        filename: file.name,
        size: file.size,
        contentType: file.type,
      };

      setState(prev => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, uploadResult],
        success: true,
      }));
    });

    uppy.on('upload-error', (file, error) => {
      setState(prev => ({
        ...prev,
        error: error.message || 'Upload failed',
        uploading: false,
      }));
    });

    uppy.on('complete', (result) => {
      setState(prev => ({
        ...prev,
        uploading: false,
        progress: 100,
      }));
    });

    uppyRef.current = uppy;
    return uppy;
  }, [
    maxFileSize,
    maxNumberOfFiles,
    allowedFileTypes,
    autoProceed,
    uploadMethod,
    compressionEnabled,
    endpoint,
    meta,
  ]);

  // Initialize Uppy on mount
  useEffect(() => {
    const uppy = initializeUppy();
    return () => {
      if (uppy) {
        uppy.destroy();
      }
    };
  }, [initializeUppy]);

  // Helper functions
  const addFiles = useCallback((files: File[]) => {
    if (!uppyRef.current) return;

    files.forEach((file) => {
      try {
        uppyRef.current?.addFile({
          name: file.name,
          type: file.type,
          data: file,
          size: file.size,
        });
      } catch (error) {
        console.error('Error adding file:', error);
        setState(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Failed to add file',
        }));
      }
    });
  }, []);

  const removeFile = useCallback((fileId: string) => {
    if (!uppyRef.current) return;
    uppyRef.current.removeFile(fileId);
  }, []);

  const upload = useCallback(() => {
    if (!uppyRef.current) return;
    uppyRef.current.upload();
  }, []);

  const reset = useCallback(() => {
    if (!uppyRef.current) return;
    uppyRef.current.reset();
    setState({
      uploading: false,
      progress: 0,
      error: null,
      success: false,
      uploadedFiles: [],
    });
  }, []);

  const cancelUpload = useCallback(() => {
    if (!uppyRef.current) return;
    uppyRef.current.cancelAll();
    setState(prev => ({ ...prev, uploading: false, error: null }));
  }, []);

  return {
    uppy: uppyRef.current,
    state,
    addFiles,
    removeFile,
    upload,
    reset,
    cancelUpload,
  };
}