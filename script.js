document.getElementById('athleteForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // دریافت اطلاعات فرم
    const name = document.getElementById('name').value;
    const lastName = document.getElementById('lastName').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const birthdate = document.getElementById('birthdate').value;
    const gender = document.getElementById('gender').value;
    const days = Array.from(document.getElementById('days').selectedOptions).map(option => option.value);
    const time = document.getElementById('time').value;

    // ایجاد یک آبجکت ورزشکار
    const athlete = { name, lastName, phone, address, birthdate, gender, days, time };

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

    // فیلتر کردن بر اساس جستجو
    athletes = athletes.filter(athlete => {
        return Object.values(athlete).some(value => value.toString().includes(search));
    });

    athletes.forEach((athlete, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${athlete.name}</td>
            <td>${athlete.lastName}</td>
            <td>${athlete.phone}</td>
            <td>${athlete.address}</td>
            <td>${athlete.birthdate}</td>
            <td>${athlete.gender}</td>
            <td>${athlete.days.join(', ')}</td>
            <td>${athlete.time}</td>
            <td>
                <button onclick="editAthlete(${index})">ویرایش</button>
                <button onclick="deleteAthlete(${index})">حذف</button>
            </td>
        `;
        athleteList.appendChild(tr);
    });
}

function editAthlete(index) {
    const athletes = JSON.parse(localStorage.getItem('athletes')) || [];
    const athlete = athletes[index];
    
    document.getElementById('name').value = athlete.name;
    document.getElementById('lastName').value = athlete.lastName;
    document.getElementById('phone').value = athlete.phone;
    document.getElementById('address').value = athlete.address;
    document.getElementById('birthdate').value = athlete.birthdate;
    document.getElementById('gender').value = athlete.gender;
    
    document.getElementById('days').value = athlete.days;
    document.getElementById('time').value = athlete.time;

    // حذف ورزشکار از لیست و نمایش مجدد
    athletes.splice(index, 1);
    localStorage.setItem('athletes', JSON.stringify(athletes));
    displayAthletes();
}

function deleteAthlete(index) {
    const athletes = JSON.parse(localStorage.getItem('athletes')) || [];
    athletes.splice(index, 1);
    localStorage.setItem('athletes', JSON.stringify(athletes));
    displayAthletes();
}

// نمایش ورزشکاران در بارگذاری صفحه
displayAthletes();
