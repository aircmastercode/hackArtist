import React, { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';
import { useAuth } from '../context/AuthContext';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  folder?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 5,
  folder = 'products'
}) => {
  const { userProfile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateFileName = (file: File): string => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substr(2, 9);
    const fileExtension = file.name.split('.').pop();
    return `${folder}/${userProfile?.uid}/${timestamp}_${randomId}.${fileExtension}`;
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileName = generateFileName(file);
    const storageRef = ref(storage, fileName);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Check if adding these files would exceed the limit
    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images. Currently have ${images.length}.`);
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      alert('Please select only JPEG, PNG, or WebP images.');
      return;
    }

    // Validate file sizes (max 5MB each)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('Each image must be less than 5MB.');
      return;
    }

    setUploading(true);

    try {
      const uploadPromises = files.map(async (file, index) => {
        const progressKey = `${file.name}_${index}`;
        setUploadProgress(prev => ({ ...prev, [progressKey]: 0 }));

        try {
          const downloadURL = await uploadImage(file);
          setUploadProgress(prev => ({ ...prev, [progressKey]: 100 }));
          return downloadURL;
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error);
          setUploadProgress(prev => {
            const newProgress = { ...prev };
            delete newProgress[progressKey];
            return newProgress;
          });
          throw error;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      const newImages = [...images, ...uploadedUrls];
      onImagesChange(newImages);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Some images failed to upload. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const removeImage = async (imageUrl: string) => {
    try {
      // Extract the file path from the URL to delete from storage
      const url = new URL(imageUrl);
      const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);
      if (pathMatch) {
        const filePath = decodeURIComponent(pathMatch[1]);
        const storageRef = ref(storage, filePath);
        await deleteObject(storageRef);
      }

      // Remove from the images array
      const newImages = images.filter(img => img !== imageUrl);
      onImagesChange(newImages);
    } catch (error) {
      console.error('Error removing image:', error);
      // Still remove from UI even if storage deletion fails
      const newImages = images.filter(img => img !== imageUrl);
      onImagesChange(newImages);
    }
  };

  const reorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Product Images ({images.length}/{maxImages})
        </label>
        <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', margin: '0 0 12px 0' }}>
          Upload high-quality images of your craft. The first image will be used as the main product image.
        </p>
      </div>

      {/* Image Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '16px'
      }}>
        {images.map((imageUrl, index) => (
          <div
            key={imageUrl}
            style={{
              position: 'relative',
              aspectRatio: '1',
              borderRadius: '8px',
              overflow: 'hidden',
              border: index === 0 ? '2px solid var(--color-gold)' : '2px solid transparent'
            }}
            className="gold-frame"
          >
            <img
              src={imageUrl}
              alt={`Product ${index + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />

            {/* Main Image Badge */}
            {index === 0 && (
              <div style={{
                position: 'absolute',
                top: '4px',
                left: '4px',
                background: 'var(--color-gold)',
                color: 'black',
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '4px',
                fontWeight: 'bold'
              }}>
                MAIN
              </div>
            )}

            {/* Image Controls */}
            <div style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              display: 'flex',
              gap: '4px'
            }}>
              {/* Move Left */}
              {index > 0 && (
                <button
                  onClick={() => reorderImages(index, index - 1)}
                  style={{
                    background: 'rgba(0,0,0,0.7)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '4px',
                    padding: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  title="Move left"
                >
                  ←
                </button>
              )}

              {/* Move Right */}
              {index < images.length - 1 && (
                <button
                  onClick={() => reorderImages(index, index + 1)}
                  style={{
                    background: 'rgba(0,0,0,0.7)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '4px',
                    padding: '4px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                  title="Move right"
                >
                  →
                </button>
              )}

              {/* Remove */}
              <button
                onClick={() => removeImage(imageUrl)}
                style={{
                  background: 'rgba(255,0,0,0.8)',
                  border: 'none',
                  color: 'white',
                  borderRadius: '4px',
                  padding: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
                title="Remove image"
              >
                ×
              </button>
            </div>
          </div>
        ))}

        {/* Upload Button */}
        {images.length < maxImages && (
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              aspectRatio: '1',
              border: '2px dashed var(--color-gold)',
              borderRadius: '8px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              background: 'rgba(212,175,55,0.1)',
              opacity: uploading ? 0.5 : 1
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>+</div>
            <div style={{ fontSize: '12px', textAlign: 'center' }}>
              {uploading ? 'Uploading...' : 'Add Image'}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleFileSelect}
              disabled={uploading}
              style={{ display: 'none' }}
            />
          </label>
        )}
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', marginBottom: '8px' }}>Uploading images...</div>
          {Object.entries(uploadProgress).map(([key, progress]) => (
            <div key={key} style={{ marginBottom: '4px' }}>
              <div style={{ fontSize: '12px', marginBottom: '2px' }}>{key.split('_')[0]}</div>
              <div style={{
                width: '100%',
                height: '4px',
                background: 'rgba(212,175,55,0.2)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'var(--color-gold)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Guidelines */}
      <div style={{
        fontSize: '12px',
        color: 'var(--color-text-secondary)',
        background: 'rgba(212,175,55,0.1)',
        padding: '12px',
        borderRadius: '8px'
      }}>
        <strong>Image Guidelines:</strong>
        <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px' }}>
          <li>Upload up to {maxImages} high-quality images</li>
          <li>Supported formats: JPEG, PNG, WebP</li>
          <li>Maximum file size: 5MB per image</li>
          <li>First image will be the main product image</li>
          <li>Use natural lighting and clear backgrounds</li>
          <li>Show multiple angles and details</li>
        </ul>
      </div>
    </div>
  );
};

export default ImageUpload;