<template>
  <q-card class="bg-white full-width">
    <q-card-section>
      <div>
        <q-item>
          <q-item-section>
            <q-card flat>
                <q-input filled v-model="localWord" :dense=true label="Search Word" v-on:keyup.enter="localSearch"/>
            </q-card>
          </q-item-section>

          <q-item-section class="col-xs-2">
            <q-btn size="md" color="primary" label="Search" @click="localSearch"/>
          </q-item-section>
        </q-item>
      </div>

      <div v-if="setNodes" id="network-wrapper">
        <q-list bordered class="rounded-borders">
          <div class="row justify-end">
            <q-btn
              class="q-pr-md"
              color="secondary"
              flat
              :dense="true"
              icon="text_format"
              :label="resultText"
            />
            <q-btn
              class="q-pr-md"
              color="secondary"
              flat
              @click="screenShot"
              :dense="true"
              icon="image"
              label="Download"
            />
            <q-btn
              class="q-pr-md"
              color="secondary"
              flat
              @click="toggleFullscreen"
              :dense="true"
              :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
              :label="$q.fullscreen.isActive ? 'Exit Fullscreen' : 'Fullscreen'"
            />
          </div>

          <q-item>
              <q-item-section>
                <d3-network
                  :net-nodes="nodes"
                  :net-links="links"
                  :options="options"
                  ref="network"
                  id="network"
                />
              </q-item-section>
            </q-item>
        </q-list>
      </div>

      <div v-if="setTweets">
        <h2 class="doc-page doc-h2-inner">
          <span>Recently Tweets</span>
        </h2>

        <q-card>
          <q-table
            id="tweet-table"
            title="Tweets"
            :data="tweets"
            :columns="columns"
            row-key="name"
            virtual-scroll
            :pagination.sync="initialPagination"
            :rows-per-page-options="[0]"
            style="height: 640px"
            hide-header
            hide-bottom
          >
          </q-table>
        </q-card>

      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import axios from 'axios'
import { Loading,  QSpinnerPie } from 'quasar'
import D3Network from 'vue-d3-network'
import moment from "moment";

export default {
  name: "RelatedWord",
  components: {
    D3Network
  },
  props: ['propsword'],

  data() {
    return {
      graphHeightOptions: [
        640, 720, 960, 1080, 1280, 1440
      ],
      graphHeight: 720,
      graphWidth: 740,

      apiUrl : process.env.VUE_APP_ROOT_API,
      localWord: '',
      result: '',
      word: '',
      words: [],
      nodes: [],
      setNodes: false,
      links: [],
      setTweets: false,
      tweets: [],
      columns: [
        {
          name: 'text',
          align: 'left',
          label: 'Tweet',
          sortable: false,
          field: row => row.text,
          style: 'width: 80px',
        },
        {
          name: 'createdAt',
          align: 'left',
          label: 'Date',
          sortable: false,
          field: row => row.createdAt
        }
      ],
      initialPagination: {
        rowsPerPage: 0
      },
    }
  },
  methods: {
    async fetchWordData(word) {
      const url = this.apiUrl + '/related/w/' + word
      return await axios.get(url)
    },
    async fetchRecentlyTweetData(word) {
      const url = this.apiUrl + '/related/list/' + word
      return await axios.get(url)
    },
    search() {
      if (this.word === "") {
        return
      }

      this.initItems()
      Loading.show({
        spinner: QSpinnerPie,
      })

      this.fetchWordData(this.word)
      .then(response => {
        this.nodes = response.data.message.nodes
        this.setNodes = this.nodes.length !== 0;
        this.links = response.data.message.links
        Loading.hide()

        this.localWord = this.word
        this.result = this.word
      })
      .catch(e => {
        Loading.hide()
      })

      this.fetchRecentlyTweetData(this.word)
      .then(response => {
        this.tweets = response.data.message
        this.setTweets = this.tweets.length !== 0
        Loading.hide()
      })
      .catch(e => {
        Loading.hide()
      })

    },
    localSearch() {
      if (this.localWord === "") {
        return
      }

      this.initItems()
      Loading.show({
        spinner: QSpinnerPie,
      })

      this.fetchWordData(this.localWord)
        .then(response => {
          this.nodes = response.data.message.nodes
          this.setNodes = this.nodes.length !== 0;
          this.links = response.data.message.links
          Loading.hide()

          this.result = this.localWord
        })
        .catch(e => {
          Loading.hide()
        })

      this.fetchRecentlyTweetData(this.localWord)
        .then(response => {
          this.tweets = response.data.message
          this.setTweets = this.tweets.length !== 0
          Loading.hide()
        })
        .catch(e => {
          Loading.hide()
        })

    },
    initItems() {
      this.nodes = []
      this.links = []
      this.setNodes = false
      this.tweets = []
      this.setTweets = false
    },

    screenShot () {
      this.takeScreenShot()
    },
    takeScreenShot () {
      const today = moment(new Date()).format('YYYYMMDDHHmmss')
      this.$refs.network.screenShot(this.word + '_' + today + '_연관_단어_그래프.png', null, this.toSvg)
    },

    toggleFullscreen() {
      const target = document.getElementById('network-wrapper')

      this.$q.fullscreen.toggle(target)
        .then(() => {

        })
        .catch((err) => {
        })
    }
  },
  computed: {
    options() {
      if (this.$q.fullscreen.isActive === false) {
        return {
          force: 1500,
          nodeSize: 25,
          nodeLabels: true,
          linkWidth: 1,
          fontSize: 15,
          size: {
            h: this.graphHeight,
            w: this.graphWidth
          }
        }
      } else {
        return {
          force: 2000,
          nodeSize: 25,
          nodeLabels: true,
          linkWidth: 1,
          fontSize: 15,
          size: {
            h: window.innerHeight,
            w: window.innerWidth
          }
        }
      }
    },
    resultText() {
      return this.result
    }
  },
  watch: {
    word: function() {
      this.search()
    },
    propsword: function () {
      this.word = this.propsword
    }
  }
}
</script>

<style src="vue-d3-network/dist/vue-d3-network.css"></style>
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

.doc-note
  background-color: #eee
  border-radius: 4px
  margin: 16px 0
  padding: 16px 24px
  font-size: 1em
  border-width: 0 5px
  border-style: solid
  border-color: #9e9e9e
  letter-spacing: 0.5px

#network-wrapper
 background-color: white
</style>
