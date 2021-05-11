<template>
  <div v-if="setData">
    <q-card class="bg-white full-width">
      <q-card-section>
        <canvas id="line-chart"></canvas>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import axios from "axios"
import Chart from 'chart.js'

export default {
  data () {
    return {
      apiUrl : process.env.VUE_APP_ROOT_API,
      labels: [],
      total: [],
      sns: [],
      article: [],
      community: [],
      setData: false
    }
  },
  mounted () {
    this.createChart('line-chart')
  },
  methods: {
    async createChart (chartId) {
      this.setData = false
      await axios.get(this.apiUrl + '/word/count')
      .then(response => {
        this.labels = response.data.message.date
        this.total = response.data.message.total
        this.sns = response.data.message.sns
        this.article = response.data.message.article
        this.community = response.data.message.community
        this.setData = true
      })

      const ctx = document.getElementById(chartId)
      const wordLineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [{
            data: this.total,
            label: 'Total',
            borderColor: '#8e5ea2',
            fill: false,
            lineTension: 0
          },
          {
            data: this.sns,
            label: 'SNS',
            borderColor: '#3cba9f',
            fill: false,
            lineTension: 0
          },
          {
            data: this.article,
            label: 'Article',
            borderColor: '#e8c3b9',
            fill: false,
            lineTension: 0
          },
          {
            data: this.community,
            label: 'Community',
            borderColor: '#c45850',
            fill: false,
            lineTension: 0
          }]
        },
        options: {
          legend: {
            display: true
          },
          title: {
            display: true,
            text: '일별 수집한 단어의 수'
          }
        }
      })
      return wordLineChart
    }
  }
}
</script>

<style lang="sass" scoped>
</style>
