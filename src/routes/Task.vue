<template>
  <Modal :onCancel="onCancel">
    <div>{placeholder}</div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/Modal.vue';
import { useRoute, useRouter } from 'vue-router';


const route = useRoute();
const router = useRouter();
console.log(route.params);

function onCancel() {
  router.push('/tasks');  
}
</script>
