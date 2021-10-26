<template lang="pug">
  .e-commerce-signing-with-scans
    h3.e-commerce-signing-with-scans__title Подписать и загрузить подписанные документы
    .e-commerce-signing-with-scans__tabs.mb--m
      .tabs__container
        .tabs-items
          ul.tabs__list
            li.tabs__item(:class="{ 'active': activeTab === 'scan' }")
              a(href="#" @click.prevent="() => { activeTab = 'scan' }")
                span Загрузить подписанные документы
            li.tabs__item(:class="{ 'active': activeTab === 'office' }")
              a(href="#" @click.prevent="() => { activeTab = 'office' }")
                span Подписать в офисе
    template(v-if="activeTab === 'scan'")
      .e-commerce-signing-with-scans__document.mb--m(
        v-for="(document, key) in (documents || {})"
        :key="key"
      )
        .e-commerce-signing-with-scans__document__title.mb--m
          h4 {{ document.type.name }} (Договор № {{ key }})
          a.download(
            :disabled="listViewerFlag[key]"
            @click.prevent="onDownloadDocumentHandler(document, key)"
          )
            ErtIcon(name="download_1")
            span {{ listViewerFlag[key] ? 'Подождите' : 'Скачать документ' }}
        .e-commerce-signing-with-scans__document__success(v-if="document.contractStatus === 'Подписан'")
          ErtIcon(name="erth__check")
          span Документ успешно подписан, можно оплачивать
        .e-commerce-signing-with-scans__document__is-verifying(v-else-if="document.verifying === 'Да' || isLoadSuccess")
          ErtProgressCircular(indeterminate width="4" size="24")
          span Мы проверим документы в течение 4 рабочих часов.
        template(v-else)
          .e-commerce-signing-with-scans__document__uploaded-document(v-if="listInternalFile[key] && tracker")
            DocumentName(
              :documentName="listInternalFile[key].name"
              @remove="() => { onDeleteInternalFile(key) }"
            )
          .e-commerce-signing-with-scans__document__uploaded-document(v-else-if="tracker")
            FileUpload(
              labelText="Перетащите подписанный документ в эту область или выберите на компьютере"
              @input="(file) => { onAddInternalFile(key, file) }"
            )
      .e-commerce-signing-with-scans__actions(v-if="isUploadAllDocuments")
        ErButton.mb-16(:loading="isLoading" :disabled="isLoaded" @click="onUploadDocuments") Сохранить
        .caption2 Обратите внимание! Договор требуется загрузить одним файлом размером не более 2Мб. После сохранения, документ будет отправлен на проверку, удаление документа станет невозможным!
      .e-commerce-signing-with-scans__success.caption2.success--text(v-if="isLoadSuccess") Документы успешно сохранены
      .e-commerce-signing-with-scans__success.caption2.error--text(v-if="isLoadError") Произошла ошибка при сохранении документов
    template(v-else-if="activeTab === 'office'")
      .e-commerce-signing-with-scans__office
        .e-commerce-signing-with-scans__office-address
          h4.mb--s Контакты {{ officeName }}
          .office-image.mb--s
            img(:src="require('@/assets/images/domru_office.png')")
          .address.mb--s
            span.mb--s {{ computedOfficeAddress }}
            span Время работы: Пн-пт с 09:00 до 18:00, сб-вс — выходной
          .phones
            .phone-item.mb--s
              a(href="tel:78005515819") 8 800 551-58-19
              .operating-mode
                span Отдел продаж: пн-пт, 8:00-22:00
                span Звонок бесплатный по России
            .phone-item
              a(href="tel:78005001010") 8 800 500-10-10
              .operating-mode
                span Техподдрежка: круглосуточно
</template>

<script lang="ts" src="./script.ts"></script>
<style lang="scss" src="./style.scss"></style>
