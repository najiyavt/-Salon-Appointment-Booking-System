const signupForm = document.getElementById('signupForm');
signupForm.addEventListener('submit', signupSubmit);
async function signupSubmit(event)  {
    event.preventDefault();
    const formData = new FormData(signupForm);
    const data = {
        username:formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role'),
    };
    console.log('signupDetails',data)
    try{
        const response = await axios.post('http://localhost:3000/users/signup', data);
        alert('Succesfully signed');
        window.location.href = '../login/login.html';
    }catch(error){
        console.error('Error signing up:', error);
        alert('Signup failed. Please check your details and try again.');
    }
};