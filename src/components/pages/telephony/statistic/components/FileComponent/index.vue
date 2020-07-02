<template lang="pug">
  .file-component
    er-document-viewer(
      :listDocument="documentForViewer"
      v-model="isOpen"
    )
      template(v-slot:activator="{ on }")
        span.dl-file(v-on="on")
          er-icon(name="download")
          .dl-file__label {{ file.fileName | fileNameFormatted }}
</template>

<script lang="ts">
import Vue from 'vue'
import ErDocumentViewer from '@/components/blocks/ErDocumentViewer/index.vue'

const REGEXP_FILENAME = /([А-Яа-я]+)_([A-Za-zА-Яа-я0-9_#]+)_(BPI[\d]+)_([\d-]+)_([\d-]+)_([A-Za-z0-9]+)/g

export default Vue.extend({
  name: 'file-component',
  components: {
    ErDocumentViewer
  },
  filters: {
    fileNameFormatted: (val: string) => {
      return val.replace(REGEXP_FILENAME, '$1_$4_$5')
    }
  },
  props: {
    file: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    isOpen: false
  }),
  computed: {
    documentForViewer () {
      return [{
        id: this.file.id,
        bucket: this.file.bucket,
        fileName: this.file.fileName,
        filePath: this.file.filePath,
        type: {
          id: this.file.type.id,
          name: this.file.type.name
        }
      }]
    }
  }
})
</script>

<style lang="scss" scoped>
.file-component {
  .dl-file {
    display: flex;
    align-items: center;
    @extend %caption1;

    .er-icon {
      @include color-black(.2);
      /deep/ svg {
        width: $padding-x4;
      }
    }

    &__label {
      // @extend %link-behaviour;
      cursor: pointer;

      margin-left: $padding-x2;
      border-bottom: 1px dashed;
    }
  }
}
</style>
