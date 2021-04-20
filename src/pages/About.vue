<template>
  <q-page class="relative-position">
    <q-page class="doc-page">
      <h1 id="introduction" class="doc-page doc-h1">
        Naia
      </h1>

      <p>여러 채널에서 수집한 문장, 제목에서 명사만을 추출하여 빈도수 상위 30개의 단어를 보여준다. 단어 목록은 현재시간 기준으로 3시간 전까지의 수집한 문장들의 단어를 기준으로하여 수치와 함께 보여준다
        일부 불필요하다고 생각되는 단어들은 <strong>불용어</strong>로 분리하여 순위에서 제외시켰다. 해당 목록은 아래에서 확인할 수 있다
      </p>

      <h2 id="stopword" class="doc-heading doc-h2">
        StopWord
      </h2>
      <q-list bordered class="rounded-borders">
        <q-expansion-item
          switch-toggle-side
          expand-separator
          icon="assignment"
          label="불용어 목록 보기"
        >
          <q-card>
            <q-card-section>
              <q-list
                separator
                dense
                v-for="row in rows"
                :key="row"
              >
                <q-item  v-ripple>
                  <q-item-section>{{ row }}</q-item-section>
                </q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <h2 id="link" class="doc-heading doc-h2">
        Links
      </h2>
      <q-list bordered class="rounded-borders">
        <q-item>
          <q-item-section avatar top>
            <q-icon name="account_tree" color="black" size="34px" />
          </q-item-section>

          <q-item-section top class="col-1 gt-sm">
            <q-item-label class="q-mt-sm">GitHub</q-item-label>
          </q-item-section>

          <q-item-section>
            <q-item-label>
              <span class="text-weight-bold">https://github.com/99-66</span>
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="text-grey-8 ">
              <a class="none-a-tag" href="https://github.com/99-66" target="_blank">
                Link to<q-btn class="gt-xs" flat dense round icon="link" />
              </a>
            </div>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar top>
            <q-icon name="description" color="black" size="34px" />
          </q-item-section>

          <q-item-section top class="col-1 gt-sm">
            <q-item-label class="q-mt-sm">Notion</q-item-label>
          </q-item-section>

          <q-item-section>
            <q-item-label>
              <span class="text-weight-bold">{{ projectDescUrl }}</span>
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="text-grey-8 ">
              <a class="none-a-tag" :href="projectDescUrl" target="_blank">
                Link to<q-btn class="gt-xs" flat dense round icon="link" />
              </a>
            </div>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar top>
            <q-icon name="email" color="black" size="34px" />
          </q-item-section>

          <q-item-section top class="col-1 gt-sm">
            <q-item-label class="q-mt-sm">Email</q-item-label>
          </q-item-section>

          <q-item-section>
            <q-item-label>
              <span class="text-weight-bold">6199@outlook.kr</span>
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="text-grey-8 ">
              <a class="none-a-tag" href="mailto:6199@outlook.kr" target="_blank">
                Send to<q-btn class="gt-xs" flat dense round icon="send" />
              </a>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-page>

  </q-page>
</template>

<script>
import axios from 'axios'

export default {
  name: 'About',
  data() {
    return {
      apiUrl : process.env.VUE_APP_ROOT_API,
      projectDescUrl: process.env.VUE_APP_PROJECT_DESCRIPTION_URL,
      rows: [],
      isStopword: false
    }
  },
  methods: {
    fetchStopWords() {
      axios.get(this.apiUrl + '/stopwords')
      .then(response => {
        this.rows = response.data.message
      })
      .catch(e => {
      })
    }
  },
  mounted() {
    this.fetchStopWords()
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

.doc-h1
  font-size: 2rem
  line-height: 2rem
  padding: 1rem 0
  font-weight: 500
  margin: 0 0 2rem

.doc-h2
  font-size: 1.5rem
  line-height: 1.5rem
  padding: 0.5rem 0
  font-weight: 500
  border-bottom: 1px solid #ccc
  margin: 4rem 0 1.5rem

.none-a-tag
  color: inherit
  text-decoration: none
</style>
