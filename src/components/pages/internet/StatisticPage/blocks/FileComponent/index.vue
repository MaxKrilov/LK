<template lang="pug">
  .statistic-internet-page__file-item.mb-8
    er-icon.mr-8(name="husks")
    button(
      @click="downloadFile"
      :disabled="isLoadingDocument"
    )
      span(v-if="!isLoadingDocument")
        | {{ document.fileName | fileNameFormatted }}
      span(v-else)
        | Загружаем документ
</template>

<script lang="ts">
import Vue from 'vue'

const REGEXP_FILENAME = /([А-Яа-я]+)_([A-Za-zА-Яа-я0-9_#]+)_(BPI[\d]+)_([\d-]+)_([\d-]+)_([A-Za-z0-9]+)/g

export default Vue.extend({
  name: 'file-component',
  props: {
    document: {
      type: Object,
      default: () => ({})
    }
  },
  filters: {
    fileNameFormatted: (val: string) => {
      return val.replace(REGEXP_FILENAME, '$1_$4_$5')
    }
  },
  data: () => ({
    isOpen: false,
    isLoadingDocument: false
  }),
  methods: {
    downloadFile () {
      this.isLoadingDocument = true
      this.$store.dispatch('fileinfo/downloadFile', {
        api: this.$api,
        bucket: this.document.bucket,
        key: this.document.filePath,
        ext: 'csv',
        asPdf: 0
      })
        .then((responseBlob) => {
          const a = document.createElement('a')
          document.body.appendChild(a)
          a.style.display = 'none'

          const url = window.URL.createObjectURL(responseBlob)

          a.href = url
          a.download = this.document.fileName

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
    outline: none;
    span {
      border-bottom: 1px dashed;
    }

    &[disabled] {
      @include color-black(0.2);
      cursor: not-allowed;
    }
  }
}
</style>
