<template lang="pug">
  ErtDialog(
    v-model="internalValue"
    fullscreen
    transition="dialog-bottom-transition"
  )
    template(v-slot:activator="{ on }")
      slot(name="activator" v-bind="{ on }")
    .er-document-viewer(ref="modal")
      .er-document-viewer__head.d--flex.px-16.align-items-center
        .title {{ currentDocument.fileName }}
        .type.px-16
          er-select(
            :items="computedListType"
            v-model="currentType"
            label="name"
          )
        .actions.ml-auto.d--flex
          //- Ручное подписание документа
          er-tooltip(left v-if="isManualSigning")
            template(v-slot:activator="{ on }")
              button.mr-16(@click="() => { manualSigning() }")
                span(v-on="on")
                  er-icon(name="doc_edit")
            span Подписать вручную
          //- Подписание с помощью ЭЦП
          er-tooltip(left v-if="isDigitalSigning")
            template(v-slot:activator="{ on }")
              button.mr-16(@click="() => { digitalSigning() }")
                span(v-on="on")
                  er-icon(name="key")
            span Подписать ЭЦП
          //- Загрузить документ на устройство
          er-tooltip(left)
            template(v-slot:activator="{ on }")
              button.mr-16(@click="() => { downloadFileOnDevice() }" v-if="isExistsFile")
                span(v-on="on")
                  er-icon(name="download")
            span Загрузить
          //- Закрыть просмотрщик
          er-tooltip(left)
            template(v-slot:activator="{ on }")
              button.close(@click="() => { internalValue = false }")
                span(v-on="on")
                  er-icon(name="close")
            span Закрыть
      .er-document-viewer__body
        div(v-if="isExistsFile" key="fileExists")
          embed(:src="currentDocumentFile")
        div(v-else key="fileNotExists")
          div.no-download Документ не загружен или не найден
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
