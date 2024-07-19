document.getElementById('athleteForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // دریافت اطلاعات فرم
    const name = document.getElementById('name').value;
    const days = Array.from(document.getElementById('days').selectedOptions).map(option => option.value);
    const time = document.getElementById('time').value;

    // ایجاد یک آبجکت ورزشکار
    const athlete = { name, days, time };

    // ذخیره ورزشکار در localStorage
    let athletes = JSON.parse(localStorage.getItem('athletes')) || [];
    athletes.push(athlete);
    localStorage.setItem('athletes', JSON.stringify(athletes));

    // نمایش ورزشکاران
    displayAthletes();

    // پاک کردن فرم
    document.getElementById('athleteForm').reset();
});

document.getElementById('search').addEventListener('input', function() {
    displayAthletes(this.value);
});

function displayAthletes(search = '') {
    const athleteList = document.getElementById('athleteList');
    athleteList.innerHTML = '';

    let athletes = JSON.parse(localStorage.getItem('athletes')) || [];
    athletes = athletes.filter(athlete => athlete.name.includes(search));

    athletes.forEach(athlete => {
        const li = document.createElement('li');
        li.textContent = `نام: ${athlete.name} - روزهای تمرین: ${athlete.days.join(', ')} - ساعت تمرین: ${athlete.time}`;
        athleteList.appendChild(li);
    });
}

// نمایش ورزشکاران در بارگذاری صفحه
displayAthletes();
