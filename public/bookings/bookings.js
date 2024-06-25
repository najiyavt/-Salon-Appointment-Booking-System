const bookingForm = document.getElementById('bookingForm');
const token = localStorage.getItem('token')

bookingForm.addEventListener('submit' , async(event) => {
    event.preventDefault();

    const serviceId = bookingForm.service.value;
    const dateTime = bookingForm.dateTime.value;

    try{
        const response = await axios.post(`http://localhost:3000/appoinment/new-appoinment` , { serviceId , dateTime} , {headers: { 'Authorization': token }});
        console.log('Booking succesfull' , response.data);
        alert('Booking succefull');
        bookingForm.reset();
    } catch (error) {
        console.error('Error booking appointment:', error);
        alert('Booking failed. Please try again.');
    }
    });

    async function fetchServices(){
        try{
            const resposne= await axios.get(`http://localhost:3000/service/get-Services` , {headers: { 'Authorization': token }} );
            const services = resposne.data;
            console.log('fetched services' ,services );
            const serviceSelect = document.getElementById('service');

            services.forEach(service => {
                const option = document.createElement('option');
                option.value=service.id;
                option.textContent= `${service.name} - ${service.description} (${service.duration} mins, $${service.price})`;
                serviceSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Failed to fetch services:', error);
        }
    };

    async function setWorkingHours(){
        const dayOfWeek = document.getElementById('dayOfWeek');
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
      
        try {
            const response = await axios.post(`http://localhost:3000/appoinment/working-hours` , {dayOfWeek,startTime,endTime},{headers: { 'Authorization': token }});
            console.log('Working hours set:', response.data);
            alert('Working hours updated successfully!');
        } catch (error) {
            console.error('Error setting working hours:', error);
            alert('Failed to update working hours. Please try again.');
        }
    }
    document.addEventListener("DOMContentLoaded" , () => {
        fetchServices()
})