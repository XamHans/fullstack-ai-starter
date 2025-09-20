'use client';

import React, { useCallback, useRef } from 'react';
import { useFileUpload, FileUploadOptions, FileUploadState } from '@/lib/hooks/useFileUpload';
import { cn } from '@/lib/utils';
import { Upload, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface UppyButtonProps {
  uploadOptions?: FileUploadOptions;
  onStateChange?: (state: FileUploadState) => void;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
  disabled?: boolean;
  showProgress?: boolean;
}

export function UppyButton({
  uploadOptions = {},
  onStateChange,
  className,
  variant = 'default',
  size = 'default',
  children,
  disabled = false,
  showProgress = true,
}: UppyButtonProps) {
  const { uppy, state, addFiles } = useFileUpload({
    autoProceed: true,
    ...uploadOptions,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);

  const handleClick = useCallback(() => {
    if (disabled || state.uploading) return;
    fileInputRef.current?.click();
  }, [disabled, state.uploading]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      addFiles(files);
    }
  }, [addFiles]);

  const getButtonContent = () => {
    if (state.uploading) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {showProgress ? `Uploading ${state.progress}%` : 'Uploading...'}
        </>
      );
    }

    if (state.success) {
      return (
        <>
          <Check className="mr-2 h-4 w-4" />
          Uploaded Successfully
        </>
      );
    }

    if (state.error) {
      return (
        <>
          <AlertCircle className="mr-2 h-4 w-4" />
          Upload Failed
        </>
      );
    }

    return (
      children || (
        <>
          <Upload className="mr-2 h-4 w-4" />
          Choose Files
        </>
      )
    );
  };

  const getButtonVariant = () => {
    if (state.success) return 'default';
    if (state.error) return 'destructive';
    return variant;
  };

  return (
    <div className={cn("inline-block", className)}>
      <input
        ref={fileInputRef}
        type="file"
        multiple={uploadOptions.maxNumberOfFiles !== 1}
        accept={uploadOptions.allowedFileTypes?.join(',')}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || state.uploading}
      />

      <Button
        variant={getButtonVariant()}
        size={size}
        onClick={handleClick}
        disabled={disabled || state.uploading}
        className={cn(
          "transition-all duration-200",
          state.uploading && "cursor-not-allowed",
          state.success && "bg-green-600 hover:bg-green-700"
        )}
      >
        {getButtonContent()}
      </Button>

      {state.error && (
        <div className="mt-2 text-sm text-red-600">
          {state.error}
        </div>
      )}

      {state.uploadedFiles.length > 0 && (
        <div className="mt-2 text-sm text-green-600">
          {state.uploadedFiles.length} file(s) uploaded successfully
        </div>
      )}
    </div>
  );
}