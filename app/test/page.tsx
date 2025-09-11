"use client";
import React from 'react'
import { toast } from 'sonner';

const Login = () => {
    const [response, setResponse] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [access_token, setAccess_token] = React.useState(null);
    const [formData, setFormData] = React.useState({
        email: 'promptly06@gmail.com',
        password: 'izTpY@W2EBvZD9n'
    });

    const handleLogin = async () => {
        try {
            setLoading(true);
            setResponse(null);
            const response = await fetch('https://be.letstranzact.com/main/login/password-login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            setResponse(data);
            setAccess_token(data.data.access_token);
            if (data.status === 1) {
                await navigator.clipboard.writeText(data.data.access_token);
                toast.success('Login successful, and copied to clipboard.');
            } else {
                toast.error('Login failed. Please check your credentials.');
            }
        } catch (error) {
            toast.error('Login failed. Please try again later.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        if (access_token) {
            // store the access token in local storage
            localStorage.setItem('access_token', access_token);
            toast.success('Access token stored in local storage');
        }
    }, [access_token]);
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <div className="mb-4">
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email"
                    className="border border-gray-300 p-2 rounded-md w-full"
                />
            </div>
            <div className="mb-4">
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Password"
                    className="border border-gray-300 p-2 rounded-md w-full"
                />
            </div>
            <button
                onClick={handleLogin}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
            >
                {loading ? 'Logging in...' : 'Login'}
            </button>
            <div className="mt-6">
                <h2 className="text-xl font-bold mb-2">Response:</h2>
            </div>

            <h1 className="text-2xl font-bold mb-4">API Response</h1>
            <div className="mt-2">
                {response && (
                    <div>
                        <pre>{JSON.stringify(response, null, 2)}</pre>
                    </div>
                )}
                {!response && <p>No response yet. Click <b>Login</b> to send a request.</p>}
            </div>
        </div>

    )
}

export default Login;

/*
Response Examples
{
  "data": {
    "errors": {
      "detail": "The username password don't match",
      "display_error": true,
      "exception": "AuthenticationException",
      "doc": "\n    Exception for authentication.\n    "
    }
  },
  "status": 0,
  "message": {
    "detail": "The username password don't match",
    "display_error": true,
    "exception": "AuthenticationException",
    "doc": "\n    Exception for authentication.\n    "
  },
  "anonymous": [
    1
  ]
}

Response Example 2 - when credentials are correct:
  Login Successful
{
  "status": 1,
  "data": {
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1NzIzMzU3MCwiaWF0IjoxNzU3MDYwNzcwLCJqdGkiOiJhNzM2YWMyYzBiYjA0OGU1YWIwOTZmMzE0ZmRmOWVhNSIsInVzZXJfaWQiOjEwMDk3NjYsInVzZXJfZnVsbF9uYW1lIjoiU2hhaWwgSmFpc3dhbCIsImZpcnN0X25hbWUiOiJTaGFpbCIsImxhc3RfbmFtZSI6IkphaXN3YWwiLCJjb250YWN0X25vIjoiODAwNDU1MzQ5MCIsInVzZXJuYW1lIjoicHJvbXB0bHkwNkBnbWFpbC5jb20iLCJwcm9maWxlX3Bob3RvIjoiZGVmYXVsdF9pbWFnZXMvcHJvZmlsZV9kZWZhdWx0LmpwZyIsImNvbXBhbnlfbmFtZSI6Ik5NQ0kgSU5TUEVDVElPTlMgJiBTVVJWRVkgQ09NUEFOWSBQUklWQVRFIExJTUlURUQiLCJjb21wYW55X2lkIjoyMjYxODcsImNvbXBhbnlfaXNfY2xpZW50IjoxLCJ1dG1fcGFyYW1ldGVycyI6eyJhY3Rpb24iOiJ1bmtub3duIiwidXRtX3Rlcm0iOiJ8fCIsInV0bV9tZWRpdW0iOiJwcGMiLCJ1dG1fc291cmNlIjoiZ29vZ2xlIiwidXRtX2NvbnRlbnQiOiJ1bmtub3duIiwidXRtX2NhbXBhaWduIjoiSW52ZW50b3J5X0Rpc2NvdmVyeV9BQl9UZXN0Iiwic2lnbnVwX2F0dGVtcHQiOmZhbHNlLCJ1dG1fc2hhcmVfdHlwZSI6ImNvcHlfbGluayIsInV0bV9nZW5lcmF0ZWRfYnkiOiIyMTQzMjAifSwicHJvZmlsZV9jcmVhdGlvbl9kYXRlIjoiMjAyNTA5MDUiLCJwZV9zY29yZSI6MTcwMDIsImlzX3BhaWQiOiJQQUlEIiwib25ib2FyZGluZ19jb21wbGV0ZSI6dHJ1ZSwiZW1haWwiOiJwcm9tcHRseTA2QGdtYWlsLmNvbSJ9.A5NbQMY6zywgiFVW13DpzURYxNcQxobKJRgSHpxvCU4",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzU3MDYxNjcwLCJpYXQiOjE3NTcwNjA3NzAsImp0aSI6IjBkODE4YmUzNmFkNTQyOWE4MDM5ODk3MGVhZTVhNTUyIiwidXNlcl9pZCI6MTAwOTc2NiwidXNlcl9mdWxsX25hbWUiOiJTaGFpbCBKYWlzd2FsIiwiZmlyc3RfbmFtZSI6IlNoYWlsIiwibGFzdF9uYW1lIjoiSmFpc3dhbCIsImNvbnRhY3Rfbm8iOiI4MDA0NTUzNDkwIiwidXNlcm5hbWUiOiJwcm9tcHRseTA2QGdtYWlsLmNvbSIsInByb2ZpbGVfcGhvdG8iOiJkZWZhdWx0X2ltYWdlcy9wcm9maWxlX2RlZmF1bHQuanBnIiwiY29tcGFueV9uYW1lIjoiTk1DSSBJTlNQRUNUSU9OUyAmIFNVUlZFWSBDT01QQU5ZIFBSSVZBVEUgTElNSVRFRCIsImNvbXBhbnlfaWQiOjIyNjE4NywiY29tcGFueV9pc19jbGllbnQiOjEsInV0bV9wYXJhbWV0ZXJzIjp7ImFjdGlvbiI6InVua25vd24iLCJ1dG1fdGVybSI6Inx8IiwidXRtX21lZGl1bSI6InBwYyIsInV0bV9zb3VyY2UiOiJnb29nbGUiLCJ1dG1fY29udGVudCI6InVua25vd24iLCJ1dG1fY2FtcGFpZ24iOiJJbnZlbnRvcnlfRGlzY292ZXJ5X0FCX1Rlc3QiLCJzaWdudXBfYXR0ZW1wdCI6ZmFsc2UsInV0bV9zaGFyZV90eXBlIjoiY29weV9saW5rIiwidXRtX2dlbmVyYXRlZF9ieSI6IjIxNDMyMCJ9LCJwcm9maWxlX2NyZWF0aW9uX2RhdGUiOiIyMDI1MDkwNSIsInBlX3Njb3JlIjoxNzAwMiwiaXNfcGFpZCI6IlBBSUQiLCJvbmJvYXJkaW5nX2NvbXBsZXRlIjp0cnVlLCJlbWFpbCI6InByb21wdGx5MDZAZ21haWwuY29tIn0.rI-NDrEz5f9BOzb911k1DRs2niKj_nPXAVCVqD4MkZY",
    "onboarding_status": true,
    "require_2fa": false,
    "masked_mobile_number": null,
    "masked_email": null
  },
  "message": "",
  "anonymous": 0
}
*/