import { ref, computed, reactive, toRaw } from "vue";
import { defineStore } from "pinia";

const itemStore = defineStore("item", () => {
  const selectedToken = ref(null);
  let itemsBucket = reactive({
    loading: ref(false),
    items: ref([]),
    originItems: ref([]),
  });
  let associatedItems = ref([]);

  const setSelectedToken = (item) => {
    selectedToken.value = item;
    console.log(selectedToken.value);
  };

  const setAssociatedItems = (arr) => {
    associatedItems.value = arr;
  };

  const updateAssociatedItems = (newRecord) => {
    associatedItems.value.push(newRecord);
  };

  const filterByItems = (type) => {
    console.log(type);
    switch (type) {
      case "all":
        itemsBucket.items = itemsBucket.originItems;
        break;
      case "buy":
        itemsBucket.items = itemsBucket.originItems.filter((item, index) => {
          if (!item.associated_nft_id) {
            return true;
          }
          return false;
        });
        break;
      case "sold":
        itemsBucket.items = itemsBucket.originItems.filter((item, index) => {
          if (item.associated_nft_id) {
            return true;
          }
          return false;
        });
        break;
      default:
        break;
    }
  };

  const updateItems = (updatedItem) => {
    let targetId = -1;
    const targetItem = toRaw(itemsBucket.items).filter((item, index) => {
      if (item.id === updatedItem.id) {
        targetId = index;
        return true;
      }
    });

    let newItemsArray = toRaw(itemsBucket.items);
    const finalArray = newItemsArray.map((item, index) => {
      if (index === targetId) {
        return { ...item, associated_nft_id: updatedItem.associated_nft_id };
      }

      return item;
    });

    itemsBucket.items = finalArray;
  };

  return {
    selectedToken,
    setSelectedToken,
    itemsBucket,
    associatedItems,
    filterByItems,
    updateItems,
    setAssociatedItems,
    updateAssociatedItems,
  };
});

export default itemStore;
