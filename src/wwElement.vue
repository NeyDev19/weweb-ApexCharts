// wwElement.vue

// ... (template and other parts of script are the same) ...
    computed: {
        // ... (chartType and finalSeries are the same) ...

        finalChartOptions() {
            if (this.content.dataType === 'advanced') {
                return this.content.chartOptions || {};
            }

            const rawData = wwLib.wwUtils.getDataFromCollection(this.content.data);
            const categories = this.getGuidedCategories(rawData);
            const labels = this.getGuidedLabels(rawData);

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

            if (categories.length) {
                options.xaxis = { categories: categories };
            }
            if (labels.length) {
                options.labels = labels;
            }
            if (this.content.colors && this.content.colors.length) {
                options.colors = this.content.colors;
            }

            // ADDED THIS BLOCK TO HANDLE ANNOTATIONS
            if (Array.isArray(this.content.yAxisAnnotations) && this.content.yAxisAnnotations.length) {
                options.annotations = {
                    yaxis: this.content.yAxisAnnotations.map(line => ({
                        y: line.value,
                        borderColor: line.color || '#999999', // Default color if none is set
                        label: {
                            borderColor: line.color || '#999999',
                            style: {
                                color: '#fff',
                                background: line.color || '#999999',
                            },
                            text: line.label || '',
                        }
                    }))
                };
            }
            // END OF ADDED BLOCK

            return options;
        },
    },
// ... (methods are the same) ...