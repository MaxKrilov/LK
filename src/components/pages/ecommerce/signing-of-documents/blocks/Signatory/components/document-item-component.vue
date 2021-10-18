<template lang="pug">
  .ert-document-item-component
    ErDocumentViewer(
      v-model="isShowDocument"
      :listDocument="computedDocument"
    )
      template(v-slot:activator="{ on }")
        DocumentName(
          :documentName="computedDocumentName"
          :hasRemove="false"
          v-on="on"
        )
</template>

<script lang="ts">
import Vue from 'vue'
import ErDocumentViewer from '@/components/blocks/ErDocumentViewer/index.vue'
import DocumentName from '@/components/pages/ecommerce/signing-of-documents/blocks/FileName'

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
      isShowDocument: false
    }
  },
  computed: {
    computedDocument () {
      return [this.document]
    },
    computedDocumentName () {
      return this.document.fileName
    }
  }
})
</script>

<style lang="scss">
.ert-document-item-component .e-commerce-document-name {
  cursor: pointer;
}
</style>
