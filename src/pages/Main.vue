<template>
  <q-page class="relative-position">
    <q-page class="doc-page">
      <div class="row justify-evenly">
        <div class="col-md-8">
          <div>
            <h2 class="doc-page doc-h2">
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
                    <div :title="weight" style="cursor: pointer;" @click="triggerWord(text)">
                      {{ text }}
                    </div>
                  </template>
                </vue-word-cloud>
              </div>
            </q-card>
          </div>

          <div>
            <h2 class="doc-page doc-h2-inner">
              <span>Related Words</span>
            </h2>

            <RelatedWord v-bind:propsword="word"></RelatedWord>
          </div>
          <div>
            <h2 class="doc-page doc-h2-inner">
              <span>Word Statistics</span>
            </h2>

            <div>
              <q-chip class="text-weight-bold">최근 3시간 동안 수집된 단어의 수</q-chip>
              <div class="row">
                <div class="col">
                  <q-card-section>
                    <div class="text-overline q-mb-xs">ALL</div>
                    <div class="text-h5 q-mb-xs">{{ tagCount.all | comma }}</div>
                  </q-card-section>
                </div>
                <div class="col">
                  <q-card-section>
                    <div class="text-overline q-mb-xs">SNS</div>
                    <div class="text-h5 q-mb-xs">{{ tagCount.sns | comma }}</div>
                  </q-card-section>
                </div>
                <div class="col">
                  <q-card-section>
                    <div class="text-overline q-mb-xs">Article</div>
                    <div class="text-h5 q-mb-xs">{{ tagCount.article | comma }}</div>
                  </q-card-section>
                </div>
                <div class="col">
                  <q-card-section>
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
        </div>

        <div class="col-md-3">
          <div>
            <h2 class="doc-page doc-h2">
              <span>Word Ranking</span>
            </h2>

            <q-card flat bordered>
              <q-list
                v-for="(row, i) in rows"
                :key="row.word"
              >
                <q-item>
                  <q-item-section top avatar>
                    <q-avatar>
                      {{ i + 1 }}
                    </q-avatar>
                  </q-item-section>

                  <q-item-section @click="triggerWord(row.word)">
                    <q-btn flat color="dark" class="overflow-auto" :label="row.word"></q-btn>
                  </q-item-section>

                  <q-item-section side top>
                    <q-chip color="primary" text-color="white" class="text-weight-bold">
                      {{ Number(row.count).toLocaleString() }}
                    </q-chip>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </div>
      </div>
    </q-page>
  </q-page>
</template>

<script>
import axios from 'axios'
import { Loading,  QSpinnerPie } from 'quasar'
import LineChart from "components/LineChart"
import RelatedWord from "components/RelatedWord"

const Chance = require('chance');
const chance = new Chance();

export default {
  name: 'Main',
  components: {
    LineChart,
    RelatedWord
  },
  meta: {
    title: 'What Issue Now?',

    meta: {
      description: { name: 'description', content: '여러 채널에서 수집한 문장, 제목에서 명사만을 추출하여 빈도수 상위 30개의 단어와 연관된 단어를 보여줍니다. 단어 목록은 현재시간 기준으로 3시간 전까지의 수집한 문장들의 단어를 기준으로하여 수치와 함께 보여줍니다' },
      equiv: { 'http-equiv': 'Content-Type', content: 'text/html; charset=UTF-8' },
      ogTitle:  {
        name: 'og:title',
        template (ogTitle) {
          return 'What Issue Now?'
        }
      }
    },
    noscript: {
      default: 'This is content for browsers with no JS (or disabled JS)'
    }
  },
  data() {
    return {
      apiUrl : process.env.VUE_APP_ROOT_API,
      projectDescUrl: process.env.VUE_APP_PROJECT_DESCRIPTION_URL,
      colorItems: ['#ffd077', '#3bc4c7', '#3a9eea', '#ff4e69', '#461e47'],
      rows: [],
      errors: [],
      word: '',
      words: null,
      filterWord: 'all',
      tagCount: {
        'all': 0,
        'sns': 0,
        'article': 0,
        'community': 0
      },
      splitterModel: 300
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
    triggerWord(param) {
      this.word = param
    }
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
  max-width: 1300px
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
