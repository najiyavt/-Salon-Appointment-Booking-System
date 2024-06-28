const token = localStorage.getItem('token');


document.addEventListener("DOMContentLoaded" , () => {
   // fetchServices();
    handleServiceCreation();
    fetchAllAppointments();
});

// async function fetchServices(){
//     try{
//         const resposne= await axios.get(`http://localhost:3000/services/get-service` , {headers: { 'Authorization': token }} );
//         const services = resposne.data;
//         console.log('fetched services' ,services );
//         const existingServicesContainer = document.getElementById('existingServices');

//         services.forEach(service => {
//                 const serviceDiv = document.createElement('div');
//                 serviceDiv.classList.add('service');
//                 serviceDiv.innerHTML = ` <h3>${service.name}</h3>
//                                      <p>${service.description}</p>
//                                      <p>Duration: ${service.duration} minutes</p>
//                                      <p>Price: $${service.price}</p>
//                                      <p>Offer: ${service.offer}% discount</p>`;
//                 existingServicesContainer.appendChild(serviceDiv);
//         });
//         alert('Succesfully created new service');
//     } catch (error) {
//         console.error('Failed to fetch services:', error);
//         alert('Unable to created new service');

//     }
// };

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
            console.log('services',services);
            serviceForm.reset()
            alert('Service created successfully!');
           // fetchServices();
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
        console.log('Fetched appointments', appointments);
        const appointmentsContainer = document.getElementById('appointments');
        appointmentsContainer.innerHTML = '';
        appointments.forEach(appointment => {
            const serviceName = appointment.service?.name || 'Service Not Found';
            const customerName = appointment.customer?.username || 'Customer Not Found';
            const appointmentDiv = document.createElement('div');
            appointmentDiv.classList.add('appointment');
            appointmentDiv.innerHTML = `
                <h3>${serviceName}</h3>
                <p>Customer: ${customerName}</p>
                <p>Date: ${new Date(appointment.dateTime).toLocaleDateString()}</p>
                <p>Time: ${new Date(appointment.dateTime).toLocaleTimeString()}</p>
                <p>Status: ${appointment.status}</p>
            `;
            appointmentsContainer.appendChild(appointmentDiv);
        });

    } catch (error) {
        console.error('Failed to fetch appointments:', error);
        alert('Failed to fetch all appointments')
    }
}