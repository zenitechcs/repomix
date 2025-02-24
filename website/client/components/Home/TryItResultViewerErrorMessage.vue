<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>

<template>
  <div class="error">
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.error {
  padding: 24px;
  color: var(--vp-c-danger-1);
  text-align: center;
}
</style>