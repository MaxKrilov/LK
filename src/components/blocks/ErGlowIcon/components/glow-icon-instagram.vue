<template>
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter_glow_instagram)">
      <path fill-rule="evenodd" clip-rule="evenodd"
        d="M30 14H18C15.7909 14 14 15.7909 14 18V30C14 32.2091 15.7909 34 18 34H30C32.2091 34 34 32.2091 34 30V18C34 15.7909 32.2091 14 30 14ZM18 12C14.6863 12 12 14.6863 12 18V30C12 33.3137 14.6863 36 18 36H30C33.3137 36 36 33.3137 36 30V18C36 14.6863 33.3137 12 30 12H18Z"
        fill="white" />
      <path fill-rule="evenodd" clip-rule="evenodd"
        d="M24 28C26.2091 28 28 26.2091 28 24C28 21.7909 26.2091 20 24 20C21.7909 20 20 21.7909 20 24C20 26.2091 21.7909 28 24 28ZM24 30C27.3137 30 30 27.3137 30 24C30 20.6863 27.3137 18 24 18C20.6863 18 18 20.6863 18 24C18 27.3137 20.6863 30 24 30Z"
        fill="white" />
      <circle cx="30.5" cy="17.5" r="1.5" fill="white" />
    </g>
    <defs>
      <filter id="filter_glow_instagram" x="-4" y="-4" width="56" height="56" filterUnits="userSpaceOnUse"
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
