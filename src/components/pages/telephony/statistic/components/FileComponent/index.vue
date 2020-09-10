<template lang="pug">
  .file-component
    span.dl-file(@click="downloadFile")
      er-icon(name="download")
      .dl-file__label(v-if="!isLoadingDocument") {{ file.fileName | fileNameFormatted }}
      .dl-file__label(v-else) Загружаем документ
</template>

<script lang="ts">
import Vue from 'vue'

const REGEXP_FILENAME = /([А-Яа-я]+)_([A-Za-zА-Яа-я0-9_#]+)_(BPI[\d]+)_([\d-]+)_([\d-]+)_([A-Za-z0-9]+)/g

export default Vue.extend({
  name: 'file-component',
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
    isOpen: false,
    isLoadingDocument: false
  }),
  methods: {
    downloadFile () {
      if (this.isLoadingDocument) return
      this.isLoadingDocument = true
      this.$store.dispatch('fileinfo/downloadFile', {
        api: this.$api,
        bucket: this.file.bucket,
        key: this.file.filePath,
        ext: 'csv',
        asPdf: 0
      })
        .then((responseBlob) => {
          const a = document.createElement('a')
          document.body.appendChild(a)
          a.style.display = 'none'

          const url = window.URL.createObjectURL(responseBlob)

          a.href = url
          a.download = this.file.fileName

          a.click()

          window.URL.revokeObjectURL(url)
        })
        .finally(() => {
          this.isLoadingDocument = false
        })
    }
  }
})
</script>

<style lang="scss" scoped>
.file-component {
  .dl-file {
    display: inline-flex;
    align-items: center;
    @extend %caption1;

    .er-icon {
      @include color-black(.2);
      >>> svg {
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
