<script lang="ts" setup>
import BalCard from '../BalCard/BalCard.vue';

/**
 * TYPES
 */
type Props = {
  show?: boolean;
  title?: string;
  noPad?: boolean;
  noContentPad?: boolean;
  fireworks?: boolean;
  minWidth?: number;
};

/**
 * PROPS & EMITS
 */

const props = withDefaults(defineProps<Props>(), {
  show: false,
  title: '',
  noPad: false,
  noContentPad: false,
  fireworks: false,
  minWidth: 450,
});

defineEmits(['close']);

/**
 * STATE
 */
const showContent = ref(false);

/**
 * METHODS
 */
function hide(): void {
  showContent.value = false;
}

watch(
  () => props.show,
  () => {
    if (props.show) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }
);

/**
 * EXPOSE
 */
defineExpose({ hide });
</script>

<template>
  <div v-if="show" class="bal-modal" role="dialog" @keyup.esc="hide">
    <transition name="overlay" appear @after-enter="showContent = true">
      <div class="modal-bg" @click="hide">
        <div v-if="fireworks" class="fireworks">
          <div class="before" />
          <div class="after" />
        </div>
      </div>
    </transition>
    <div class="content-container-modal">
      <Transition name="modal" @after-leave="$emit('close')">
        <div
          v-if="showContent"
          class="content"
          :style="{
            maxWidth: props.minWidth ? `${props.minWidth}px` : '800px',
          }"
        >
          <BalCard
            :title="title"
            shadow="lg"
            :noPad="noPad"
            :noContentPad="noContentPad"
            class="modal-card universal-border"
            noBorder
            overflowYScroll
          >
            <template v-if="$slots.header" #header>
              <slot name="header" />
            </template>
            <slot />
            <template v-if="$slots.footer" #footer>
              <slot name="footer" />
            </template>
          </BalCard>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.bal-modal {
  @apply top-0 left-0 fixed h-screen w-full z-40;
}
.bal-modal::-webkit-scrollbar {
  display: none;
}
.content-container-modal {
  @apply flex h-screen items-end sm:items-center justify-center;
  overflow-y: scroll;
}

.content {
  @apply relative w-full h-3/4 sm:h-auto max-h-screen;

  transform-style: preserve-3d;
}

.modal-bg {
  @apply absolute h-full w-full bg-white/70 dark:bg-black/90;
}

.dark .modal-card {
  @apply mx-auto h-full relative;
  padding: 10px;
  background: #151526;
  border-radius: 20px;
}
.modal-card {
  @apply mx-auto h-full relative;
  padding: 10px;
  border-radius: 12px;
  background: #d5d6ff;
  min-height: 88vh;
}

.dark .bal-modal .content::before {
  background-blend-mode: soft-light, soft-light, normal;
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 0;
  filter: blur(80px);
  transform: translateZ(-1px);
  animation: fadeInMoveUpScaleUp 0.2s ease-out both;
}

/* Overlay animation */
.overlay-enter-active,
.overlay-leave-active {
  transition: all 0.2s ease-in-out;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Modal animation */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.2s ease-out;
}

.modal-enter-from,
.modal-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
