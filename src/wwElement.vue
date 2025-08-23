export default {
  editor: {
    label: {
      en: 'Apexchart',
    },
    icon: 'chart-bar',
    customSettingsPropertiesOrder: [
      'dataType',
      ['series', 'chartOptions'],
      'data',
      'dataError',
      'chartType',
      ['categoryField', 'valueField', 'seriesField'],
      'dataLabels',
      'curve',
      'stacked',
      'isLegend',
      'legendPosition',
      'colors',
      // Y-axis scaling
      'yAxisStartFromZero',
      // Support Lines section
      'supportLinesSection',
      'showMinLine',
      ['customMinValue', 'minLineColor', 'minLineWidth', 'minLineDashed', 'minLineLabel', 'minLineLabelPosition'],
      'showMaxLine',
      ['customMaxValue', 'maxLineColor', 'maxLineWidth', 'maxLineDashed', 'maxLineLabel', 'maxLineLabelPosition'],
    ],
  },
  triggerEvents: [
    {
      name: 'dataPointClick',
      label: { en: 'On data point click' },
      event: {
        seriesIndex: 0,
        dataPointIndex: 0,
        value: null,
        category: '',
        seriesName: ''
      },
      default: true,
    },
  ],
  properties: {
    dataType: {
      label: 'Mode',
      type: 'TextSelect',
      options: {
        options: [
          { value: 'guided', label: 'Guided' },
          { value: 'advanced', label: 'Advanced' },
        ],
      },
      section: 'settings',
      defaultValue: 'guided',
    },

    // ADVANCED MODE PROPERTIES
    series: {
      label: 'Series',
      type: 'Info',
      options: { text: 'Chart Series' },
      section: 'settings',
      bindable: 'list',
      defaultValue: [{ name: 'My Series', data: [10, 41, 35, 51, 49, 62, 69] }],
      hidden: content => content.dataType !== 'advanced',
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'An array of series objects: [{ name: "series-1", data: [30, 40, 45] }]',
      },
      /* wwEditor:end */
    },
    chartOptions: {
      label: 'Chart Options',
      type: 'Info',
      options: { text: 'Chart Options' },
      section: 'settings',
      bindable: 'list',
      defaultValue: {
        chart: { type: 'line' },
        xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
      },
      hidden: content => content.dataType !== 'advanced',
      /* wwEditor:start */
      bindingValidation: {
        type: 'object',
        tooltip: 'A full ApexCharts options object.',
      },
      /* wwEditor:end */
    },

    // GUIDED MODE PROPERTIES
    data: {
      label: 'Data',
      type: 'Info',
      options: { text: 'Bind collection data' },
      section: 'settings',
      bindable: 'list',
      defaultValue: null,
      hidden: content => content.dataType !== 'guided',
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'A collection of data in array format: [{}, {}, ...]',
      },
      /* wwEditor:end */
    },
    dataError: {
      type: 'Info',
      options: { text: '⚠️ Invalid value. Data must be an array of objects.' },
      section: 'settings',
      hidden: content => {
        if (content.dataType !== 'guided' || !content.data) return true;
        const data = (!content.data || Array.isArray(content.data) ? content.data : content.data.data) || null;
        return Array.isArray(data);
      },
    },
    chartType: {
      label: 'Chart type',
      type: 'TextSelect',
      options: {
        options: [
          { value: 'line', label: 'Line' },
          { value: 'bar', label: 'Bar' },
          { value: 'area', label: 'Area' },
          { value: 'pie', label: 'Pie' },
          { value: 'donut', label: 'Donut' },
          { value: 'radialBar', label: 'Radial Bar' },
          { value: 'radar', label: 'Radar' },
        ],
      },
      section: 'settings',
      defaultValue: 'bar',
      hidden: content => content.dataType !== 'guided',
    },
    categoryField: {
      label: 'Category field (X-axis)',
      type: 'ObjectPropertyPath',
      options: content => {
        const data = (!content.data || Array.isArray(content.data) ? content.data : content.data.data) || [];
        if (!Array.isArray(data) || !data[0]) return null;
        return { object: data[0] };
      },
      section: 'settings',
      hidden: content => content.dataType !== 'guided' || ['pie', 'donut', 'radialBar'].includes(content.chartType),
    },
    valueField: {
      label: 'Value field (Y-axis)',
      type: 'ObjectPropertyPath',
      options: content => {
        const data = (!content.data || Array.isArray(content.data) ? content.data : content.data.data) || [];
        if (!Array.isArray(data) || !data[0]) return null;
        return { object: data[0] };
      },
      section: 'settings',
      hidden: content => content.dataType !== 'guided',
    },
    seriesField: {
      label: 'Group by (series)',
      type: 'ObjectPropertyPath',
      options: content => {
        const data = (!content.data || Array.isArray(content.data) ? content.data : content.data.data) || [];
        if (!Array.isArray(data) || !data[0]) return null;
        return { object: data[0] };
      },
      section: 'settings',
      hidden: content => content.dataType !== 'guided' || ['pie', 'donut', 'radialBar'].includes(content.chartType),
    },
    dataLabels: {
      label: 'Data labels',
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      hidden: content => content.dataType !== 'guided',
    },
    isLegend: {
      label: 'Legend',
      type: 'OnOff',
      section: 'settings',
      defaultValue: true,
      hidden: content => content.dataType !== 'guided',
    },
    legendPosition: {
      label: 'Legend Position',
      type: 'TextSelect',
      options: {
        options: [
          { value: 'top', label: 'Top' },
          { value: 'right', label: 'Right' },
          { value: 'bottom', label: 'Bottom' },
          { value: 'left', label: 'Left' },
        ],
      },
      defaultValue: 'bottom',
      section: 'settings',
      hidden: content => content.dataType !== 'guided' || !content.isLegend,
    },
    stacked: {
      label: 'Stacked',
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      hidden: content => content.dataType !== 'guided' || !['bar', 'area'].includes(content.chartType),
    },
    curve: {
      label: 'Curve',
      type: 'TextSelect',
      options: {
        options: [
          { value: 'smooth', label: 'Smooth' },
          { value: 'straight', label: 'Straight' },
          { value: 'stepline', label: 'Stepline' },
        ],
      },
      section: 'settings',
      defaultValue: 'smooth',
      hidden: content => content.dataType !== 'guided' || !['line', 'area'].includes(content.chartType),
    },
    colors: {
      label: 'Colors',
      type: 'Array',
      section: 'settings',
      options: { item: { type: 'Color' } },
      defaultValue: [],
      hidden: content => content.dataType !== 'guided',
    },

    // Y-AXIS SCALING
    yAxisStartFromZero: {
      label: 'Y-axis starts from zero',
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      hidden: content => content.dataType !== 'guided' || ['pie', 'donut', 'radialBar'].includes(content.chartType),
    },

    // SUPPORT LINES SECTION
    supportLinesSection: {
      type: 'Info',
      options: { text: 'Support Lines' },
      section: 'settings',
      hidden: content => content.dataType !== 'guided' || !['line', 'bar', 'area', 'radar'].includes(content.chartType),
    },

    // MIN LINE PROPERTIES
    showMinLine: {
      label: 'Show minimum line',
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      hidden: content => content.dataType !== 'guided' || !['line', 'bar', 'area', 'radar'].includes(content.chartType),
    },
    customMinValue: {
      label: 'Custom min value',
      type: 'Number',
      section: 'settings',
      bindable: true,
      hidden: content => content.dataType !== 'guided' || !content.showMinLine || !['line', 'bar', 'area', 'radar'].includes(content.chartType),
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'Custom minimum value for the support line. If not set, uses data minimum.',
      },
      /* wwEditor:end */
    },
    minLineColor: {
      label: 'Min line color',
      type: 'Color',
      section: 'settings',
      defaultValue: '#FF4560',
      hidden: content => content.dataType !== 'guided' || !content.showMinLine || !['line', 'bar', 'area', 'radar'].includes(content.chartType),
    },
    minLineWidth: {
      label: 'Min line width',
      type: 'Number',
      section: 'settings',
      defaultValue: 2,
      options: { min: 1, max: 10 },
      hidden: content => content.dataType !== 'guided' || !content.showMinLine || !['line', 'bar', 'area', 'radar'].includes(content.chartType),
    },
    minLineDashed: {
      label: 'Min line dashed',
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      hidden: content => content.dataType !== 'guided' || !content.showMinLine || !['line', 'bar', 'area', 'radar'].includes(content.chartType),
    },
    minLineLabel: {
      label: 'Min line label',
      type: 'Text',
      section: 'settings',
      bindable: true,
      hidden: content => content.dataType !== 'guided' || !content.showMinLine || !['line', 'bar', 'area', 'radar'].includes(content.chartType),
    },
    minLineLabelPosition: {
      label: 'Min line label position',
      type: 'TextSelect',
      options: {
        options: [
          { value: 'left', label: 'Left' },
          { value: 'right', label: 'Right' },
        ],
      },
      section: 'settings',
      defaultValue: 'right',
      hidden: content => content.dataType !== 'guided' || !content.showMinLine || !['line', 'bar', 'area', 'radar'].includes(content.chartType),
    },

    // MAX LINE PROPERTIES
    showMaxLine: {
      label: 'Show maximum line',
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      hidden: content => content.dataType !== 'guided' || !['line', 'bar', 'area', 'radar'].includes(content.chartType),
    },
    customMaxValue: {
      label: 'Custom max value',
      type: 'Number',
      section: 'settings',
      bindable: true,
      hidden: content => content.dataType !== 'guided' || !content.showMaxLine || !['line', 'bar', 'area', 'radar'].includes(content.chartType),
      /* wwEditor:start */
      bindingValidation: {
        type: 'number',
        tooltip: 'Custom maximum value for the support line. If not set, uses data maximum.',
      },
      /* wwEditor:end */
    },
    maxLineColor: {
      label: 'Max line color',
      type: 'Color',
      section: 'settings',
      defaultValue: '#00E396',
      hidden: content => content.dataType !== 'guided' || !content.showMaxLine || !['line', 'bar', 'area', 'radar'].includes(content.chartType),
    },
    maxLineWidth: {
      label: 'Max line width',
      type: 'Number',
      section: 'settings',
      defaultValue: 2,
      options: { min: 1, max: 10 },
      hidden: content => content.dataType !== 'guided' || !content.showMaxLine || !['line', 'bar', 'area', 'radar'].includes(content.chartType),
    },
    maxLineDashed: {
      label: 'Max line dashed',
      type: 'OnOff',
      section: 'settings',
      defaultValue: false,
      hidden: content => content.dataType !== 'guided' || !content.showMaxLine || !['line', 'bar', 'area', 'radar'].includes(content.chartType),
    },
    maxLineLabel: {
      label: 'Max line label',
      type: 'Text',
      section: 'settings',
      bindable: true,
      hidden: content => content.dataType !== 'guided' || !content.showMaxLine || !['line', 'bar', 'area', 'radar'].includes(content.chartType),
    },
    maxLineLabelPosition: {
      label: 'Max line label position',
      type: 'TextSelect',
      options: {
        options: [
          { value: 'left', label: 'Left' },
          { value: 'right', label: 'Right' },
        ],
      },
      section: 'settings',
      defaultValue: 'right',
      hidden: content => content.dataType !== 'guided' || !content.showMaxLine || !['line', 'bar', 'area', 'radar'].includes(content.chartType),
    },
  },
};