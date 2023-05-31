<script setup>
import { ref, computed, reactive } from "vue";
import InventoryVue from "./Inventory.vue";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";
import { Dropdown, ListGroup, ListGroupItem } from "flowbite-vue";
import { useEventBus } from "@vueuse/core";
import {
  useEstatesContract,
  useStakingContract,
  useUser,
  useShoppingApi,
} from "@/composables";
import EstateCardForItems from "../components/EstateCardForItems.vue";
import IconDownload from "@/assets/icons/download.svg";
import useItemStore from "@/stores/item";
import axios from "axios";

const { on: onAppEvent, emit: emitAppEvent } = useEventBus("app");
const { address } = useUser();
const itemStore = useItemStore();
const itemsBucket = itemStore.itemsBucket;
const apiShopping = useShoppingApi();

const inventory = reactive({
  loading: ref(false),
  tokens: ref([]),
});

const availableTokens = computed(() => {
  inventory.tokens.filter(
    (token) =>
      !isTokenLocked(token) && !isTokenSelected(token) && isTokenLoaded(token)
  );
});

const { contract: estates, tokensOfOwner } = useEstatesContract(address);
const {
  contract: staking,
  viewStakes,
  LOCK_IN,
  generationBalance,
} = useStakingContract(address);

const isStakingLoading = ref(false);
const isUnstakingLoading = ref(false);
const selectedToken = reactive({
  value: ref(),
});

const onTokenLoading = (token) => {
  const index = inventory.tokens.findIndex((t) => t.id === token.id);
  inventory.tokens[index] = {
    ...inventory.tokens[index],
    ...token,
  };
};

