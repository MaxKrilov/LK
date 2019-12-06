<template lang="pug">
  h1.er-page-title(@click="$emit('click', $event)")
    slot
</template>

<style lang="scss" src="./styles.scss"></style>
