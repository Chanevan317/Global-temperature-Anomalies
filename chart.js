document.addEventListener('DOMContentLoaded', () => {
    let annualChart, monthlyChart;
    let allData = {}; // Store all year's monthly data

    fetch('data/global_temp.csv')
    .then(response => response.text())
    .then(csv => {
        const rows = csv.trim().split('\n');
        const header = rows[0].split(',');
        const years = [];
        const annualAnomalies = [];

        // Process all rows
        for (let i = 1; i < rows.length; i++) {
            const cols = rows[i].split(',');
            const year = cols[0];
            years.push(year);
            
            // Store monthly data
            allData[year] = cols.slice(1, 13).map(Number);
            
            // Annual data
            annualAnomalies.push(parseFloat(cols[cols.length-1]));
        }

        // Create annual chart
        annualChart = new Chart(document.getElementById('annualChart'), {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: 'Annual Temperature Anomaly (°C)',
                    data: annualAnomalies,
                    borderColor: '#e74c3c',
                    tension: 0.3,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: 'Year' } },
                    y: { title: { display: true, text: 'Anomaly (°C)' } }
                }
            }
        });

        // Create monthly chart
        monthlyChart = new Chart(document.getElementById('monthlyChart'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Monthly Temperature Anomalies (°C)',
                    data: allData['1880'],
                    borderColor: '#3498db',
                    tension: 0.3,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { title: { display: true, text: 'Anomaly (°C)' } }
                }
            }
        });

        // Slider setup
        const slider = document.getElementById('yearSlider');
        const yearDisplay = document.getElementById('currentYear');
        const yearSpan = document.getElementById('selectedYear');
        yearSpan.textContent = slider.value;

        slider.addEventListener('input', (e) => {
            const year = e.target.value;
            yearDisplay.textContent = `Selected Year: ${year}`;
            yearSpan.textContent = year; // Update the title
            
            // Update monthly chart
            monthlyChart.data.datasets[0].data = allData[year];
            monthlyChart.update();
        });
    })
    .catch(error => console.error('Error loading data:', error));
});

