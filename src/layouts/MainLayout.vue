<template>
  <q-layout view="lHh Lpr lFf">
    <q-header bordered class="bg-white text-black">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title class="text-weight-bold">
          <span class="gt-sm">{{ $route.name }}</span>
          <span class="lt-sm">What Issue Now?</span>
        </q-toolbar-title>

      </q-toolbar>
    </q-header>


    <q-drawer
      v-model="left"
      side="left"
      :width="283"
      bordered
      show-if-above
    >
      <div class="row justify-center q-mt-md q-mb-sm">
          <span class="col row left-top-logo">
            <span class="text-center col items-center justify-center row no-wrap text-no-wrap">
              <span class="text-weight-bold text-h6">What Issue Now?</span>
            </span>
          </span>
      </div>

      <q-list>
        <q-item
          to="/"
          clickable
          v-ripple
          exact
        >
          <q-item-section avatar>
            <q-icon name="home" size="md" />
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold">Home</q-item-section>
        </q-item>

        <q-item
          to="/related-word"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon name="share" size="md" />
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold">RelatedWord</q-item-section>
        </q-item>

        <q-item
          to="/about"
          clickable
          v-ripple
        >
          <q-item-section avatar>
            <q-icon name="help" size="md" />
          </q-item-section>

          <q-item-section class="text-h6 text-weight-bold">About</q-item-section>
        </q-item>
      </q-list>

    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',
  data () {
    return {
      left: false,
    }
  }
}
</script>

<style lang="sass">
.left-top-logo
  padding: 12px 24px
  min-width: 0
  min-height: 0
</style>
