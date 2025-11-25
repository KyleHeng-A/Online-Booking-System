
const bookingModal = document.getElementById('bookingModal');
const openBookingForm = document.getElementById('openBookingForm');
const closeModal = document.getElementById('closeModal');
const bookingForm = document.getElementById('bookingForm');
const bookingList = document.getElementById('bookingList');
const facilitySelect = document.getElementById('facility');
const facilityLocation = document.getElementById('facilityLocation');
const startTimeSelect = document.getElementById('startTime');
const endTimeSelect = document.getElementById('endTime');

let bookings = [];
let facilities = [];
let slotsTemplate = [];

// Fetch Data.json
fetch('Data.json')
    .then(response => response.json())
    .then(data => {
        facilities = data.facilities;
        slotsTemplate = data.slotsTemplate;
        populateFacilities();
        populateStartTimes();
    });

// Populate facilities
function populateFacilities() {
    facilities.forEach(facility => {
        const option = document.createElement('option');
        option.value = facility.id;
        option.textContent = facility.name;
        facilitySelect.appendChild(option);
    });
}

// Show location when facility selected
facilitySelect.addEventListener('change', () => {
    const selected = facilities.find(f => f.id === facilitySelect.value);
    facilityLocation.textContent = selected ? `Location: ${selected.location}` : '';
});

// Populate start time
function populateStartTimes() {
    slotsTemplate.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        startTimeSelect.appendChild(option);
    });
}

// Update end time based on start time
startTimeSelect.addEventListener('change', () => {
    endTimeSelect.innerHTML = '<option value="">Select End Time</option>';
    const startIndex = slotsTemplate.indexOf(startTimeSelect.value);
    for (let i = startIndex + 1; i < slotsTemplate.length; i++) {
        const option = document.createElement('option');
        option.value = slotsTemplate[i];
        option.textContent = slotsTemplate[i];
        endTimeSelect.appendChild(option);
    }
});

// Open Modal
openBookingForm.addEventListener('click', () => bookingModal.style.display = 'flex');
closeModal.addEventListener('click', () => bookingModal.style.display = 'none');

// Submit Booking
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const facilityId = facilitySelect.value;
    const facility = facilities.find(f => f.id === facilityId);
    const date = document.getElementById('date').value;
    const startTime = startTimeSelect.value;
    const endTime = endTimeSelect.value;

    if (!startTime || !endTime) {
        alert('Please select valid start and end times.');
        return;
    }

    const newBooking = { facility: facility.name, location: facility.location, date, startTime, endTime };
    bookings.push(newBooking);
    renderBookings();
    bookingModal.style.display = 'none';
    bookingForm.reset();
    facilityLocation.textContent = '';
    alert('Booking confirmed!');
});

// Render Bookings
function renderBookings() {
    bookingList.innerHTML = '';
    bookings.sort((a, b) => new Date(a.date) - new Date(b.date));
    bookings.forEach((booking, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="booking-info">
                <strong>${booking.facility}</strong><br>
                Location: ${booking.location}<br>
                Date: ${booking.date} | Time: ${booking.startTime} - ${booking.endTime}
            </div>
            <div class="booking-actions">
                <button onclick="editBooking(${index})">Edit</button>
                <button onclick="cancelBooking(${index})">Cancel</button>
            </div>
        `;
        bookingList.appendChild(li);
    });
}

// Edit Booking
function editBooking(index) {
    const booking = bookings[index];
    const facilityObj = facilities.find(f => f.name === booking.facility);
    facilitySelect.value = facilityObj.id;
    facilityLocation.textContent = `Location: ${facilityObj.location}`;
    document.getElementById('date').value = booking.date;
    startTimeSelect.value = booking.startTime;
    startTimeSelect.dispatchEvent(new Event('change'));
    endTimeSelect.value = booking.endTime;
    bookingModal.style.display = 'flex';
    bookingForm.onsubmit = (e) => {
        e.preventDefault();
        bookings[index] = {
            facility: facilities.find(f => f.id === facilitySelect.value).name,
            location: facilities.find(f => f.id === facilitySelect.value).location,
            date: document.getElementById('date').value,
            startTime: startTimeSelect.value,
            endTime: endTimeSelect.value
        };
        renderBookings();
        bookingModal.style.display = 'none';
        bookingForm.reset();
        facilityLocation.textContent = '';
        alert('Booking updated!');
        bookingForm.onsubmit = defaultSubmit;
    };
}

// Cancel Booking
function cancelBooking(index) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        bookings.splice(index, 1);
        renderBookings();
        alert('Booking canceled!');
    }
}

function defaultSubmit(e) {
    e.preventDefault();
}
