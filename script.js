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

    // نمونه داده‌ها (این داده‌ها باید به صورت پویا از پایگاه داده یا فرم جمع‌آوری شوند)
    const data = {
        labels: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
        datasets: [
            {
                label: 'ساعات تمرین',
                data: [5, 3, 4, 2, 6, 1, 4], // تعداد ساعات تمرین برای هر روز
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }
        ]
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
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y + ' ساعت';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    new Chart(ctx, config);

    // فرم ثبت‌نام
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

        // پاک کردن فرم
        form.reset();
    });
});
