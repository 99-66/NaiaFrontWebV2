<template>
  <q-page class="relative-position">
    <q-page class="doc-page">
      <h2 class="doc-page doc-h2">
        Related Words
      </h2>
      <div>
        <q-item>
          <q-item-section>
            <q-card flat>
                <q-input filled v-model="word" :dense=true label="Search Word" v-on:keyup.enter="search"/>
            </q-card>
          </q-item-section>

          <q-item-section avatar>
            <q-btn size="md" color="primary" icon="search" label="Search" @click="search"/>
          </q-item-section>
        </q-item>
      </div>

      <div v-if="setNodes">
        <q-list bordered class="rounded-borders">
          <q-item>
            <q-item-section>
              <d3-network
                :net-nodes="nodes"
                :net-links="links"
                :options="options"
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
    </q-page>
  </q-page>
</template>

<script>
import axios from 'axios'
import { Loading,  QSpinnerPie } from 'quasar'
import D3Network from 'vue-d3-network'

export default {
  name: "RelatedWord",
  components: {
    D3Network
  },
  data() {
    return {
      apiUrl : process.env.VUE_APP_ROOT_API,
      word: '',
      words: [],
      nodes: [],
      setNodes: false,
      links: [],
      options: {
        force: 3000,
        nodeSize: 25,
        nodeLabels: true,
        linkWidth: 1,
        fontSize: 15,
        size: {
          h: 760
        }
      },
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
    initItems() {
      this.nodes = []
      this.links = []
      this.setNodes = false
      this.tweets = []
      this.setTweets = false
    },
  },
  created() {
  },
  mounted() {
  },
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
</style>
