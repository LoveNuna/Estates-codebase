<script setup>
import { toRefs, computed, useSlots, ref, reactive } from "vue";
import { useEventBus } from "@vueuse/core";

import { ethers } from "ethers";
import useEstate from "@/composables/useEstate";
import useUser from "@/composables/useUser";
import { useShoppingApi } from "@/composables";
import useEquityContract from "@/composables/useEquityContract";

import IconDownload from "@/assets/icons/download.svg";
import IconEye from "@/assets/icons/eye.svg";

import { notify } from "notiwind";
import useItemStore from "@/stores/item";

const { on: onAppEvent } = useEventBus("app");
const isImageLoaded = ref(false);

const props = defineProps(["id", "item", "isSelectedToken"]);
const { item, isSelectedToken } = toRefs(props);
const itemStore = useItemStore();
const onImageLoad = () => (isImageLoaded.value = true);
const { address } = useUser();
const { transfer } = useEquityContract(address);
const api = useShoppingApi();

const onBuyItem = async (id) => {
  if (!isSelectedToken.value) {
    notify({
      type: "generic",
      title: "Information",
      text: "Please choose an NFT that can be associated with items",
    });
    return;
  }
  const amountBn = ethers.utils.parseEther(String(item.value.price));
  try {
    await transfer("0xd30E43F1c04eC33625aCDC411CeE87a80afa4Ed2", amountBn);
    notify({
      type: "success",
      title: "Transfer succeed",
      text: `${item.value.price} EQY is transferred successfully`,
    });
  } catch (err) {
    notify({
      type: "error",
      title: "Paying " + item.value.price + "EQY",
      text: err.reason ?? err.message,
    });
    return;
  }

  api
    .post("/buy-item", {
      itemId: item.value.id,
      selectedTokenId: itemStore.selectedToken.id,
      selectedTokenName: itemStore.selectedToken.metadata.name,
    })
    .then((res) => {
      console.log(res.data.itemRecord);
      itemStore.updateItems(res.data.itemRecord);
      itemStore.updateAssociatedItems(res.data.itemRecord);
    })
    .catch((err) => {
      console.log(err);
    });
};
const endpoint = ref(import.meta.env.VITE_CLOUDFRONT_ITEMS);
const itemImageUrl = reactive({
  value: endpoint.value + item.value.Key,
});
</script>
<style>
.image-border {
  border: 2px ridge #606060b8;
}

.bar-button {
  border: 0px solid #bfbfbf;
  border-width: 2px 0 2px 2px;
  border-top-left-radius: 13px;
  display: flex;
  align-items: center;
}

.glow-button::after {
  content: "";
  top: 0;
  transform: translateX(100%);
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 1;
  animation: slide 4s infinite 1s;
  /*
  CSS Gradient - complete browser support from http://www.colorzilla.com/gradient-editor/
  */
  background: -moz-linear-gradient(
    left,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(128, 186, 232, 0) 99%,
    rgba(125, 185, 232, 0) 100%
  ); /* FF3.6+ */
  background: -webkit-gradient(
    linear,
    left top,
    right top,
    color-stop(0%, rgba(255, 255, 255, 0)),
    color-stop(50%, rgba(255, 255, 255, 0.5)),
    color-stop(99%, rgba(128, 186, 232, 0)),
    color-stop(100%, rgba(125, 185, 232, 0))
  ); /* Chrome,Safari4+ */
  background: -webkit-linear-gradient(
    left,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(128, 186, 232, 0) 99%,
    rgba(125, 185, 232, 0) 100%
  ); /* Chrome10+,Safari5.1+ */
  background: -o-linear-gradient(
    left,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(128, 186, 232, 0) 99%,
    rgba(125, 185, 232, 0) 100%
  ); /* Opera 11.10+ */
  background: -ms-linear-gradient(
    left,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(128, 186, 232, 0) 99%,
    rgba(125, 185, 232, 0) 100%
  ); /* IE10+ */
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(128, 186, 232, 0) 99%,
    rgba(125, 185, 232, 0) 100%
  ); /* W3C */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00ffffff', endColorstr='#007db9e8',GradientType=1 );
}

@keyframes slide {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
<template>
  <component
    class="relative text-left transition bg-black/10 bg-gradient-to-b from-white/10 to-black/10 aspect-square"
  >
    <div
      v-if="!isImageLoaded"
      class="absolute top-0 left-0 z-10 flex items-center justify-center w-full h-full text-left backdrop-blur-sm"
    >
      <Spinner class="w-8 h-8" />
    </div>

    <div class="absolute top-2 right-0 z-[1] overflow-hidden">
      <div class="flex items-center gap-2">
        <button
          v-if="!item.associated_nft_id"
          type="button"
          title="Buy Now"
          @click="onBuyItem(0)"
          class="bg-[#12581e] text-[#ddd] hover:text-[#fff] focus:outline-none px-2 text-center bar-button glow-button"
        >
          Buy now
        </button>
        <button v-else class="bg-[#9d0f0f] px-2 bar-button">Sold out</button>
      </div>
    </div>
    <div class="relative">
      <Transition name="fade">
        <img
          :src="item.image_url"
          class="aspect-square w-80"
          @load="onImageLoad"
          v-show="isImageLoaded"
        />
      </Transition>
      <div
        class="absolute bottom-0 bg-gradient-to-b from-[#3e3e3e40] via-[#3e3e3e80] to-[#000000d6] w-full h-full image-border"
      ></div>

      <div class="absolute bottom-0 w-full gap-4 px-3 py-3 rounded-b-2xl">
        <div class="text-center w-full">
          <div
            class="font-semibold leading-tight text-[#d5d5d5] w-full break-words"
          >
            {{ item?.name }}
          </div>
          <div
            class="font-semibold leading-tight text-[#dbc425] flex items-center justify-center mt-1"
            v-if="!item.associated_nft_id"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span class="text-[0.8rem]">&nbsp;{{ item.price }} EQY </span>
          </div>
          <div
            class="font-semibold leading-tight text-[#dbc425] flex items-center justify-center mt-1"
            v-else
          >
            <span class="text-[0.8rem]">{{ item.associated_nft_name }}</span>
          </div>
        </div>
      </div>
    </div>
  </component>
</template>
