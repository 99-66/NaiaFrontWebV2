<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
        <q-page class="doc-page">
          <div>
            <h2 class="doc-page doc-h2">
              <span>Word Statistics</span>
            </h2>

            <div>
              <q-chip class="text-weight-bold">최근 3시간 동안 수집된 단어의 수</q-chip>
              <div class="row">
                <div class="col">
                  <q-card-section class="col-xs-2">
                    <div class="text-overline q-mb-xs">ALL</div>
                    <div class="text-h5 q-mb-xs">{{ tagCount.all | comma }}</div>
                  </q-card-section>
                </div>
                <div class="col">
                  <q-card-section class="col-xs-2">
                    <div class="text-overline q-mb-xs">SNS</div>
                    <div class="text-h5 q-mb-xs">{{ tagCount.sns | comma }}</div>
                  </q-card-section>
                </div>
                <div class="col">
                  <q-card-section class="col-xs-2">
                    <div class="text-overline q-mb-xs">Article</div>
                    <div class="text-h5 q-mb-xs">{{ tagCount.article | comma }}</div>
                  </q-card-section>
                </div>
                <div class="col">
                  <q-card-section class="col-xs-2">
                    <div class="text-overline q-mb-xs">Community</div>
                    <div class="text-h5 q-mb-xs">{{ tagCount.community | comma }}</div>
                  </q-card-section>
                </div>
              </div>
            </div>

            <div>
              <q-chip class="text-weight-bold">7일간 수집된 단어의 수</q-chip>
              <line-chart></line-chart>
            </div>
          </div>

          <div>
            <h2 class="doc-page doc-h2-inner">
              <span>Options</span>
            </h2>

            <div>
              <q-item>
                <q-item-section avatar>
                  <q-chip outline rounded color="secondary" icon="filter_alt" label="Filter" />
                </q-item-section>
                <q-radio keep-color v-model="filterWord" val="all" label="All" color="teal" />
                <q-radio keep-color v-model="filterWord" val="sns" label="SNS" color="cyan" />
                <q-radio keep-color v-model="filterWord" val="article" label="Article" color="red" />
                <q-radio keep-color v-model="filterWord" val="community" label="Community" color="orange" />
              </q-item>
            </div>
          </div>

          <div v-if="words">
            <h2 class="doc-page doc-h2-inner">
              <span>Word Cloud</span>
            </h2>

            <q-card flat>
              <div>
                <vue-word-cloud
                  style="
                  height: 380px;
                  width: auto;"
                  :words="words"
                  :animation-duration="3000"
                  :animation-overlap="0.2"
                  :weight="1"
                  :spacing="0.6"
                  :color="color"
                  :font-size-ratio="6"
                  font-family="fantasy"
                >
                  <template slot-scope="{text, weight, word}">
                    <div :title="weight" style="cursor: pointer;" @click="triggerWordRating(text)">
                      {{ text }}
                    </div>
                  </template>
                </vue-word-cloud>
              </div>
            </q-card>
          </div>

          <div>
            <h2 class="doc-page doc-h2-inner">
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
                    <q-item-label class="text-subtitle1 overflow-auto">
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
          </div>

        </q-page>
    </q-scroll-area>

  </q-page>
</template>

<script>
import axios from 'axios'
import { Loading,  Notify, QSpinnerPie } from 'quasar'
import LineChart from "components/LineChart"

const Chance = require('chance');
const chance = new Chance();

export default {
  name: 'Main',
  components: {
    LineChart
  },
  data() {
    return {
      apiUrl : process.env.VUE_APP_ROOT_API,
      projectDescUrl: process.env.VUE_APP_PROJECT_DESCRIPTION_URL,
      colorItems: ['#ffd077', '#3bc4c7', '#3a9eea', '#ff4e69', '#461e47'],
      rows: [],
      errors: [],
      words: null,
      filterWord: 'all',
      tagCount: {
        'all': 0,
        'sns': 0,
        'article': 0,
        'community': 0
      }
    }
  },
  methods: {
    async fetchData(param) {
      Loading.show({
        spinner: QSpinnerPie,
      })
      if (param === undefined) {
        param = "all"
      }
      await axios.get(this.apiUrl + '/list', {params: {f: param}})
        .then(response => {
          this.rows = response.data.message
          Loading.hide()
        })
        .catch(e => {
          Loading.hide()
        })

      await axios.get(this.apiUrl + '/wordcloud', {params: {f: param}})
        .then(response => {
          this.words = response.data.message
        })

      await axios.get(this.apiUrl + '/tag/count')
        .then(response => {
          const data = response.data.message
          for (let i = 0; i < data.length; i++) {
            this.tagCount[data[i].tag] = data[i].count
          }
        })
    },
    makeString(params) {
      var txt = "";
      for (var i = 0; i < params.length; i++) {
        txt += params[i].tag.toUpperCase() + ": " + Math.round(params[i].percent * 100) / 100 + "%<br>"
      }
      txt = txt.replace(/\|*$/, '');
      return txt;
    },
    triggerWordRating (value) {
      this.tags = [];
      axios.get(this.apiUrl + '/tag/w/' + value)
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
    },
  },
  created() {
    Notify.registerType('wordRating', {
      progress: true,
      textColor: 'white',
    })
  },
  mounted() {
    this.fetchData()
    this.interval = setInterval(function() {
      this.fetchData()
    }.bind(this), 300000)
  },
  computed: {
    color: function() {
      const colors = this.colorItems
      return function() {
        return chance.pickone(colors)
      };
    }
  },
  watch: {
    filterWord: function(param) {
      this.fetchData(param)
    }
  },
  filters: {
    comma: function (value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }
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
  margin: 1rem 0 1.5rem

.doc-h2-inner
  font-size: 1.5rem
  line-height: 1.5rem
  padding: 0.5rem 0
  font-weight: 500
  border-bottom: 1px solid #ccc
  margin: 3rem 0 1.5rem

</style>
