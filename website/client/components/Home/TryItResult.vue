<script setup lang="ts">
import type { FileInfo, PackResult } from '../api/client';
import TryItFileSelection from './TryItFileSelection.vue';
import TryItResultContent from './TryItResultContent.vue';
import TryItResultErrorContent from './TryItResultErrorContent.vue';

interface Props {
  result?: PackResult | null;
  loading?: boolean;
  error?: string | null;
  repositoryUrl?: string;
}

interface Emits {
  (e: 'repack', selectedFiles: FileInfo[]): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const handleRepack = (selectedFiles: FileInfo[]) => {
  emit('repack', selectedFiles);
};
</script>

<template>
  <div class="result-container">
    <div
      v-if="loading"
      class="loading-container"
    >
      <div class="spinner"></div>
      <p>Processing repository...</p>
      <div class="sponsor-section">
        <p class="sponsor-header">Special thanks to:</p>
        <a href="https://go.warp.dev/repomix" target="_blank" rel="noopener noreferrer">
          <img alt="Warp sponsorship" width="400" src="https://raw.githubusercontent.com/warpdotdev/brand-assets/main/Github/Sponsor/Warp-Github-LG-01.png">
        </a>
        <p class="sponsor-title">
          <a href="https://go.warp.dev/repomix" target="_blank" rel="noopener noreferrer">
            Warp, built for coding with multiple AI agents
          </a>
        </p>
        <p class="sponsor-subtitle">
          <a href="https://go.warp.dev/repomix" target="_blank" rel="noopener noreferrer">
            Available for MacOS, Linux, & Windows
          </a>
        </p>
      </div>
    </div>
    <TryItResultErrorContent
      v-else-if="error"
      :message="error"
      :repository-url="repositoryUrl"
    />
    <TryItResultContent
      v-else-if="result"
      :result="result"
    />
    <TryItFileSelection
      v-if="result?.metadata?.allFiles && result.metadata.allFiles.length > 0"
      :all-files="result.metadata.allFiles"
      :loading="loading"
      @repack="handleRepack"
    />
  </div>
</template>

<style scoped>
.result-container {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  margin-top: 16px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--vp-c-border);
  border-top: 3px solid var(--vp-c-brand-1);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-text {
  color: var(--vp-c-text-2);
  font-size: 14px;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.sponsor-section {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sponsor-section p {
  margin: 8px 0;
}

.sponsor-section .sponsor-header {
  font-size: 0.9em;
}

.sponsor-section img {
  max-width: 100%;
  height: auto;
  margin: 12px 0;
}

.sponsor-section .sponsor-title {
  font-weight: bold;
  font-size: 1.1em;
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

.sponsor-section .sponsor-subtitle {
  font-size: 0.9em;
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}
</style>
