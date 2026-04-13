document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || 'Login failed');
            return;
        }
        sessionStorage.setItem('email', data.email);
        sessionStorage.setItem('role', data.role);

        window.location.href = '/';

    } catch (err) {
        alert('Something went wrong. Please try again.');
        console.error(err);
    }
});