document.addEventListener('DOMContentLoaded', () => {
    const timeSelect = document.getElementById('time');
    const hours = [];
    for (let hour = 7; hour <= 23; hour += 0.5) {
        const hourStr = (hour % 1 === 0 ? hour + ':00' : Math.floor(hour) + ':30');
        const period = hour < 12 ? 'صبح' : 'عصر';
        hours.push(`${hourStr} ${period}`);
    }
    hours.forEach(hour => {
        const option = document.createElement('option');
        option.value = hour;
        option.textContent = hour;
        timeSelect.appendChild(option);
    });

    const ctx = document.getElementById('trainingChart').getContext('2d');

    const athleteData = []; // داده‌های نمونه برای تست

    const data = {
        labels: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
        datasets: [{
            label: 'ساعات تمرین',
            data: [0, 0, 0, 0, 0, 0, 0], // این داده‌ها باید به صورت پویا از پایگاه داده یا فرم‌ها اضافه شوند
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }]
    };

    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            const day = data.labels[tooltipItem.dataIndex];
                            const timeSlots = athleteData.filter(a => a.days.includes(day)).map(a => a.time).join(', ');
                            const names = athleteData.filter(a => a.days.includes(day)).map(a => a.name).join(', ');
                            return `ساعات: ${timeSlots} (${names})`;
                        }
                    }
                }
            }
        }
    };

    const myChart = new Chart(ctx, config);

    const form = document.getElementById('athleteForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const lastName = document.getElementById('lastName').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const birthdate = document.getElementById('birthdate').value;
        const gender = document.getElementById('gender').value;
        const time = document.getElementById('time').value;
        const days = Array.from(document.querySelectorAll('#days input:checked')).map(cb => cb.value);

        const list = document.getElementById('athleteList');
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${name}</td>
            <td>${lastName}</td>
            <td>${phone}</td>
            <td>${address}</td>
            <td>${birthdate}</td>
            <td>${gender}</td>
            <td>${days.join(', ')}</td>
            <td>${time}</td>
            <td>
                <button class="edit-btn">ویرایش</button>
                <button class="delete-btn">حذف</button>
            </td>
        `;
        list.appendChild(row);

        // ذخیره داده‌ها برای نمودار
        athleteData.push({ name, days, time });

        // به‌روزرسانی نمودار
        updateChart();

        // پاک کردن فرم
        form.reset();
    });

    function updateChart() {
        const dayCounts = { شنبه: 0, یکشنبه: 0, دوشنبه: 0, سه‌شنبه: 0, چهارشنبه: 0, پنج‌شنبه: 0, جمعه: 0 };
        athleteData.forEach(a => {
            a.days.forEach(day => dayCounts[day]++);
        });

        const data = myChart.data;
        data.datasets[0].data = Object.values(dayCounts);
        myChart.update();
    }
});
