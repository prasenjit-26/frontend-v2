<script lang="ts" setup>
import useNetwork from '@/composables/useNetwork';

import AppLogo from '../images/AppLogo.vue';

const { networkSlug } = useNetwork();
</script>

<template>
  <footer v-once>
    <div
      class="xl:container lg:px-4 xl:mx-auto dark:border-t dark:border-gray-800"
    >
      <div
        class="flex flex-col md:flex-row gap-8 md:justify-between items-center py-4 px-4 lg:px-0"
      >
        <div class="flex flex-col gap-8">
          <router-link
            class="font-medium link"
            :to="{ name: 'home', params: { networkSlug } }"
          >
            <AppLogo class="mb-4" />
          </router-link>
        </div>
        <!-- <div class="columns-2 md:columns-2 sm:columns-1">
          <div class="flex flex-col">
            <a class="link-text">About</a>
            <a class="link-text">Docs</a>
            <a class="link-text">Forum</a>
            <a class="link-text">Bug Bounty</a>
          </div>
          <div class="flex flex-col">
            <a class="link-text">Terms of Use</a>
            <a class="link-text">Privacy Policy</a>
            <a class="link-text">Cookie Policy</a>
            <a class="link-text">3rd Party services</a>
          </div>
        </div> -->
      </div>
      <div class="border-bottom" />
      <div class="flex flex-col md:flex-row gap-8 md:justify-between pb-[40px]">
        <span class="copyright-text">
          ©2023 Chimpexchange. All rights reserved.
        </span>
        <div class="flex gap-3 justify-center items-center">
          <a href="https://twitter.com/ChimpExchange" target="_blank">
            <img
              src="~@/assets/images/Twitter.png"
              alt="twitter"
              width="40px"
            />
          </a>
          <a
            href="https://www.linkedin.com/company/chimp-exchange/"
            target="_blank"
          >
            <img
              src="~@/assets/images/Linkedin.png"
              alt="twitter"
              width="40px"
            />
          </a>
          <a href="https://discord.com/invite/EVFY8VhJkf" target="_blank">
            <img
              src="~@/assets/images/discord-mark-blue.png"
              alt="twitter"
              width="40px"
            />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.dark footer {
  background: #17163f;
}
footer {
  background: #ececff;
}
footer :deep(.logotype) {
  @apply origin-top-left;

  transform: scale(1.5);
}
.border-bottom {
  background: #8b8dfc;
  border: 1px solid;

  border-image-source: linear-gradient(
    90deg,
    rgba(139, 141, 252, 0) -0.67%,
    #8b8dfc 51.31%,
    rgba(255, 255, 255, 0) 101.18%,
    rgba(139, 141, 252, 0) 101.18%
  );
  width: 100%;
  height: 2px;
  margin-bottom: 50px;
  margin-top: 20px;
}

.link {
  @apply text-black dark:text-white transition-colors flex items-center no-underline hover:text-purple-600;
}

.link--external {
  @apply text-sm;
}

.link:hover,
.link:focus-visible {
  @apply text-purple-600 dark:text-yellow-500 no-underline;
}

.link:focus:not(:focus-visible) {
  outline: none;
}

.policy {
  @apply text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-yellow-500;
}

.arrow {
  @apply text-gray-300 dark:text-gray-600 group-hover:text-purple-600 dark:group-hover:text-yellow-500;
}

.router-link-active {
  @apply text-blue-600 dark:text-blue-400;
}
.link-text {
  font-size: 16px;
  font-weight: 600;
  padding: 16px 20px;
}
.dark .copyright-text {
  color: #d1d1d1;
  font-size: 18px;
  font-weight: 500;
}
.copyright-text {
  color: #000000;
  font-size: 18px;
  font-weight: 500;
}
</style>
