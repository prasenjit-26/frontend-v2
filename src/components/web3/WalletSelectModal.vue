<script setup lang="ts">
import { ref } from 'vue';

import WalletButton from '@/components/web3/WalletButton.vue';
import { EXTERNAL_LINKS } from '@/constants/links';
import { SupportedWallets } from '@/providers/wallet.provider';
import LS_KEYS from '@/constants/local-storage.keys';
import { useWalletHelpers } from '@/composables/useWalletHelpers';
import { useUserAgent } from '@/composables/useUserAgent';

interface Props {
  isVisible?: boolean;
  onShowThirdParty: () => void;
}

// type AcceptedLocalStorageItemType = '0' | '1' | null;

const props = withDefaults(defineProps<Props>(), {
  isVisible: false,
});

const emit = defineEmits(['close']);

const { isMobile } = useUserAgent();
const { getIsMetaMaskBrowser } = useWalletHelpers();

const wallets = SupportedWallets.filter(id => {
  // hide metamask wallet on all mobile browsers except metamask
  if (id === 'metamask' && isMobile && !getIsMetaMaskBrowser()) {
    return false;
  }

  // Hide all wallets except metamask on metamask browser
  if (id !== 'metamask' && getIsMetaMaskBrowser()) {
    return false;
  }

  return id !== 'safe';
});

// const acceptedlocalStorageItem = localStorage.getItem(
//   LS_KEYS.App.TermsAccepted
// ) as AcceptedLocalStorageItemType;
const acceptedlocalStorageItem = '1';
const accepted = ref<'0' | '1'>(acceptedlocalStorageItem || '0');

const isBalRulesAccepted = computed(() => accepted.value === '1');

// function onBalRulesAccepted() {
//   accepted.value = isBalRulesAccepted.value ? '0' : '1';
//   localStorage.setItem(LS_KEYS.App.TermsAccepted, accepted.value);
// }
</script>

<template>
  <BalModal :show="props.isVisible" @close="emit('close')">
    <!-- <BalRadio
      :checked="isBalRulesAccepted"
      value="bal-rules"
      name="bal-rules"
      size="lg"
      @update:model-value="onBalRulesAccepted"
    >
      <template #label>
        <p class="pb-3 pl-1 mb-2 -mt-1 text-base">
          {{ $t('byConnectingWallet') }}
          <router-link
            :to="{ name: 'terms-of-use' }"
            target="_blank"
            @click.stop=""
          >
            <span className="link">{{ $t('policies.termsOfUse') }} </span>,
          </router-link>
          <router-link :to="{ name: 'risks' }" target="_blank" @click.stop="">
            <span className="link">{{ $t('policies.risks') }} </span>,
          </router-link>
          <router-link
            :to="{ name: 'cookies-policy' }"
            target="_blank"
            @click.stop=""
          >
            <span className="link">
              {{ $t('policies.cookiesPolicy') }}
            </span> </router-link
          >,
          <span>{{ $t('useOf') }}&nbsp;</span>
          <button @click.stop="onShowThirdParty">
            <BalLink>
              <span>{{ $t('policies.thirdPartyServices') }}</span>
            </BalLink>
          </button>
          {{ $t('and') }}
          <router-link
            :to="{ name: 'privacy-policy' }"
            target="_blank"
            @click.stop=""
          >
            <span className="link">{{ $t('policies.privacyPolicy') }} </span>.
          </router-link>
        </p>
      </template>
    </BalRadio>
  -->
    <div class="grid grid-cols-5 gap-4">
      <div class="relative col-span-2 p-[28px]">
        <p class="connectwallettext mb-[20px]">Connect Wallet</p>
        <span class="recommendedtext mt-[24px] mb-[30px]"> Recommended </span>
        <div class="transition-opacity duration-200 mt-[20px]">
          <WalletButton
            v-for="wallet in wallets"
            :key="wallet"
            :wallet="wallet"
          />
        </div>
        <div class="border-right" />
      </div>
      <div class="relative col-span-3 p-[28px]">
        <button class="close-button" @click="emit('close')">
          <BalIcon name="x" size="sm" />
        </button>
        <BalStack vertical align="center" justify="center" class="h-full">
          <span class="text-[20px] font-[700] mb-[30px]">
            What is a Wallet?
          </span>
          <BalStack horizontal align="center" justify="center" class="mb-30px">
            <div class="logocontainer" />
            <BalStack vertical align="start" justify="center">
              <span class="text-[14px] font-[700] mb-[5px]">
                A Home for your Digital Assets
              </span>
              <span class="text-[14px] font-[700] gray-color">
                Wallets are used to send, receive, store, and display digital
                assets like Ethereum and NFTs.
              </span>
            </BalStack>
          </BalStack>
          <BalStack horizontal align="center" justify="center" class="mb-30px">
            <div class="logocontainer" />
            <BalStack vertical align="start" justify="center">
              <span class="text-[14px] font-[700] mb-[5px]">
                A New Way to Log In
              </span>
              <span class="text-[14px] font-[700] gray-color">
                Instead of creating new accounts and passwords on every website,
                just connect your wallet.
              </span>
            </BalStack>
          </BalStack>
          <span class="text-center text-[12px] font-[500] gray-color">
            By connecting a wallet, you agree to ChimpExchange
            <router-link
              target="_blank"
              :to="{ name: 'terms-of-use' }"
              class="blue-color"
            >
              Terms of Service
            </router-link>
            and consent to its
            <router-link
              :to="{ name: 'privacy-policy' }"
              target="_blank"
              class="blue-color"
            >
              Privacy Policy.
            </router-link>
          </span>
        </BalStack>
      </div>
    </div>
  </BalModal>
</template>
<style>
.recommendedtext {
  color: rgba(255, 255, 255, 0.6);
  font-family: Plus Jakarta Sans;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 18px;
}
.connectwallettext {
  color: #fff;
  text-align: center;
  font-family: Plus Jakarta Sans;
  font-size: 32px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;
}
.logocontainer {
  display: flex;
  width: 48px;
  height: 48px;
  align-items: flex-start;
  flex-shrink: 0;
  background: #fff;
  border-radius: 12px;
}
.gray-color {
  color: rgba(255, 255, 255, 0.6);
}
.blue-color {
  color: #0e76fd;
}
.close-button {
  border-radius: 9999px;
  border: 1px solid #8b8dfc;
  background: #44457c;
  display: flex;
  width: 40px;
  height: 40px;
  padding: 9px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  position: absolute;
  right: 0;
  top: -7px;
}
.primary-color {
  color: #44457c;
}
</style>