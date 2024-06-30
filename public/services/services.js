const token = localStorage.getItem('token');
const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('newAppointment', (appointment) => {
    console.log('New appointment received:', appointment);
    addAppointmentToDOM(appointment);
});


document.addEventListener("DOMContentLoaded" , () => {
    handleServiceCreation();
    fetchAllAppointments();
    fetchServices()
});

async function fetchServices(){
    try{
        const resposne= await axios.get(`http://localhost:3000/services/get-service` , {headers: { 'Authorization': token }} );
        const services = resposne.data;
        const existingServicesContainer = document.getElementById('existingServices');

        services.forEach(service => {
                const serviceDiv = document.createElement('div');
                serviceDiv.classList.add('service');
                serviceDiv.innerHTML = ` <h3>${service.name}</h3>
                                     <p>${service.description}</p>
                                     <p>Duration: ${service.duration} minutes</p>
                                     <p>Price: $${service.price}</p>`;
                existingServicesContainer.appendChild(serviceDiv);
        });
    } catch (error) {
        console.error('Failed to fetch services:', error);
    }
};

function handleServiceCreation (){
    const serviceForm = document.getElementById('serviceForm');
    serviceForm.addEventListener('submit' , async(event) => {
        event.preventDefault();
        const formData = new FormData(serviceForm);
        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
            duration: formData.get('duration'),
            price: formData.get('price'),
        };
        try{
            const response = await axios.post(`http://localhost:3000/services/service-creation` ,data, {headers: { 'Authorization': token }} );
            const services = response.data;
            serviceForm.reset()
            alert('Service created successfully!');
            fetchServices();
        } catch (error) {
            alert('Failed to create service.');
            console.error('Failed to fetch services:', error);
        }
    })
}

async function fetchAllAppointments(){
    try{
        const response = await axios.get('http://localhost:3000/appointments/get-all-appointments', { headers: { 'Authorization': token } });
        const appointments = response.data;
        const appointmentsContainer = document.getElementById('appointments');
        appointmentsContainer.innerHTML = '';
        appointments.forEach(appointment => {        
            addAppointmentToDOM(appointment);
        });
    } catch (error) {
        console.error('Failed to fetch appointments:', error);
        alert('Failed to fetch all appointments')
    }
}
function addAppointmentToDOM(appointment){
    const serviceName = appointment.service?.name || 'Service Not Found';
    const staffName = appointment.staff?.username || 'Staff Not Found';
    const customerName = appointment.customer?.username || 'Customer Not Found';
    const appointmentDiv = document.createElement('div');
    appointmentDiv.classList.add('appointment');
    appointmentDiv.innerHTML = `
        <h3>${serviceName}</h3>
        <p>Customer: ${customerName}</p>
        <p>Staff: ${staffName}</p>
        <p>Date: ${new Date(appointment.dateTime).toLocaleDateString()}</p>
        <p>Time: ${new Date(appointment.dateTime).toLocaleTimeString()}</p>
        <p>Status: ${appointment.status}</p>
    `;
    const appointmentsContainer = document.getElementById('appointments');
    appointmentsContainer.appendChild(appointmentDiv);
}