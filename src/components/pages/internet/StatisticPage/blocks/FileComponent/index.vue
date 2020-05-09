<template lang="pug">
  .statistic-internet-page__file-item.mb-8
    er-document-viewer(
      :listDocument="documentForViewer"
      v-model="isOpen"
    )
      template(v-slot:activator="{ on }")
        er-icon.mr-8(name="husks")
        button(v-on="on")
          span
            | {{ document.fileName }}
</template>

<script lang="ts">
import Vue from 'vue'
import ErDocumentViewer from '@/components/blocks/ErDocumentViewer/index.vue'

export default Vue.extend({
  name: 'file-component',
  props: {
    document: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    ErDocumentViewer
  },
  computed: {
    documentForViewer () {
      return [{
        id: this.document.id,
        bucket: this.document.bucket,
        fileName: this.document.fileName,
        filePath: this.document.filePath,
        type: {
          id: this.document.type.id,
          name: this.document.type.name
        }
      }]
    }
  },
  data: () => ({
    isOpen: false
  })
})
</script>

<style lang="scss">
.statistic-internet-page__file-item {
  display: flex;
  align-items: center;

  i {
    @include color-black(0.2);
  }

  button {
    width: 100%;
    @include color-black(0.5);
    @extend %caption1-font;
    cursor: pointer;
    text-align: left;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    span {
      border-bottom: 1px dashed;
    }
  }
}
</style>
