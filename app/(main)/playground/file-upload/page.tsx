'use client';

import { analytics } from '@/lib/services/analytics';
import React, { useState } from 'react';
import { UppyDashboard, UppyDropzone, UppyButton } from '@/components/file-upload';
import { FileUploadState } from '@/lib/hooks/useFileUpload';
import { fileUploadService } from '@/lib/services/file-upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Upload,
  Image as ImageIcon,
  Video,
  FileText,
  Settings,
  Trash2,
  Download,
  Eye,
  Info
} from 'lucide-react';

interface UploadedFile {
  url: string;
  key: string;
  filename: string;
  size: number;
  contentType: string;
  uploadedAt: Date;
}

export default function FileUploadPlayground() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [settings, setSettings] = useState({
    maxFileSize: 10,
    maxFiles: 5,
    compressionEnabled: true,
    uploadMethod: 'xhr' as 'xhr' | 's3' | 'tus',
    allowedTypes: ['image/*', 'video/*', 'application/pdf'],
  });

  const handleStateChange = (state: FileUploadState, uploadType: string) => {
    if (state.success && state.uploadedFiles.length > 0) {
      const newFiles: UploadedFile[] = state.uploadedFiles.map(file => ({
        ...file,
        uploadedAt: new Date(),
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);

      // Track successful upload
      analytics.file.upload.success({
        uploadType: uploadType,
        fileCount: state.uploadedFiles.length,
        totalSize: state.uploadedFiles.reduce((acc, file) => acc + file.size, 0),
        fileTypes: [...new Set(state.uploadedFiles.map(file => file.contentType.split('/')[0]))],
      });
    }

    // Track upload errors
    if (state.error) {
      analytics.file.upload.error({
        uploadType: uploadType,
        errorMessage: state.error
      });
    }
  };

  const deleteFile = async (key: string) => {
    const result = await fileUploadService.deleteFile(key);
    if (result.success) {
      setUploadedFiles(prev => prev.filter(file => file.key !== key));

      // Track file deletion
      analytics.file.delete({ fileName: key });
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) return <ImageIcon className="h-4 w-4" />;
    if (contentType.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  const uploadOptions = {
    maxFileSize: settings.maxFileSize * 1024 * 1024,
    maxNumberOfFiles: settings.maxFiles,
    allowedFileTypes: settings.allowedTypes,
    compressionEnabled: settings.compressionEnabled,
    uploadMethod: settings.uploadMethod,
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold gradient-text">File Upload Playground</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Test different file upload components and configurations powered by Uppy 5.0 and your R2 storage.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary">Uppy 5.0</Badge>
          <Badge variant="secondary">R2 Storage</Badge>
          <Badge variant="secondary">Next.js 15</Badge>
          <Badge variant="secondary">Resumable Uploads</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Upload Settings
            </CardTitle>
            <CardDescription>
              Configure upload behavior and test different scenarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
              <Input
                id="maxFileSize"
                type="number"
                value={settings.maxFileSize}
                onChange={(e) => setSettings(prev => ({ ...prev, maxFileSize: Number(e.target.value) }))}
                min="1"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxFiles">Max Number of Files</Label>
              <Input
                id="maxFiles"
                type="number"
                value={settings.maxFiles}
                onChange={(e) => setSettings(prev => ({ ...prev, maxFiles: Number(e.target.value) }))}
                min="1"
                max="20"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="compression">Image Compression</Label>
              <Switch
                id="compression"
                checked={settings.compressionEnabled}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, compressionEnabled: checked }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Method</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['xhr', 's3', 'tus'] as const).map((method) => (
                  <Button
                    key={method}
                    variant={settings.uploadMethod === method ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSettings(prev => ({ ...prev, uploadMethod: method }));
                      // Track upload method change
                      analytics.ui.uploadMethodChange(method);
                    }}
                  >
                    {method.toUpperCase()}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Allowed File Types</Label>
              <div className="space-y-2">
                {['image/*', 'video/*', 'application/pdf'].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Switch
                      checked={settings.allowedTypes.includes(type)}
                      onCheckedChange={(checked) => {
                        setSettings(prev => ({
                          ...prev,
                          allowedTypes: checked
                            ? [...prev.allowedTypes, type]
                            : prev.allowedTypes.filter(t => t !== type)
                        }));
                      }}
                    />
                    <Label className="text-sm">{type}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Components */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="dropzone">Dropzone</TabsTrigger>
              <TabsTrigger value="button">Button</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Uppy Dashboard</CardTitle>
                  <CardDescription>
                    Full-featured upload interface with drag & drop, progress tracking, and file management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UppyDashboard
                    uploadOptions={uploadOptions}
                    onStateChange={(state) => handleStateChange(state, 'dashboard')}
                    width="100%"
                    height={350}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="dropzone" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Uppy Dropzone</CardTitle>
                  <CardDescription>
                    Minimalist drag & drop interface with file previews
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UppyDropzone
                    uploadOptions={uploadOptions}
                    onStateChange={(state) => handleStateChange(state, 'dropzone')}
                    showPreview={true}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="button" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Uppy Button</CardTitle>
                  <CardDescription>
                    Simple button interface for quick file uploads
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <UppyButton
                      uploadOptions={{ ...uploadOptions, maxNumberOfFiles: 1 }}
                      onStateChange={(state) => handleStateChange(state, 'button-single')}
                      variant="default"
                    >
                      Single File
                    </UppyButton>

                    <UppyButton
                      uploadOptions={uploadOptions}
                      onStateChange={(state) => handleStateChange(state, 'button-multiple')}
                      variant="outline"
                    >
                      Multiple Files
                    </UppyButton>

                    <UppyButton
                      uploadOptions={{ ...uploadOptions, allowedFileTypes: ['image/*'] }}
                      onStateChange={(state) => handleStateChange(state, 'button-images')}
                      variant="secondary"
                    >
                      Images Only
                    </UppyButton>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Upload Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Examples</CardTitle>
              <CardDescription>
                Specialized upload scenarios for different use cases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Profile Picture Upload</h4>
                  <UppyDropzone
                    uploadOptions={{
                      maxFileSize: 5 * 1024 * 1024, // 5MB
                      maxNumberOfFiles: 1,
                      allowedFileTypes: ['image/*'],
                      compressionEnabled: true,
                    }}
                    onStateChange={(state) => handleStateChange(state, 'profile')}
                    className="h-32"
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Upload Profile Picture</span>
                      <span className="text-xs text-gray-500">Max 5MB, Images only</span>
                    </div>
                  </UppyDropzone>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Document Upload</h4>
                  <UppyDropzone
                    uploadOptions={{
                      maxFileSize: 20 * 1024 * 1024, // 20MB
                      maxNumberOfFiles: 10,
                      allowedFileTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                      compressionEnabled: false,
                    }}
                    onStateChange={(state) => handleStateChange(state, 'documents')}
                    className="h-32"
                    showPreview={false}
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <FileText className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Upload Documents</span>
                      <span className="text-xs text-gray-500">PDF, DOC, DOCX up to 20MB</span>
                    </div>
                  </UppyDropzone>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Uploaded Files ({uploadedFiles.length})</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const fileCount = uploadedFiles.length;
                  setUploadedFiles([]);
                  // Track bulk file clear
                  analytics.file.clearAll({ fileCount });
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </CardTitle>
            <CardDescription>
              Manage your uploaded files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {uploadedFiles.map((file, index) => (
                <Card key={`${file.key}-${index}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {getFileIcon(file.contentType)}
                        <span className="font-medium truncate">{file.filename}</span>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            window.open(file.url, '_blank');
                            // Track file view
                            analytics.file.view({ fileType: file.contentType });
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            const a = document.createElement('a');
                            a.href = file.url;
                            a.download = file.filename;
                            a.click();
                            // Track file download
                            analytics.file.download({
                              fileType: file.contentType,
                              fileSize: file.size
                            });
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={() => deleteFile(file.key)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>Size: {formatFileSize(file.size)}</div>
                      <div>Type: {file.contentType}</div>
                      <div>Uploaded: {file.uploadedAt.toLocaleTimeString()}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Information */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Playground Features:</strong> Test different upload methods (XHR, S3, TUS),
          configure file restrictions, enable/disable compression, and see real-time upload progress.
          All files are uploaded to your configured R2 storage bucket.
        </AlertDescription>
      </Alert>
    </div>
  );
}