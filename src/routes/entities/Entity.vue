<template>
  <Modal :onCancel="onCancel">
    <div class="relative flex flex-col rounded-md drop-shadow-md backdrop-blur-sm bg-white p-2 gap-2">
      {{ selectedTask }}
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/Modal.vue'
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const selectedTask = ref(isNaN(+(route.query["taskId"] ?? "-1")) ? -1 : +(route.query["taskId"] ?? "-1"));
function onCancel() {
  // const confirm = isDirty() ? window.confirm("There are unsaved changes, are you sure you want to leave") : true;
  // if (!confirm) {
  //   return;
  // }
  router.push('/entities');  
}
</script>
