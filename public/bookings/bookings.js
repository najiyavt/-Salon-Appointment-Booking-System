const token = localStorage.getItem('token')
const bookingForm = document.getElementById('bookingForm');


document.addEventListener("DOMContentLoaded" , () => {
    loadUserAppointments();
    loadServices(); 
    loadStaff()
});

bookingForm.addEventListener('submit' , async(event) => {
    event.preventDefault();

    const serviceId = bookingForm.service.value;
    const date = bookingForm.date.value;
    const time = bookingForm.time.value;
    const dateTime = `${date}T${time}`;
    const staffId = bookingForm.staff.value

    try{
        const response = await axios.post(`http://localhost:3000/appointments/book-appointment` , { serviceId , dateTime , staffId} , {headers: { 'Authorization': token }});
        alert('Booking succefull');
        bookingForm.reset();
        loadUserAppointments();
    } catch (error) {
        console.error('Error booking appointment:', error);
        alert('Booking failed. Please try again.');
    }
});


async function loadUserAppointments() {
    try {
        const appointmentsContainer = document.getElementById('appointments');
        const response = await axios.get(`http://localhost:3000/appointments/user-appointment`, { headers: { 'Authorization': token } });
        const appointments = response.data;
        appointmentsContainer.innerHTML = '';
        
        appointments.forEach(appointment => {
            const serviceName = appointment.service?.name || 'Service Not Found';
            const staffName = appointment.staff?.username || 'Staff Not Found'; // Assuming staff object contains 'username'

            const appointmentDiv = document.createElement('div');
            appointmentDiv.classList.add('appointment');
            appointmentDiv.innerHTML = `
                <h3>${serviceName}</h3>
                <p>Date: ${new Date(appointment.dateTime).toLocaleDateString()}</p>
                <p>Time: ${new Date(appointment.dateTime).toLocaleTimeString()}</p>
                <p>Status: ${appointment.status}</p>
                <p>Staff: ${staffName}</p>
                <button onclick="cancelAppointment(${appointment.id})">Cancel Appointment</button>
            `;
            appointmentsContainer.appendChild(appointmentDiv);
        });
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}


async function loadServices(){
    try{
        const response = await axios.get(`http://localhost:3000/services/get-service`, { headers: { 'Authorization': token } });
        const services =  response.data;
        const serviceSelect = document.getElementById('service');
        serviceSelect.innerHTML='';
        services.forEach(service => {
            const option = document.createElement('option');
            option.value=service.id;
            option.textContent= service.name;
            serviceSelect.appendChild(option)
        })
    }catch (error) {
        console.error('Error loadin appointment:', error);
    }
}

async function loadStaff(){
    try{
        const response = await axios.get(`http://localhost:3000/services/get-staff`,{ headers: { 'Authorization': token } });
        const staff = response.data.staffs;
        const staffSelect = document.getElementById('staff');
        staffSelect.innerHTML='';

        staff.forEach(staffMember => {
            const option = document.createElement('option');
            option.value=staffMember.id;
            option.textContent= staffMember.username;
            staffSelect.appendChild(option);
        })
    } catch (error) {
        console.error('Error loading staff:', error);
    }
}

async function cancelAppointment(id){
    try{
        const response = await axios.put(`http://localhost:3000/appointments/cancel-appointment/${id}` ,{},{headers: { 'Authorization': token }}); 
        alert('Appointment canceled successfully!');
        loadUserAppointments()
    } catch (error) {
        console.error('Error booking appointment:', error);
        alert('Booking failed. Please try again.');
    }
}
   