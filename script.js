document.addEventListener('DOMContentLoaded', function() {
    populateTimeOptions();

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

        // بررسی تداخل ساعت
        let athletes = JSON.parse(localStorage.getItem('athletes')) || [];
        let conflict = false;
        let conflictNames = [];

        for (let athlete of athletes) {
            if (athlete.time === time && days.some(day => athlete.days.includes(day))) {
                conflict = true;
                conflictNames.push(`${athlete.name} ${athlete.lastName}`);
            }
        }

        if (conflict) {
            alert(`این ساعت تمرین با ساعت‌های زیر تداخل دارد:\n${conflictNames.join(', ')}`);
            return;
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

    function populateTimeOptions() {
        const timeSelect = document.getElementById('time');
        const startHour = 7;
        const endHour = 23;
        const intervals = 30; // نیم ساعت
        const amPm = ['صبح', 'عصر'];

        for (let hour = startHour; hour <= endHour; hour++) {
            for (let minute = 0; minute < 60; minute += intervals) {
                let hourDisplay = hour % 12 || 12;
                let amPmDisplay = hour < 12 ? amPm[0] : amPm[1];
                let timeOption = `${hourDisplay}:${minute.toString().padStart(2, '0')} ${amPmDisplay}`;
                let value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

                let option = document.createElement('option');
                option.value = value;
                option.textContent = timeOption;
                timeSelect.appendChild(option);
            }
        }
    }

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
                    <button class="edit-btn" onclick="editAthlete(${index})">ویرایش</button>
                    <button class="delete-btn" onclick="deleteAthlete(${index})">حذف</button>
                </td>
            `;
            athleteList.appendChild(tr);
        });
    }

    window.editAthlete = function(index) {
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

    window.deleteAthlete = function(index) {
        const athletes = JSON.parse(localStorage.getItem('athletes')) || [];
        athletes.splice(index, 1);
        localStorage.setItem('athletes', JSON.stringify(athletes));
        displayAthletes();
    }

    // نمایش اولیه ورزشکاران
    displayAthletes();
});
