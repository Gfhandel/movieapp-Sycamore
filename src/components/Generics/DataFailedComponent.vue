<template>
  <div>
    <div class="text-center">
      <h3 class="red--text">
        Error!
        {{ errorMessage ? errorMessage : "Failed to load data" }}.
      </h3>
      <p>
        {{ errorMessage ? "" : "Make sure you are connected to the internet" }}.
      </p>
    </div>
    <div class="text-center mt-3" v-if="isSubmitted">
      <p>Fetching data...</p>
    </div>
    <div class="text-center mt-5">
      <button class="btn-primary" @click="fetchMethod">Reload</button>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    errorMessage: String,
    fetchMethod: Function,
    isSubmitted: Boolean,
  },

  data() {
    return {};
  },

  methods: {},

  mounted() {},
};
</script>
