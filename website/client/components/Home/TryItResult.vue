<script setup lang="ts">
import type { FileInfo, PackResult } from '../api/client';
import TryItFileSelection from './TryItFileSelection.vue';
import TryItLoading from './TryItLoading.vue';
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
  <div class="result-viewer">
    <TryItLoading v-if="loading" />
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
.result-viewer {
  margin-top: 24px;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  overflow: hidden;
}

</style>
