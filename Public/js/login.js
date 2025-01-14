
    document.getElementById('login-form').addEventListener('submit', async function (event) {
      event.preventDefault(); // Prevent default form submission

      // Get email and password values from the form
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        // Send login request to the server
        const response = await axios.post('/user/login', { email, password });

        // Extract token from the response
        const { token } = response.data;
        
        localStorage.setItem('authToken', token);

        console.log('Received token:', token);

        console.log('Login successful, token saved.');

        // Redirect to the dashboard or another page
        window.location.href = '/dashboard';
      } catch (error) {
        console.error('Login error:', error);

        // Display error message to the user
        const errorMessage = document.getElementById('error-message');
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage.textContent = error.response.data.message;
        } else {
          errorMessage.textContent = 'An error occurred during login. Please try again.';
        }
      }
    });