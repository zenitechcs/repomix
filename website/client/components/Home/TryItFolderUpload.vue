<script setup lang="ts">
import JSZip from 'jszip';
import { AlertTriangle, Folder } from 'lucide-vue-next';
import { ref } from 'vue';
import PackButton from './PackButton.vue';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const props = defineProps<{
  loading: boolean;
  showButton?: boolean;
}>();

const emit = defineEmits<{
  upload: [file: File];
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const dragActive = ref(false);
const selectedFolder = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

function validateFolder(files: FileList): boolean {
  errorMessage.value = null;

  let totalSize = 0;
  for (const file of files) {
    totalSize += file.size;
  }

  if (totalSize > MAX_FILE_SIZE) {
    const sizeMB = (totalSize / (1024 * 1024)).toFixed(1);
    errorMessage.value = `File size (${sizeMB}MB) exceeds the 10MB limit`;
    return false;
  }

  return true;
}

async function getZipFile(files: FileList, folderName) {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.webkitRelativePath, file);
  }

  const zipBlob = await zip.generateAsync({
    type: 'blob',
  });
  const zipFile = new File([zipBlob], folderName.concat('.zip'));
  return zipFile;
}

async function handleFileSelect(files: FileList | null) {
  if (!files || files.length === 0) return;

  const relativePath = files[0].webkitRelativePath;
  const folderName = relativePath.split('/')[0];
  const zipFile = await getZipFile(files, folderName);

  if (validateFolder(files)) {
    selectedFolder.value = folderName;
    emit('upload', zipFile);
  } else {
    selectedFolder.value = null;
  }
}

function triggerFileInput() {
  fileInput.value?.click();
}
</script>

<template>
  <div class="upload-wrapper">
    <div class="upload-container"
         :class="{ 'drag-active': dragActive, 'has-error': errorMessage }"
         @dragover.prevent="dragActive = true"
         @dragleave="dragActive = false"
         @drop.prevent="handleFileSelect($event.dataTransfer?.files || null)"
         @click="triggerFileInput"
    >
      <input
        ref="fileInput"
        type="file"
        directory
        webkitdirectory
        mozdirectory
        class="hidden-input"
        @change="(e) => handleFileSelect((e.target as HTMLInputElement).files)"
      />
      <div class="upload-content">
        <div class="upload-icon">
          <AlertTriangle v-if="errorMessage" class="icon-error" size="20" />
          <Folder v-else class="icon-folder" size="20" />
        </div>
        <div class="upload-text">
          <p v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </p>
          <p v-else-if="selectedFolder" class="selected-file">
            Selected: {{ selectedFolder }}
            <button class="clear-button" @click.stop="selectedFolder = null">×</button>
          </p>
          <template v-else>
            <p>Drop your folder here or click to browse (max 10MB)</p>
          </template>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showButton" class="pack-button-container">
    <PackButton
      :loading="loading"
      :isValid="!!selectedFolder"
    />
  </div>
</template>

<style scoped>
.upload-wrapper {
  width: 100%;
}

.upload-container {
  border: 2px dashed var(--vp-c-border);
  border-radius: 8px;
  padding: 0 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 50px;
  display: flex;
  align-items: center;
  background: var(--vp-c-bg);
  user-select: none;
}

.upload-container:hover {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-soft);
}

.drag-active {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-soft);
}

.has-error {
  border-color: var(--vp-c-danger-1);
}

.hidden-input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  width: 100%;
  pointer-events: none; /* Allow clicks to pass through to container */
}

.upload-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-folder {
  color: var(--vp-c-text-1);
}

.icon-error {
  color: var(--vp-c-danger-1);
}

.upload-text {
  flex: 1;
  font-size: 14px;
}

.upload-text p {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.error-message {
  color: var(--vp-c-danger-1);
}

.selected-file {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.clear-button {
  background: none;
  border: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 1.2em;
  padding: 0 4px;
  line-height: 1;
  flex-shrink: 0;
  pointer-events: auto; /* Re-enable pointer events for button */
}

.clear-button:hover {
  color: var(--vp-c-text-1);
}

.pack-button-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

@media (max-width: 640px) {
  .upload-text p {
    font-size: 13px;
  }
}
</style>
