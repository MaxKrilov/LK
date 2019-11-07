<template>

  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter_glow_instagram)">
      <path fill-rule="evenodd" clip-rule="evenodd"
        d="M34 18H22C19.7909 18 18 19.7909 18 22V34C18 36.2091 19.7909 38 22 38H34C36.2091 38 38 36.2091 38 34V22C38 19.7909 36.2091 18 34 18ZM22 16C18.6863 16 16 18.6863 16 22V34C16 37.3137 18.6863 40 22 40H34C37.3137 40 40 37.3137 40 34V22C40 18.6863 37.3137 16 34 16H22Z"
        fill="white" />
      <path fill-rule="evenodd" clip-rule="evenodd"
        d="M28 32C30.2091 32 32 30.2091 32 28C32 25.7909 30.2091 24 28 24C25.7909 24 24 25.7909 24 28C24 30.2091 25.7909 32 28 32ZM28 34C31.3137 34 34 31.3137 34 28C34 24.6863 31.3137 22 28 22C24.6863 22 22 24.6863 22 28C22 31.3137 24.6863 34 28 34Z"
        fill="white" />
      <circle cx="34.5" cy="21.5" r="1.5" fill="white" />
    </g>
    <defs>
      <filter id="filter_glow_instagram" x="0" y="0" width="56" height="56" filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset />
        <feGaussianBlur stdDeviation="6" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.956863 0 0 0 0 0.705882 0 0 0 0 1 0 0 0 1 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset />
        <feGaussianBlur stdDeviation="1.5" />
        <feColorMatrix type="matrix" values="0 0 0 0 0.958583 0 0 0 0 0.704167 0 0 0 0 1 0 0 0 1 0" />
        <feBlend mode="normal" in2="effect1_dropShadow" result="effect2_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow" result="shape" />
      </filter>
    </defs>
  </svg>
</template>
