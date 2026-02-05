// ============================================
// PHOTO SERVICE - Supabase Storage Integration
// ============================================

import { supabase } from './supabase-client.js';
import { showToast } from './animations.js';

class PhotoService {
    constructor() {
        this.bucketName = 'profile-photos';
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    }

    /**
     * Initialize storage bucket (call once on app start)
     */
    async initializeBucket() {
        if (!supabase) {
            console.warn('Supabase not configured, photo upload disabled');
            return false;
        }

        try {
            const { data: buckets } = await supabase.storage.listBuckets();
            const bucketExists = buckets?.some(b => b.name === this.bucketName);

            if (!bucketExists) {
                await supabase.storage.createBucket(this.bucketName, {
                    public: true,
                    fileSizeLimit: this.maxFileSize
                });
                console.log('Profile photos bucket created');
            }
            return true;
        } catch (error) {
            console.error('Error initializing bucket:', error);
            return false;
        }
    }

    /**
     * Validate file before upload
     */
    validateFile(file) {
        if (!file) {
            return { valid: false, error: 'No file selected' };
        }

        if (!this.allowedTypes.includes(file.type)) {
            return { valid: false, error: 'Invalid file type. Use JPG, PNG, WebP, or GIF' };
        }

        if (file.size > this.maxFileSize) {
            return { valid: false, error: 'File too large. Max 5MB' };
        }

        return { valid: true };
    }

    /**
     * Compress and resize image
     */
    async compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = (e) => {
                const img = new Image();
                img.src = e.target.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Calculate new dimensions
                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width;
                            width = maxWidth;
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height;
                            height = maxHeight;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob(
                        (blob) => {
                            resolve(new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now()
                            }));
                        },
                        'image/jpeg',
                        quality
                    );
                };

                img.onerror = reject;
            };

            reader.onerror = reject;
        });
    }

    /**
     * Upload photo to Supabase Storage
     */
    async uploadPhoto(file, userId) {
        if (!supabase) {
            showToast('Photo upload unavailable (offline mode)', 'error');
            return null;
        }

        // Validate file
        const validation = this.validateFile(file);
        if (!validation.valid) {
            showToast(validation.error, 'error');
            return null;
        }

        try {
            // Compress image
            const compressedFile = await this.compressImage(file);

            // Generate unique filename
            const fileExt = compressedFile.name.split('.').pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;
            const filePath = `${userId}/${fileName}`;

            // Upload to Supabase
            const { data, error } = await supabase.storage
                .from(this.bucketName)
                .upload(filePath, compressedFile, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (error) {
                console.error('Upload error:', error);
                showToast('Failed to upload photo', 'error');
                return null;
            }

            // Get public URL
            const { data: urlData } = supabase.storage
                .from(this.bucketName)
                .getPublicUrl(filePath);

            showToast('Photo uploaded! 📸', 'success');
            return urlData.publicUrl;
        } catch (error) {
            console.error('Upload error:', error);
            showToast('Failed to upload photo', 'error');
            return null;
        }
    }

    /**
     * Delete photo from storage
     */
    async deletePhoto(photoUrl, userId) {
        if (!supabase || !photoUrl) return false;

        try {
            // Extract file path from URL
            const urlParts = photoUrl.split('/');
            const filePath = `${userId}/${urlParts[urlParts.length - 1]}`;

            const { error } = await supabase.storage
                .from(this.bucketName)
                .remove([filePath]);

            if (error) {
                console.error('Delete error:', error);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Delete error:', error);
            return false;
        }
    }

    /**
     * Get photo URL or fallback to emoji
     */
    getPhotoOrFallback(photoUrl, fallbackEmoji = '🎮') {
        return photoUrl || fallbackEmoji;
    }
}

export const photoService = new PhotoService();
