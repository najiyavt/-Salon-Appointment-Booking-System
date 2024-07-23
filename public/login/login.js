const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', loginSubmit);
async function loginSubmit (event) {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const data = {
        email: formData.get('email'),
        password: formData.get('password'),
    };
    console.log('login detaisls' , data)
    try{
        const response = await axios.post(`http://localhost:3000/users/login`, data);
        localStorage.setItem('token',response.data.token);
        alert('Login successfull');
        if (response.data.role === 'customer') {
            window.location.href = '../bookings/bookings.html';
        } else if (response.data.role === 'staff') {
            window.location.href = '../services/services.html';
        }    
    }catch (error) {
        console.error('Error logging in:', error);
        alert('Login failed. Please check your credentials and try again.');
    }
};


async function sendForm(){
    document.getElementById('emailForm').style.display='block';
}

async function submitEmailForm(event){
    event.preventDefault();
    const email = document.getElementById('emailForgt').value;

    try{
        const response = await axios.post(`http://localhost:3000/password/forgotpassword` , {email});
        
        alert('Reset email sent successfully!');
        document.getElementById('emailForm').style.display = 'none';
        document.getElementById('emailForgt').value='';
    }catch (error) {
        console.error('Error sending reset email:', error);
        alert('Failed to send reset email. Please try again.');
    }
}