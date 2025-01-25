<script setup lang="ts">
import { ref } from 'vue';
import TryItPackOptions from './TryItPackOptions.vue';
import TryItResultViewer from './TryItResultViewer.vue';
import TryItUrlInput from './TryItUrlInput.vue';
import type { PackResult } from './api/client';
import { handlePackRequest } from './utils/requestHandlers';

// Form input states
const url = ref('');
const format = ref<'xml' | 'markdown' | 'plain'>('xml');
const removeComments = ref(false);
const removeEmptyLines = ref(false);
const showLineNumbers = ref(false);
const fileSummary = ref(true);
const directoryStructure = ref(true);
const includePatterns = ref('');
const ignorePatterns = ref('');
const outputParsable = ref(false);

// Processing states
const loading = ref(false);
const error = ref<string | null>(null);
const result = ref<PackResult | null>(null);
const hasExecuted = ref(false);

const TIMEOUT_MS = 30_000;
let requestController: AbortController | null = null;

async function handleSubmit() {
  if (!url.value) return;

  // Cancel any pending request
  if (requestController) {
    requestController.abort();
  }
  requestController = new AbortController();

  loading.value = true;
  error.value = null;
  result.value = null;
  hasExecuted.value = true;

  const timeoutId = setTimeout(() => {
    if (requestController) {
      requestController.abort('Request timed out');
      throw new Error('Request timed out');
    }
  }, TIMEOUT_MS);

  await handlePackRequest(
    url.value,
    format.value,
    {
      removeComments: removeComments.value,
      removeEmptyLines: removeEmptyLines.value,
      showLineNumbers: showLineNumbers.value,
      fileSummary: fileSummary.value,
      directoryStructure: directoryStructure.value,
      includePatterns: includePatterns.value ? includePatterns.value.trim() : undefined,
      ignorePatterns: ignorePatterns.value ? ignorePatterns.value.trim() : undefined,
      outputParsable: outputParsable.value,
    },
    {
      onSuccess: (response) => {
        result.value = response;
      },
      onError: (errorMessage) => {
        error.value = errorMessage;
      },
      signal: requestController.signal,
    },
  );

  clearTimeout(timeoutId);

  loading.value = false;
  requestController = null;
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && url.value && !loading.value) {
    handleSubmit();
  }
}
</script>

<template>
  <div class="container">
    <form class="try-it-container" @submit.prevent="handleSubmit">
      <TryItUrlInput
        v-model:url="url"
        :loading="loading"
        @keydown="handleKeydown"
      />

      <TryItPackOptions
        v-model:format="format"
        v-model:include-patterns="includePatterns"
        v-model:ignore-patterns="ignorePatterns"
        v-model:file-summary="fileSummary"
        v-model:directory-structure="directoryStructure"
        v-model:remove-comments="removeComments"
        v-model:remove-empty-lines="removeEmptyLines"
        v-model:show-line-numbers="showLineNumbers"
        v-model:output-parsable="outputParsable"
      />

      <div v-if="hasExecuted">
        <TryItResultViewer
          :result="result"
          :loading="loading"
          :error="error"
        />
      </div>
    </form>
  </div>
</template>

<style scoped>
.container {
  padding: 0 20px;
  margin: 0 auto;
  max-width: 960px;
}

.try-it-container {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 12px;
  padding: 24px;
}
</style>
