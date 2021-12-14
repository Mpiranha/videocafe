const ctx = document.getElementById('myChart');
const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [2000, 4000],
            backgroundColor: [
              '#59a9f7',
              '#9a14f0',
            ],
            borderColor: [
                '#59a9f7',
                '#9a14f0',
            ],
            hoverOffset: 4,
            spacing: 20,
          }]
    },
    options: {
        cutout: 60,
    }
});