import React from 'react'

const Login = () => {
    const [response, setResponse] = React.useState(null);
    const handleLogin = async () => {
        try {
            const response = await fetch('https://be.letstranzact.com/main/login/password-login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'user@example.com',
                    password: 'password123'
                })
            });
            const data = await response.json();
            setResponse(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }
    React.useEffect(() => {
        handleLogin();
    }, []);
    return (
        <div>
            {response ? (
                <div>
                    <h2>Login Successful</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            ) : (
                <>
                    <h2>Login Failed</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>

                </>
            )}
        </div>

    )
}

export default Login;