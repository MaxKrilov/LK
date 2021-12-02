<template lang="pug">
  er-dialog(
    v-model="internalValue"
    fullscreen
    transition="dialog-bottom-transition"
  )
    template(v-slot:activator="{ on }")
      slot(name="activator" v-bind="{ on }")
    .er-document-viewer(ref="modal")
      .er-document-viewer__head.d--flex.px-16.align-items-center
        .title {{ fileName }}
        .actions.ml-auto.d--flex
          //- Загрузить документ на устройство
          er-tooltip(left)
            template(v-slot:activator="{ on }")
              button.mr-16(
                @click="() => { downloadFileOnDevice() }"
                v-if="isExistsFile"
                data-ga-category="internet"
                data-ga-label="connectionsetup"
              )
                span(v-on="on")
                  er-icon(name="download")
            span Загрузить
          //- Закрыть просмотрщик
          er-tooltip(left)
            template(v-slot:activator="{ on }")
              button.close(
                @click="() => { internalValue = false }"
                data-ga-category="internet"
                data-ga-label="connectionsetup"
              )
                span(v-on="on")
                  er-icon(name="close")
            span Закрыть
      .er-document-viewer__body
        div(v-if="isLoading")
          div.no-download Загружаем...
        div(v-else-if="isExistsFile" :key="fileExists")
          embed(:src="file")
        div(v-else key="fileNotExists")
          div.no-download Документ не загружен или не найден
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
