<script setup>
import { useEventBus } from "@vueuse/core";
import { ref, computed, reactive } from "vue";
import { useShoppingApi } from "@/composables";
import { useLoading } from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";

const { on: onAppEvent, emit: emitAppEvent } = useEventBus("app");

const ImageInput = ref(null);
const selectedImgUrl = ref("");
const formContainer = ref(null);

const itemFormData = reactive({
  itemName: "",
  itemDesc: "",
  price: 0,
});

const image = reactive({
  selectedImage: ref(),
  selectedFile: ref(),
});

const model = ref();

onAppEvent(({ type }) => {
  const events = {
    accountsChanged: () => loadInventory(),
  };

  events[type]?.() ?? null;
});

const onChoose = () => {
  ImageInput.value.click();
};

const onChangeImage = (event) => {
  const files = event.target.files;
  const imageRaw = files[0];
  const filename = imageRaw.name;
  image.selectedFile = imageRaw;

  if (filename.indexOf(".") <= 0) {
    return alert("File loading error");
  }

  const fileReader = new FileReader();
  fileReader.addEventListener("load", (event) => {
    image.selectedImage = fileReader.result;
  });
  fileReader.readAsDataURL(files[0]);
};

const api = useShoppingApi();

const handleSubmit = () => {
  let formData = new FormData();
  console.log(itemFormData.itemName);
  formData.append("itemName", itemFormData.itemName);
  console.log(formData);

  formData.append("itemDesc", itemFormData.itemDesc);
  formData.append("price", itemFormData.price);

  formData.append("image", image.selectedFile);
  formData.append("model", model.value);

  let loader = useLoading();
  loader.show({
    container: formContainer.value,
    canCancel: false,
    onCancel: onCancel,
  });
  api
    .post("upload-item", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((data) => {
      console.log(data);
      loader.hide();
    })
    .catch((err) => {
      console.log(err);
    });
};
const onCancel = () => {
  console.log("Spinner cancelled");
};
const onModelChange = (eve) => {
  const files = eve.target.files;
  const modelRaw = files[0];
  model.value = modelRaw;
  const fileName = modelRaw.name;

  if (fileName.indexOf(".") <= 0) {
    return alert("Mode file loading error");
  }
};
</script>

<template>
  <div class="self-start w-full py-16">
    <form @submit.prevent="handleSubmit" ref="formContainer">
      <div class="w-11/12 mx-auto flex flex-wrap">
        <section class="flex-1">
          <div class="w-3/4">
            <img v-if="image.selectedImage" :src="image.selectedImage" />
            <img v-else src="@/assets/default.png" class="w-full" />
          </div>
          <div class="mt-2 w-3/4 text-right">
            <button
              type="button"
              @click="onChoose()"
              class="px-6 pt-2.5 pb-2 bg-blue-600 text-white font-medium text-xs leading-normal uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out flex align-center"
            >
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="download"
                class="w-3 mr-2"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path
                  fill="currentColor"
                  d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"
                ></path>
              </svg>
              Choose ...
              <input
                type="file"
                style="display: none"
                ref="ImageInput"
                name="upload"
                accept="image/png, image/jpeg"
                @change="onChangeImage"
                required
              />
            </button>
          </div>
          <div class="mt-2">
            <input type="file" accept=".glb" @change="onModelChange" required />
          </div>
          <div></div>
        </section>
        <section class="flex-1">
          <div
            class="relative flex flex-col justify-center flex-fill mb-5 w-full"
          >
            <label class="mb-2">Name</label>
            <input
              class="py-2 pl-12 pr-2 border-2 border-gray-200 rounded-md outline-none focus:border-gray-400 text-black"
              type="text"
              name="username"
              v-model="itemFormData.itemName"
              placeholder="Item Name"
              required
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-gray-500 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div class="w-full">
            <label class="mb-2">Description</label>
            <textarea
              name="message"
              class="w-full h-32 px-4 py-3 border-2 border-gray-300 rounded-sm outline-none focus:border-blue-400 text-black"
              placeholder="Please enter a description for the item"
              v-model="itemFormData.itemDesc"
              required
            ></textarea>
          </div>
          <div class="relative flex flex-col justify-center w-full">
            <span class="mb-2">Price</span>
            <input
              class="py-2 pl-12 pr-2 border-2 border-gray-200 rounded-md outline-none focus:border-gray-400 text-black"
              type="number"
              name="username"
              v-model="itemFormData.price"
              placeholder="example: 20 EQY"
              required
            />
            <svg
              fill="none"
              class="absolute bottom-0 left-0 -mb-0.5 transform translate-x-1/2 -translate-y-1/2 text-gray-500 h-6 w-6"
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
              EQY
            </svg>
          </div>
          <div class="mt-3 text-right">
            <button
              type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
              <svg
                aria-hidden="true"
                class="ml-2 -mr-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        </section>
      </div>
    </form>
  </div>
</template>
