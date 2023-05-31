<script setup>
import useUser from "@/composables/useUser";
import { sliceAddress } from "@/utils";
import useBalanceStore from "@/stores/balance";

import Logo from "@/assets/logo.svg";

const {
  isAuthenticated,
  isAppNetwork,
  isAuthenticating,
  login,
  logout,
  wallet,
  address,
  ens,
} = useUser();
const balanceStore = useBalanceStore();

const menu = [
  {
    name: "Mint",
    to: { name: "Home" },
  },
  {
    name: "Inventory",
    to: { name: "Inventory" },
  },
  {
    name: "Items",
    to: { name: "Items" },
  },
  {
    name: "Upload",
    to: { name: "Upload" },
  },
];
</script>

<template>
  <div
    class="sticky top-0 z-10 flex items-center h-16 px-6 tracking-wide border-b shadow-sm backdrop-blur border-b-white/10 bg-white/5"
  >
    <div class="items-start flex-1">
      <RouterLink
        to="/"
        class="inline-flex text-white transition hover:text-white/70 active:text-white"
      >
        <Logo class="w-auto h-3" />
      </RouterLink>
    </div>
    <div
      v-if="isAuthenticated && isAppNetwork"
      class="flex justify-center gap-8 mx-auto font-serif text-sm font-semibold"
    >
      <RouterLink v-for="item in menu" :to="item.to" custom>
        <template #="{ isActive, navigate, href }">
          <a
            :href="href"
            @click="navigate"
            class="transition"
            :class="[
              isActive
                ? 'text-white/50'
                : 'text-white  hover:text-white/70 active:text-white',
            ]"
          >
            {{ item.name }}
          </a>
        </template>
      </RouterLink>
    </div>
    <div class="flex items-center justify-end flex-1 gap-4">
      <div v-if="isAuthenticated">
        <div class="text-sm font-semibold text-white text-right">
          {{ ens ?? sliceAddress(address) }}
        </div>
        <div class="flex items-center justify-end gap-2 text-xs text-white">
          <Spinner v-if="balanceStore.isBalanceLoading" class="w-4 h-4" />
          {{ (balanceStore.balance + balanceStore.rewards).toFixed(2) }}
          {{ balanceStore.symbol }}
        </div>
      </div>
      <Button
        @click="isAuthenticated ? logout() : login()"
        :disabled="isAuthenticating || !wallet || !isAppNetwork"
        :loading="isAuthenticating"
      >
        {{
          wallet
            ? isAppNetwork
              ? isAuthenticated
                ? "Logout"
                : "Connect Wallet"
              : "Wrong Network"
            : "Unable to detect Ethereum provider"
        }}
      </Button>
    </div>
  </div>
</template>
