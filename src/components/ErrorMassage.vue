<script setup lang="ts">
interface ErrorMassageProps{
  id: string
}
defineProps<ErrorMassageProps>()
</script>
<template>
  <p aria-live="assertive" class="errorMassage" :id="id">
    <slot />
  </p>
</template>
