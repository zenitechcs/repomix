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
    <TryItResultErrorContent
      v-if="error"
      :error="error"
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
    <div
      v-else-if="loading"
      class="loading-container"
    >
      <div class="loading-spinner"></div>
      <p class="loading-text">Processing repository...</p>
    </div>
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
</style>
