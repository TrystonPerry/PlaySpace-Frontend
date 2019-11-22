<template>
  <div class="nav-divider inline-flex items-center text-xl text-center mb-2">
    <div class="flex-shrink-0 text-base">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.nav-divider {
  &:before,
  &:after {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    margin: 0 0.5em;
    background: #fff;
  }
}
</style>
