<script lang="ts" setup>
import useDarkMode from '@/composables/useDarkMode';
import useNetwork from '@/composables/useNetwork';

// import AppLogo from '../images/AppLogo.vue';

const { darkMode } = useDarkMode();
const { networkSlug } = useNetwork();
</script>

<template>
  <footer v-once>
    <div class="footer-line" />
    <div class="footer-container">
      <div class="xl:container">
        <div className="footer-navbar">
          <router-link
            :to="{
              name: 'home',
              params: { networkSlug },
            }"
            as="div"
            className="nav-item"
          >
            Pool
          </router-link>
          <router-link
            :to="{
              name: 'swap',
              params: { networkSlug },
            }"
            as="div"
            className="nav-item"
          >
            Swap
          </router-link>
          <router-link
            :to="{
              name: 'portfolio',
              params: { networkSlug },
            }"
            as="div"
            className="nav-item"
          >
            Portfolio
          </router-link>
          <router-link
            :to="{
              name: 'bridge',
              params: { networkSlug },
            }"
            as="div"
            className="nav-item"
          >
            Bridge
          </router-link>
        </div>
        <div className="footer-menu-bottom">
          <div className="footer-logo-container">
            <div className="footer-logo">
              <img
                v-if="darkMode"
                src="~@/assets/images/ChimpLogo.png"
                alt="Chimp Exchange"
                className="footer-chimp-exchange-logo"
              />
              <img
                v-else
                src="~@/assets/images/logoLight.png"
                alt="logo"
                className="footer-chimp-exchange-logo"
              />
            </div>
            <div className="footer-logo-text">
              Trade Swap Earn at Ease in New Dimension
            </div>
          </div>
          <div className="footer-menu-items">
            <div className="menu-items-col col-1">
              <a
                href="https://docs.chimp.exchange"
                target="_blank"
                rel="noreferrer"
                className="menu-item"
              >
                Docs
              </a>
              <a
                href="https://chimp.exchange/rewards"
                target="_blank"
                rel="noreferrer"
                className="menu-item"
              >
                Rewards
              </a>
              <a
                href="https://blog.chimp.exchange/"
                target="_blank"
                rel="noreferrer"
                className="menu-item"
              >
                Blogs
              </a>
              <a
                href="https://drive.google.com/file/d/1XBmTgUkvLQAO97NND2Lq9hQ-_rtJ6C6v/view?pli=1"
                target="_blank"
                rel="noreferrer"
                className="menu-item"
              >
                Brand Assets
              </a>
            </div>
            <div className="menu-items-col col-2">
              <a
                href="https://discord.gg/eA7HPTtyjJ"
                target="_blank"
                rel="noreferrer"
                className="menu-item"
              >
                Discord
              </a>
              <a
                href="https://twitter.com/ChimpExchange"
                target="_blank"
                rel="noreferrer"
                className="menu-item"
              >
                Twitter
              </a>
              <a
                href="https://t.me/chimpexchange"
                target="_blank"
                rel="noreferrer"
                className="menu-item"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bar">
          <img
            src="~@/assets/images/chimp-astronaut.png"
            className="chimp-astro-image"
            alt="Chimp Astronaut"
          />
        </div>
        <div className="footer-copyright">
          ©2023 ChimpExchange. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
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
.footer-line {
  background: #714bff;
  padding: 5px;
  border-radius: 50%;
}

.dark .footer-container {
  padding-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat, repeat;
  background-size: cover;
  background-image: url('../../assets/images/footer-bg.svg');
}
.footer-container {
  background: #ececff;
  padding-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.chimp-astro-image {
  position: absolute;
  bottom: 0;
  left: 45%;
}
.footer-bar {
  height: 3px;
  background-color: #8b8dfc;
  margin-bottom: 30px;
  width: 100%;
  position: relative;
}
@media (max-width: 680px) {
  .chimp-astro-image {
    left: 33%;
  }
}
@media (max-width: 680px) {
  .footer-container {
    background-image: url('../../assets/images/footer-bg-mobile.svg');
  }
}

.footer-navbar {
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 65px;
  row-gap: 65px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

@media (max-width: 680px) {
  .footer-navbar {
    column-gap: 28px;
    row-gap: 28px;
    margin-bottom: 50px;
  }
}

.dark .nav-item {
  display: block;
  text-decoration: none;
  text-align: center;
  font-family: GGanti, sans-serif;
  font-weight: 400;
  font-size: 17px;
  font-weight: 600;
  color: #e6e6e6;
  line-height: 140%; /* 28px */
}
.nav-item {
  display: block;
  text-decoration: none;
  text-align: center;
  font-weight: 600;
  font-family: GGanti, sans-serif;
  font-weight: 400;
  font-size: 17px;
  color: #000000;
  line-height: 140%; /* 28px */
}
.dark .menu-item {
  display: flex;
  padding: 13px 13px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  text-decoration: none;
  color: white;
  font-weight: 600;
}
.menu-item {
  display: flex;
  padding: 13px 13px;
  justify-content: center;
  align-items: center;
  font-weight: 600;

  gap: 8px;
  font-size: 13px;
  text-decoration: none;
  color: #000;
}
.footer-menu-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
  width: 100%;
  flex-wrap: wrap;
}

@media (max-width: 680px) {
  .footer-menu-bottom {
    justify-content: center;
    margin-bottom: 130px;
  }
}

.footer-logo {
  margin-bottom: 24px;
}

@media (max-width: 680px) {
  .footer-logo {
    margin-bottom: 6px;
  }
}

.footer-chimp-exchange-logo {
  max-width: 300px;
  width: 100%;
}

.dark .footer-logo-text {
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.footer-logo-text {
  color: #000;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

@media (max-width: 680px) {
  .footer-logo-text {
    font-size: 12px;
    text-align: center;
    margin-bottom: 30px;
  }
}

.footer-menu-items {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 60px;
}
.menu-items-col {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.dark .footer-copyright {
  color: #fff;
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 40px;
}
.footer-copyright {
  color: #000;
  text-align: center;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-bottom: 40px;
}
</style>
