<template lang="pug">
.er-timer
  .er-timer__label Осталось (дд:чч:мм)
  .er-timer__digits
    span.er-timer__days {{ days|leadingZero }}
    span.er-timer__hours {{ hours|leadingZero }}
    span.er-timer__minutes {{ minutes|leadingZero }}
</template>

<script lang="js" src="./script.js"></script>
<style lang="scss" src="./style.scss"></style>
