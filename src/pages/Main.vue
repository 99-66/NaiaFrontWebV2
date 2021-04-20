<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
        <q-page class="doc-page">
          <h2 class="doc-page doc-h2">
            <span>Word Ranking</span>
          </h2>

          <q-card flat>
            <q-list
            v-for="(row, i) in rows"
            :key="row.word"
            padding
            >
              <q-item>
                <q-item-section top avatar>
                  <q-avatar>
                    {{ i + 1 }}
                  </q-avatar>
                </q-item-section>

                <q-item-section @click="triggerWordRating(row.word)">
                  <q-item-label class="text-subtitle1">
                    {{ row.word }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-chip color="primary" text-color="white" class="text-weight-bold">
                    {{ Number(row.count).toLocaleString() }}
                  </q-chip>
                </q-item-section>
              </q-item>

              <q-separator spaced/>
            </q-list>
          </q-card>

        </q-page>
    </q-scroll-area>

  </q-page>
</template>

<script>
import axios from 'axios'
import { Loading,  QSpinnerPie } from 'quasar'

export default {
  name: 'Main',
  data() {
    return {
      apiUrl : process.env.VUE_APP_ROOT_API,
      projectDescUrl: process.env.VUE_APP_PROJECT_DESCRIPTION_URL,
      rows: [],
      errors: []
    }
  },
  methods: {
    async fetchData() {

      Loading.show({
        spinner: QSpinnerPie,
      })

      await axios.get(this.apiUrl + '/list')
        .then(response => {
          this.rows = response.data.message
          Loading.hide()
        })
        .catch(e => {
          Loading.hide()
        })
    },
    makeString(params) {
      var txt = "";
      for (var i = 0; i < params.length; i++) {
        txt +=params[i].tag.toUpperCase() + ": " + Math.round(params[i].percent * 100)/100 + "%<br>"
      }
      txt = txt.replace(/\|*$/, '');
      return txt;
    },
    triggerWordRating (value) {
      this.tags = [];
      axios.get(this.apiUrl + '/tag/' + value)
      .then(response => {
        this.tags = response.data.message
        const notiText = this.makeString(this.tags)

        this.$q.notify({
          type: 'wordRating',
          icon: 'insert_chart',
          message: notiText,
          color: '$dark',
          group: false,
          position: 'top-right',
          html: true,
          caption: value
        })
      })
      .catch(e => {
      })

    }
  },
  created () {
    this.$q.notify.registerType('wordRating', {
      progress: true,
      textColor: 'white',
    })
  },
  mounted() {
    this.fetchData()
    this.interval = setInterval(function() {
      this.fetchData();
    }.bind(this), 300000)
  },
}
</script>

<style lang="sass" scoped>
.doc-page
  padding: 16px 46px
  font-weight: 300
  max-width: 900px
  margin-left: auto
  margin-right: auto

.doc-h2
  font-size: 1.5rem
  line-height: 1.5rem
  padding: 0.5rem 0
  font-weight: 500
  border-bottom: 1px solid #ccc
  margin: 4rem 0 1.5rem

</style>
