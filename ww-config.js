export default {
    editor: {
        label: {
            en: 'Apexchart',
        },
        icon: 'chart-bar',
        customSettingsPropertiesOrder: [
            'dataType',
            // Advanced mode properties
            ['series', 'chartOptions'],
            // Guided mode properties
            'data',
            'dataError',
            'chartType',
            ['categoryField', 'valueField', 'seriesField'],
            'yAxisAnnotations', // <-- New property is placed here
            'dataLabels',
            'curve',
            'stacked',
            'isLegend',
            'legendPosition',
            'colors',
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
                tooltip: 'An array of series objects: `[{ name: "series-1", data: [30, 40, 45] }]`',
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
                tooltip: 'A collection of data in array format: `[{}, {}, ...]`',
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
        // ===================================
        // NEW PROPERTY FOR THRESHOLD LINES
        // ===================================
        yAxisAnnotations: {
            label: {
                en: 'Y-axis Threshold Lines',
            },
            type: 'Array',
            section: 'settings',
            options: {
                item: {
                    type: 'Object',
                    label: { en: 'Threshold Line' },
                    options: {
                        properties: {
                            value: {
                                label: { en: 'Value' },
                                type: 'Number',
                                required: true,
                            },
                            label: {
                                label: { en: 'Label' },
                                type: 'Text',
                            },
                            color: {
                                label: { en: 'Color' },
                                type: 'Color',
                            },
                        },
                    },
                },
            },
            defaultValue: [],
            hidden: content => content.dataType !== 'guided',
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
            options: {
                item: { type: 'Color' },
            },
            defaultValue: [],
            hidden: content => content.dataType !== 'guided',
        },
    },
};