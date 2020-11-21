// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['br-sp', 622000],
    ['br-ma', 80000],
    ['br-pa', 210000],
    ['br-sc', 270000],
    ['br-ba', 31500],
    ['br-ap', 50000],
    ['br-ms', 90000],
    ['br-mg', 320000],
    ['br-go', 18000],
    ['br-rs', 200000],
    ['br-to', 89000],
    ['br-pi', 90000],
    ['br-al', 87000],
    ['br-pb', 92000],
    ['br-ce', 280000],
    ['br-se', 71000],
    ['br-rr', 79000],
    ['br-pe', 250000],
    ['br-pr', 230000],
    ['br-es', 198000],
    ['br-rj', 415000],
    ['br-rn', 95000],
    ['br-am', 160000],
    ['br-mt', 170000],
    ['br-df', 98000],
    ['br-ac', 60000],
    ['br-ro', 30000]
];

// Create the chart
Highcharts.mapChart('container-mapa-brasil', {
    chart: {
        map: 'countries/br/br-all'
    },

    title: {
        text: 'Dívidas por UF'
    },

    mapNavigation: {
        enabled: true,
        buttonOptions: {
            verticalAlign: 'bottom'
        }
    },

    colorAxis: {
        min: 0
    },

    series: [{
        data: data,
        name: 'Random data',
        states: {
            hover: {
                color: '#dc3545'
            }
        },
        dataLabels: {
            enabled: true,
            format: '{point.name}'
        }
    }]
});