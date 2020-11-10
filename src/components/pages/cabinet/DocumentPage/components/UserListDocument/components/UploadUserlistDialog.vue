<template lang="pug">
er-dialog-advanced(:active="active", icon="doc", @close="$emit('close')")
  template(v-slot:title) Загрузить список пользователей

  | Вы обязаны предоставить список пользователей во исполнение требований Правил оказания услуг связи по передаче данных, утвержденных постановлением Правительства РФ от 23.01.2006 №32, Правил оказания телематических услуг связи, утвержденные постановлением Правительства РФ от 10.09.2007 №575, а также
  a(href="http://base.garant.ru/12155536/" target="_blank") п. 2 ст. 44 ФЗ от 07.07.2003 №126-ФЗ «О связи»

  .text-color-black03.hint-text.mb-16
    | размер файла не должен превышать 2&nbsp;Мб.
    br
    | Формат: doc, docx, xlsx, pdf, csv
  er-file-input-2(
    :allowedExt="['doc', 'docx', 'xlsx', 'pdf', 'csv']",
    :isFileLoaded="isFileLoaded",
    @input="handleFileInput"
  )

  template(v-slot:actions)
    .user-list-modal__buttons
      er-button(:disabled="!isOk", @click="save" :loading="isChangingInfo") Сохранить
      er-button(color="gray", @click="$emit('close')") Отменить
</template>

<script>
import { mapGetters } from 'vuex'
import { UPLOAD_FILE, ATTACH_SIGNED_DOCUMENT } from '@/store/actions/documents'
import { USER_LIST_TYPE } from '@/constants/document'

export default {
  name: 'upload-userlist-dialog',
  props: {
    active: Boolean
  },
  data () {
    return {
      isFileLoaded: false,
      isOk: false,
      isChangingInfo: false,
      isError: false
    }
  },
  computed: {
    ...mapGetters('auth', ['getTOMS'])
  },
  methods: {
    save () {
      this.isChangingInfo = true
      const userData = {
        dateOfLoadingUL: this.$moment().format('DD.MM.YYYY'),
        api: this.$api
      }
      this.$store.dispatch('user/updateClientInfo', userData)
        .then((answer) => {
          this.$store.dispatch('user/GET_CLIENT_INFO', { api: this.$api })
            .finally(() => {
              this.$emit('close')
            })
        })
        .finally(() => {
          this.isChangingInfo = false
        })
    },
    async handleFileInput (file, fileName, uploadCallback) {
      this.isError = false
      if (file) {
        const fileBlob = await (await fetch(file)).blob()
        const filePath = `${this.$moment().format('MMYYYY')}/${this.getTOMS}`
        const fileData = {
          api: this.$api,
          bucket: 'customer-docs',
          file: fileBlob,
          uploadCallback,
          filePath,
          fileName,
          type: USER_LIST_TYPE,
          relatedTo: this.getTOMS
        }

        this.isFileLoaded = false
        const sendFile = await this.$store.dispatch(
          'documents/' + UPLOAD_FILE,
          fileData
        )
        if (sendFile) {
          const saveFile = await this.$store.dispatch(
            'documents/' + ATTACH_SIGNED_DOCUMENT,
            fileData
          )
          if (saveFile) {
            this.isOk = true
          } else {
            this.isError = true
            return
          }
          this.isFileLoaded = true
        } else {
          this.isError = true
          return
        }
        this.isOk = true
      } else {
        this.isFileLoaded = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-list-modal__buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 32px;
  width: 100%;
}

.er-dialog {
  max-width: 550px;
}
</style>
