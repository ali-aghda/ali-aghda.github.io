document.getElementById('athleteForm').addEventListener('submit', function(event) {
    event.preventDefault(); // جلوگیری از بارگذاری مجدد صفحه

    // دریافت اطلاعات فرم
    const name = document.getElementById('name').value;
    const lastName = document.getElementById('lastName').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const birthdate = document.getElementById('birthdate').value;
    const gender = document.getElementById('gender').value;
    const days = Array.from(document.querySelectorAll('#days input:checked')).map(input => input.value);
    const time = document.getElementById('time').value;

    // بررسی اینکه روزها و ساعت تمرین برای شاگرد دیگری انتخاب نشده باشد
    let athletes = JSON.parse(localStorage.getItem('athletes')) || [];
    for (let athlete of athletes) {
        if (athlete.time === time && days.some(day => athlete.days.includes(day))) {
            alert('این روزها و ساعت تمرین قبلاً توسط شاگرد دیگری انتخاب شده است.');
            return;
        }
    }

    // ایجاد یک آبجکت ورزشکار
    const athlete = { name, lastName, phone, address, birthdate, gender, days, time };

    // ذخیره ورزشکار در localStorage
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
            <td>${athlete.birthdate || '---'}</td>
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
    
    // تنظیم چک‌باکس‌ها برای روزهای تمرین
    const checkboxes = document.querySelectorAll('#days input');
    checkboxes.forEach(checkbox => {
        checkbox.checked = athlete.days.includes(checkbox.value);
    });
    
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

// نمایش اولیه ورزشکاران
displayAthletes();
