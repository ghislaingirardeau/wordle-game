<template>
  <div>
    <!-- Main modal -->
    <div
      :id="'info-modal-' + idName"
      ref="dialogElement"
      tabindex="-1"
      aria-hidden="true"
      class="modal hidden overflow-y-auto overflow-x-hidden fixed top-1/3 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div class="relative p-4 w-full max-w-2xl max-h-full">
        <!-- Modal content -->
        <div class="relative bg-marine rounded-lg shadow dark:bg-gray-700">
          <!-- Modal header -->
          <div
            class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600"
          >
            <h3 class="text-xl font-semibold text-gray-900 text-amber">
              <slot name="title"></slot>
            </h3>
            <button
              ref="crossCloseModal"
              v-if="idName !== 'game'"
              type="button"
              class="text-amber bg-transparent hover:bg-white hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              :id="'info-modal-' + idName"
              @click="toggleModal"
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>
          <!-- Modal body -->
          <div class="p-4 md:p-5 space-y-4">
            <div class="text-white leading-relaxed">
              <slot name="message"></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, type Ref, watch } from "vue";

const dialogElement = ref<HTMLElement>();
const props = defineProps({
  isGameOver: Boolean,
  idName: String,
});

watch(
  () => props.isGameOver,
  (a, b) => {
    setTimeout(() => {
      toggleModal();
    }, 1300);
  }
);

function toggleModal(): void {
  const element = dialogElement.value as HTMLElement;
  element.classList.toggle("hidden");
}

// define expose me permettra d'éxécuter cette méhode à partir du parent (en ajoutant une ref au component)
defineExpose({
  toggleModal,
  dialogElement,
});
</script>

<style lang="css" scoped>
/*  0. BEFORE-OPEN STATE   */
/* Before it's display */
@starting-style {
  .modal {
    opacity: 0;
  }
}
/*  1. IS-OPEN STATE   */
/* The state at which the element is open + transition logic */
.modal {
  transition: opacity 0.3s, display 0.3s allow-discrete;
  /* allow-discrete execute l'animation avant que l'élément disparaisse du DOM */
}
/*  2. EXITING STATE   */
/* style when it leave */
.hidden {
  opacity: 0;
  /* display none est deja appliqué par tailwind */
}
</style>