const getTokens = async () => {
  try {
    const [unstaked, staked] = await Promise.all([
      tokensOfOwner(),
      viewStakes(),
    ]);

    const result = [
      ...unstaked.map((item) => ({ id: item.toNumber(), status: "unstaked" })),
      ...staked.map((item) => ({ id: item.toNumber(), status: "staked" })),
    ];

    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
};

const loadInventory = async () => {
  try {
    inventory.loading = true;
    inventory.locktime = await LOCK_IN();
    inventory.tokens = await getTokens();
    console.log("NFTs", inventory.tokens);
    return Promise.resolve(inventory);
  } catch (err) {
    return Promise.reject(err);
  } finally {
    inventory.loading = false;
  }
};

const getItems = async () => {
  try {
    console.log("Get items started");
    const result = await apiShopping.get("/items");
    console.log(result.data);
    return Promise.resolve(result.data);
  } catch (err) {
    return Promise.reject(err);
  }
};

const loadItemsBucket = async () => {
  try {
    itemsBucket.loading = true;
    itemsBucket.items = await getItems();
    itemsBucket.originItems = await getItems();
    console.log("this is items", itemsBucket.items);

    return Promise.resolve(itemsBucket);
  } catch (err) {
    return Promise.reject(console.error());
  } finally {
    itemsBucket.loading = false;
  }
};

const onTokenSelected = (token) => {
  selectedToken.value = token;
  itemStore.setSelectedToken(token);

  apiShopping
    .get(`/items/selected/${token.id}`)
    .then((res) => {
      itemStore.setAssociatedItems(res.data.associatedItems);
    })
    .catch((err) => {});
};

const isTokenSelected = (token) => {
  if (!selectedToken.value) return false;
  return selectedToken.value.id === token.id;
};

const downloadItem = (url, name) => {
  axios
    .get(url, { responseType: "blob" })
    .then((response) => {
      console.log(response);
      const blob = new Blob([response.data], { type: "application/glb" });
      const link = document.createElement("a");
      link.setAttribute("download", name + ".glb");
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    })
    .catch((err) => {
      console.log(err);
    });
};

const filterBy = (type) => {
  itemStore.filterByItems(type);
};

onAppEvent(({ type }) => {
  const events = {
    accountsChanged: () => loadInventory(),
  };

  events[type]?.() ?? null;
});

const breakpoints = {
  768: {
    itemsToShow: 2,
    snapAlign: "center",
  },

  // 1024 and up
  1100: {
    itemsToShow: 3,
    snapAlign: "center",
  },
};

loadInventory();
loadItemsBucket();
</script>
<style>
.carousel__prev,
.carousel__next {
  box-sizing: content-box;
  background: transparent;
}
.carousel__prev:hover,
.carousel__next:hover {
  box-sizing: content-box;
  background: #44444411;
}
.inventory-border {
  border: 2px solid #ffffff59;
  border-radius: 10px;
  background: #ffffff0f;
}
.carousel__pagination-button {
  background-color: rgba(255, 255, 255, 0.425);
}
.carousel__pagination-button--active {
  background-color: white;
}
.items-inventory {
  margin-top: 10px;
  border: 2px solid #ffffff59;
  border-radius: 10px;
}
.reverse {
  grid-auto-flow: row;
}
</style>
<template>
  <div class="self-start w-full py-16">
    <div class="w-11/12 mx-auto">
      <div class="block md:hidden">
        <div class="p-4 inventory-border">
          <carousel
            v-if="inventory.tokens.length !== 0"
            :items-to-show="3"
            :wrap-around="true"
            :breakpoints="breakpoints"
          >
            <slide v-for="token in inventory.tokens" :key="token.id">
              <EstateCardForItems
                :id="token.id"
                as="button"
                :active="isTokenSelected(token)"
                @click="onTokenSelected(token)"
                @load="onTokenLoading"
              />
            </slide>
            <template #addons>
              <Navigation />
              <Pagination />
            </template>
          </carousel>
        </div>
        <div class="p-4 items-inventory">
          <div class="text-center">No items for this estate...</div>
        </div>
      </div>
      <div
        class="grid grid-cols-1 md:grid-cols-12 gap-12 reverse flex-col-reverse"
      >
        <div class="col-span-7 lg:col-span-8 2xl:col-span-9">
          <div class="grid gap-12 mb-5">
            <div class="font-serif text-2xl font-bold">Items</div>
            <div class="flex justify-end flex-1 gap-2">
              <dropdown text="Filter by">
                <list-group>
                  <list-group-item @click="filterBy('all')">
                    <template #prefix>
                      <svg
                        class="w-4 h-4 fill-current"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </template>
                    All
                  </list-group-item>
                  <list-group-item @click="filterBy('buy')">
                    <template #prefix>
                      <svg
                        class="w-4 h-4 fill-current"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"
                        ></path>
                      </svg>
                    </template>
                    Open to buy
                  </list-group-item>
                  <list-group-item @click="filterBy('sold')">
                    <template #prefix>
                      <svg
                        class="w-4 h-4 fill-current"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </template>
                    Sold out
                  </list-group-item>
                </list-group>
              </dropdown>
            </div>
          </div>
          <div
            v-if="itemsBucket.items.length !== 0"
            class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"
          >
            <ItemCard
              as="div"
              v-for="item in itemsBucket.items"
              :isSelectedToken="selectedToken.value ? true : false"
              :item="item"
            />
          </div>
        </div>
        <div class="col-span-5 lg:col-span-4 2xl:col-span-3 hidden md:block">
          <div class="p-4 inventory-border">
            <carousel
              :wrap-around="true"
              :breakpoints="breakpoints"
              v-if="inventory.tokens.length !== 0"
            >
              <slide v-for="token in inventory.tokens" :key="token.id">
                <EstateCardForItems
                  :id="token.id"
                  as="button"
                  :active="isTokenSelected(token)"
                  @click="onTokenSelected(token)"
                  @load="onTokenLoading"
                />
              </slide>
              <template #addons>
                <Navigation />
                <Pagination />
              </template>
            </carousel>
          </div>
          <div class="p-4 items-inventory">
            <div class="text-center">
              {{
                selectedToken.value
                  ? selectedToken?.value?.metadata.name
                  : "NFT is Not selected."
              }}
            </div>
            <div v-if="selectedToken.value">
              <div v-if="itemStore.associatedItems.length !== 0">
                <div
                  v-for="item in itemStore.associatedItems"
                  class="flex items-center gap-3 my-2"
                >
                  <div>
                    <img :src="item.image_url" alt="Item" class="w-12 h-12" />
                  </div>

                  <span class="md-list-item-text">{{ item.name }}</span>

                  <button
                    class="md-icon-button md-list-action"
                    @click="downloadItem(item.model_url, item.name)"
                  >
                    <IconDownload class="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div v-else class="text-center">
                No items associated with this NFT
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
