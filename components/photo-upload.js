// ============================================
// PHOTO UPLOAD COMPONENT
// ============================================

import { photoService } from '../js/photo-service.js';
import { state } from '../js/state-manager.js';
import { showToast } from '../js/animations.js';

export function createPhotoUpload(onPhotoUploaded) {
    const container = document.createElement('div');
    container.className = 'photo-upload-container';

    container.innerHTML = `
    <div class="photo-upload-zone" id="upload-zone">
      <input 
        type="file" 
        id="photo-input" 
        accept="image/jpeg,image/png,image/webp,image/gif"
        style="display: none;"
      />
      
      <div class="upload-content" id="upload-content">
        <div class="upload-icon">📸</div>
        <div class="upload-text">
          <p class="upload-title">Upload Photo</p>
          <p class="upload-subtitle">Click or drag & drop</p>
          <p class="upload-hint">JPG, PNG, WebP, GIF (Max 5MB)</p>
        </div>
      </div>

      <div class="upload-preview" id="upload-preview" style="display: none;">
        <img id="preview-image" alt="Preview" />
        <div class="preview-actions">
          <button class="btn btn-sm btn-primary" id="upload-btn">💾 Upload</button>
          <button class="btn btn-sm btn-secondary" id="cancel-btn">❌ Cancel</button>
        </div>
      </div>

      <div class="upload-progress" id="upload-progress" style="display: none;">
        <div class="progress-bar">
          <div class="progress-fill" id="progress-fill"></div>
        </div>
        <p class="progress-text">Uploading...</p>
      </div>
    </div>
  `;

    let selectedFile = null;

    // Get elements
    const uploadZone = container.querySelector('#upload-zone');
    const photoInput = container.querySelector('#photo-input');
    const uploadContent = container.querySelector('#upload-content');
    const uploadPreview = container.querySelector('#upload-preview');
    const uploadProgress = container.querySelector('#upload-progress');
    const previewImage = container.querySelector('#preview-image');
    const uploadBtn = container.querySelector('#upload-btn');
    const cancelBtn = container.querySelector('#cancel-btn');

    // Click to upload
    uploadZone.addEventListener('click', (e) => {
        if (e.target.id !== 'upload-btn' && e.target.id !== 'cancel-btn') {
            photoInput.click();
        }
    });

    // File selected
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });

    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('drag-over');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('drag-over');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('drag-over');

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    });

    // Handle file selection
    function handleFileSelect(file) {
        const validation = photoService.validateFile(file);
        if (!validation.valid) {
            showToast(validation.error, 'error');
            return;
        }

        selectedFile = file;

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            uploadContent.style.display = 'none';
            uploadPreview.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }

    // Upload button
    uploadBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        const user = state.get('user');
        const userId = user.id || 'demo-user';

        // Show progress
        uploadPreview.style.display = 'none';
        uploadProgress.style.display = 'flex';

        // Upload photo
        const photoUrl = await photoService.uploadPhoto(selectedFile, userId);

        if (photoUrl) {
            // Update user state
            state.update('user', {
                ...user,
                photoUrl
            });

            // Callback
            if (onPhotoUploaded) {
                onPhotoUploaded(photoUrl);
            }

            // Reset
            resetUpload();
        } else {
            // Show upload content again on error
            uploadProgress.style.display = 'none';
            uploadPreview.style.display = 'flex';
        }
    });

    // Cancel button
    cancelBtn.addEventListener('click', () => {
        resetUpload();
    });

    function resetUpload() {
        selectedFile = null;
        photoInput.value = '';
        uploadContent.style.display = 'flex';
        uploadPreview.style.display = 'none';
        uploadProgress.style.display = 'none';
    }

    return container;
}
