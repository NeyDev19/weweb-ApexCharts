// ww-config.js

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
            'yAxisAnnotations', // <-- ADDED THIS
            'dataLabels',
            'curve',
            'stacked',
            'isLegend',
            'legendPosition',
            'colors',
        ],
    },
    // ... (triggerEvents and other properties remain the same) ...
    properties: {
        // ... (all previous properties from dataType to seriesField) ...
        
        // NEW PROPERTY ADDED HERE
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

        // ... (rest of the properties from dataLabels onwards) ...
    },
};