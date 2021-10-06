<template lang="pug">
  ErtAutocomplete(
    v-model="internalValue"
    :items="addressSuggestions"
    :loading="isLoading"
    :search-input.sync="search"
    item-text="name"
    hide-no-data
    hide-selected
    return-object
    noFilter
    v-bind="$props"
  )
</template>

<script lang="ts" src="./script.ts"></script>
