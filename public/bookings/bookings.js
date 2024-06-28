const token = localStorage.getItem('token')
const bookingForm = document.getElementById('bookingForm');

document.addEventListener("DOMContentLoaded" , () => {
    loadUserAppointments();
    loadServices(); 
});


bookingForm.addEventListener('submit' , async(event) => {
    event.preventDefault();

    const serviceId = bookingForm.service.value;
    const date = bookingForm.date.value;
    const time = bookingForm.time.value;
    const dateTime = `${date}T${time}`;

    try{
        const response = await axios.post(`http://localhost:3000/appointments/book-appointment` , { serviceId , dateTime} , {headers: { 'Authorization': token }});
        console.log('Booking succesfull' , response.data);
        alert('Booking succefull');
        bookingForm.reset();
        loadUserAppointments()
    } catch (error) {
        console.error('Error booking appointment:', error);
        alert('Booking failed. Please try again.');
    }
});


async function loadUserAppointments(){
    try{
        const appointmentsContainer = document.getElementById('appointments');
        const response = await axios.get(`http://localhost:3000/appointments/user-appointment` ,{headers: { 'Authorization': token }}); 
        const appointments = response.data;
        console.log('User appointments' , appointments);
        appointmentsContainer.innerHTML = '';
        appointments.forEach(appointment => {
            console.log('Current appointment:', appointment); 
            if (!appointment.Service) {
                console.warn(`Service is undefined for appointment ID ${appointment.id}`);
            }
            if (!appointment.staff) {
                console.warn(`Staff is undefined for appointment ID ${appointment.id}`);
            }
            const appointmentDiv = document.createElement('div');
            appointmentDiv.classList.add('appointment');
            const serviceName = appointment.Service?.name || 'Service Not Found';
            const staffName = appointment.staff?.username || 'Staff Not Found';
            appointmentDiv.innerHTML =`
                    <h3>${appointment.Service.name}</h3>
                        <p>Date: ${new Date(appointment.dateTime).toLocaleDateString()}</p>
                        <p>Time: ${new Date(appointment.dateTime).toLocaleTimeString()}</p>
                        <p>Staff: ${appointment.staff.username}</p>
                        <p>Status: ${appointment.status}</p>
                        <button onclick="cancelAppointment(${appointment.id})">Cancel Appointment</button>)">Cancel Appointment</button>
                    `;
                    appointmentsContainer.appendChild(appointmentDiv);
        });
    } catch (error) {
        console.error('Error booking appointment:', error);
        alert('Booking failed. Please try again.');
    }
}

async function loadServices(){
    try{
        const response = await axios.get(`http://localhost:3000/services/get-service`, { headers: { 'Authorization': token } });
        const services =  response.data;
        console.log('service fetched successfully!', services);
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
        alert('Failed to load service. Please try again.');
    }
}

async function cancelAppointments(id){
    try{
        const response = await axios.put(`http://localhost:3000/appointments/cancel-appointment/${id}` ,{},{headers: { 'Authorization': token }}); 
        console.log('Appointment canceled successfully!' , response.data);
        alert('Appointment canceled successfully!');
        loadUserAppointments()
    } catch (error) {
        console.error('Error booking appointment:', error);
        alert('Booking failed. Please try again.');
    }
}
   