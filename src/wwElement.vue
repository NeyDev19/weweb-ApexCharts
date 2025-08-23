<template>
  <div class="apexchart-element">
    <apexchart
      ref="chart"
      width="100%"
      height="100%"
      :type="chartType"
      :options="finalChartOptions"
      :series="finalSeries"
    ></apexchart>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';

export default {
  components: {
    apexchart: VueApexCharts,
  },
  props: {
    content: {
      type: Object,
      required: true
    },
    /* wwEditor:start */
    wwEditorState: {
      type: Object,
      required: true
    },
    /* wwEditor:end */
  },
  emits: ['trigger-event'],
  computed: {
    chartType() {
      if (this.content.dataType === 'advanced') {
        return this.content.chartOptions?.chart?.type || 'line';
      }
      return this.content.chartType || 'line';
    },
    finalSeries() {
      if (this.content.dataType === 'advanced') {
        return Array.isArray(this.content.series) ? this.content.series : [];
      }

      const rawData = wwLib.wwUtils.getDataFromCollection(this.content.data);

      if (!Array.isArray(rawData) || rawData.length === 0) {
        // Return a valid empty series structure
        if (['pie', 'donut', 'radialBar'].includes(this.chartType)) {
          return [];
        }
        return [{ data: [] }];
      }

      const valueField = this.content.valueField;
      const seriesField = this.content.seriesField;

      if (['pie', 'donut', 'radialBar'].includes(this.chartType)) {
        return rawData.map(item => _.get(item, valueField, 0));
      }

      if (!seriesField) {
        return [{
          name: valueField || 'Value',
          data: rawData.map(item => _.get(item, valueField, 0))
        }];
      } else {
        const grouped = _.groupBy(rawData, seriesField);
        return Object.keys(grouped).map(seriesName => ({
          name: seriesName,
          data: grouped[seriesName].map(item => _.get(item, valueField, 0)),
        }));
      }
    },
    finalChartOptions() {
      if (this.content.dataType === 'advanced') {
        return this.content.chartOptions || {};
      }

      const rawData = wwLib.wwUtils.getDataFromCollection(this.content.data);
      const categories = this.getGuidedCategories(rawData);
      const labels = this.getGuidedLabels(rawData);

      // Build the options object conditionally to avoid passing undefined
      const options = {
        chart: {
          type: this.chartType,
          stacked: this.content.stacked || false,
          events: {
            dataPointSelection: (event, chartContext, config) => {
              this.handleDataPointClick(config);
            },
          },
          toolbar: {
            show: false
          }
        },
        dataLabels: {
          enabled: this.content.dataLabels,
        },
        stroke: {
          curve: this.content.curve || 'smooth',
        },
        legend: {
          show: this.content.isLegend,
          position: this.content.legendPosition,
        },
      };

      // Only add properties if they have valid data
      if (categories.length) {
        options.xaxis = { categories: categories };
      }

      if (labels.length) {
        options.labels = labels;
      }

      if (this.content.colors && this.content.colors.length) {
        options.colors = this.content.colors;
      }

      // Add support lines (annotations)
      if (this.shouldShowSupportLines() && (this.content.showMinLine || this.content.showMaxLine)) {
        options.annotations = this.getSupportLineAnnotations(rawData);
      }

      return options;
    },
  },
  methods: {
    getGuidedCategories(data) {
      // Return an empty array instead of undefined
      if (!Array.isArray(data) || !data.length || ['pie', 'donut', 'radialBar'].includes(this.chartType)) {
        return [];
      }

      const categoryField = this.content.categoryField;
      if (!categoryField) return [];

      return _.uniq(data.map(item => _.get(item, categoryField)));
    },
    getGuidedLabels(data) {
      // Return an empty array and use categoryField for labels
      if (!Array.isArray(data) || !data.length || !['pie', 'donut', 'radialBar'].includes(this.chartType)) {
        return [];
      }

      const categoryField = this.content.categoryField;
      if (!categoryField) return [];

      return data.map(item => _.get(item, categoryField));
    },
    shouldShowSupportLines() {
      // Support lines only make sense for certain chart types
      return ['line', 'bar', 'area', 'radar'].includes(this.chartType);
    },
    getSupportLineAnnotations(rawData) {
      if (!Array.isArray(rawData) || rawData.length === 0 || !this.content.valueField) {
        return { yaxis: [] };
      }

      const values = rawData.map(item => _.get(item, this.content.valueField, 0));
      const minValue = Math.min(...values);
      const maxValue = Math.max(...values);
      
      const annotations = [];

      // Add minimum line
      if (this.content.showMinLine) {
        annotations.push({
          y: this.content.customMinValue !== undefined ? this.content.customMinValue : minValue,
          borderColor: this.content.minLineColor || '#FF4560',
          borderWidth: this.content.minLineWidth || 2,
          strokeDashArray: this.content.minLineDashed ? 5 : 0,
          label: {
            text: this.content.minLineLabel || `Min: ${this.content.customMinValue !== undefined ? this.content.customMinValue : minValue}`,
            style: {
              color: this.content.minLineColor || '#FF4560',
              background: '#fff',
              fontSize: '12px',
              padding: {
                left: 5,
                right: 5,
                top: 2,
                bottom: 2,
              }
            },
            position: this.content.minLineLabelPosition || 'right'
          }
        });
      }

      // Add maximum line
      if (this.content.showMaxLine) {
        annotations.push({
          y: this.content.customMaxValue !== undefined ? this.content.customMaxValue : maxValue,
          borderColor: this.content.maxLineColor || '#00E396',
          borderWidth: this.content.maxLineWidth || 2,
          strokeDashArray: this.content.maxLineDashed ? 5 : 0,
          label: {
            text: this.content.maxLineLabel || `Max: ${this.content.customMaxValue !== undefined ? this.content.customMaxValue : maxValue}`,
            style: {
              color: this.content.maxLineColor || '#00E396',
              background: '#fff',
              fontSize: '12px',
              padding: {
                left: 5,
                right: 5,
                top: 2,
                bottom: 2,
              }
            },
            position: this.content.maxLineLabelPosition || 'right'
          }
        });
      }

      return { yaxis: annotations };
    },
    handleDataPointClick(config) {
      const { seriesIndex, dataPointIndex } = config;
      const series = this.finalSeries[seriesIndex];
      let value, category, seriesName;

      if (series) {
        seriesName = series.name;
        value = Array.isArray(series.data) ? series.data[dataPointIndex] : this.finalSeries[dataPointIndex];
      }

      const categories = this.finalChartOptions.xaxis?.categories;
      if (Array.isArray(categories)) {
        category = categories[dataPointIndex];
      } else {
        const labels = this.finalChartOptions.labels;
        category = Array.isArray(labels) ? labels[dataPointIndex] : '';
      }

      this.$emit('trigger-event', {
        name: 'dataPointClick',
        event: {
          seriesIndex,
          dataPointIndex,
          value,
          category,
          seriesName,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.apexchart-element {
  width: 100%;
  height: 100%;
}
</style>