<template lang="pug">
  er-dialog(
    v-model="internalValue"
    max-width="1024"
  )
    template(v-slot:activator="{ on }")
      slot(name="activator" v-bind="{ on }")
    .er-document-viewer
      .er-document-viewer__content
        .er-document-viewer__close
          button
            er-icon(name="close")
        .er-document-viewer__body
          iframe(:src="computedLinkToDocument")
        .er-document-viewer__footer.d--flex.align-items-center
          .er-document-viewer__download.flex-column.flex-sm-row
            er-button(pre-icon="download" @click="downloadFile")
              | Загрузить
          .er-document-viewer__actions
            slot(name="footer")
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
