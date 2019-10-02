<template lang="pug">
  component(
    class="er-glow-icon"
    :is="iconName"
  )
</template>

<script>
import { ucfirst } from '@/functions/helper'
import GlowIconFb from './components/glow-icon-fb'
import GlowIconVk from './components/glow-icon-vk'
import GlowIconInstagram from './components/glow-icon-instagram'

export default {
  components: {
    GlowIconFb,
    GlowIconVk,
    GlowIconInstagram
  },
  props: {
    name: {
      type: String
    }
  },
  computed: {
    iconName () {
      return `GlowIcon${ucfirst(this.name)}`
    }
  }
}
</script>

<style lang="scss" src="./style.scss"></style>
