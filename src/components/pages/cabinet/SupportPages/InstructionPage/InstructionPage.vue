<template lang="pug">
    .instruction-page.main-content.main-content--top-menu-fix.main-content--h-padding.main-content--top-padding
      er-page-header(
        linkText="Назад в раздел Поддержка"
        :title="instructionContent.name"
        backlink="/lk/support"
      )
      .instruction-page__content(v-html="instructionContent.short_description")
</template>
<script lang="ts" src="./InstructionPage.ts"></script>
