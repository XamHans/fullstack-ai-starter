'use client';

import React, { useEffect, useRef } from 'react';
import { Dashboard, DashboardProps } from '@uppy/react';
import { useFileUpload, FileUploadOptions, FileUploadState } from '@/lib/hooks/useFileUpload';
import { cn } from '@/lib/utils';

import '@uppy/core/css/style.css';
import '@uppy/dashboard/css/style.css';

export interface UppyDashboardProps extends Omit<DashboardProps, 'uppy'> {
  uploadOptions?: FileUploadOptions;
  onStateChange?: (state: FileUploadState) => void;
  className?: string;
}

export function UppyDashboard({
  uploadOptions = {},
  onStateChange,
  className,
  ...dashboardProps
}: UppyDashboardProps) {
  const { uppy, state } = useFileUpload(uploadOptions);
  const stateRef = useRef(state);

  // Update state ref and call callback when state changes
  useEffect(() => {
    stateRef.current = state;
    onStateChange?.(state);
  }, [state, onStateChange]);

  if (!uppy) {
    return (
      <div className={cn("flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg", className)}>
        <div className="text-gray-500">Initializing upload...</div>
      </div>
    );
  }

  return (
    <div className={cn("uppy-dashboard-container", className)}>
      <Dashboard
        uppy={uppy}
        proudlyDisplayPoweredByUppy={false}
        showProgressDetails={true}
        note="Images, videos and PDFs only"
        {...dashboardProps}
      />
      {state.error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
          {state.error}
        </div>
      )}
      {state.success && state.uploadedFiles.length > 0 && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-green-600 text-sm">
          Successfully uploaded {state.uploadedFiles.length} file(s)
        </div>
      )}
    </div>
  );
}