<template lang="pug">
  .ert-document-item-component
    DocumentName(
      :documentName="computedDocumentName"
      :hasRemove="false"
      @click="onDownloadDocumentHandler($props.document)"
    )
</template>

<script lang="ts">
import Vue from 'vue'
import ErDocumentViewer from '@/components/blocks/ErDocumentViewer/index.vue'
import DocumentName from '@/components/pages/ecommerce/signing-of-documents/blocks/FileName'
import { ISigningDocument } from '@/tbapi/fileinfo'
import { mapActions } from 'vuex'

export default Vue.extend({
  name: 'document-item-component',
  components: {
    ErDocumentViewer,
    DocumentName
  },
  props: {
    document: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      isShowDocument: false,
      isLoadingDocument: false
    }
  },
  computed: {
    computedDocument () {
      return [this.document]
    },
    computedDocumentName () {
      return this.$data.isLoadingDocument ? 'Скачиваем' : this.document.fileName
    }
  },
  methods: {
    ...mapActions({
      downloadFile: 'fileinfo/downloadFile'
    }),
    async onDownloadDocumentHandler (document: ISigningDocument) {
      this.$data.isLoadingDocument = true

      // @ts-ignore
      const file = await this.downloadFile({
        api: this.$api,
        bucket: document.bucket,
        key: document.filePath,
        ext: document.fileName.split('.').pop()
      })

      const link = window.document.createElement('a')
      link.href = URL.createObjectURL(file)
      link.download = document.fileName

      window.document.body.append(link)
      link.click()
      link.remove()

      this.$data.isLoadingDocument = false

      setTimeout(() => URL.revokeObjectURL(link.href), 7000)
    }
  }
})
</script>

<style lang="scss">
.ert-document-item-component .e-commerce-document-name {
  cursor: pointer;
}
</style>
