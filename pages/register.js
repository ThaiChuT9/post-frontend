import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import api from "../services/api";

export default function Register() {

    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const validateForm = () => {
        if (form.password.length < 6) {
            setError("Password must be at least 6 characters long");
            return false;
        }
        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        return true;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsLoading(true);
        try {
            const response = await api.post('/register', form, {
                username: form.username,
                password: form.password,
            });

            if (response.status >= 200 && response.status < 300) {
                setSuccessMessage('Registration successful! Redirecting...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (err) {
            console.error("Registration error:", err);
            // Xử lý lỗi chi tiết hơn
            const errorMessage = err.response?.data?.message
                || err.message
                || 'Đăng ký thất bại';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div>
                    <label style={styles.label}>Tên đăng nhập: </label>
                    <input
                        type="text"
                        name="username"
                        placeholder="Nhập tên đăng nhập"
                        value={form.username}
                        onChange={handleChange}
                        style={styles.input}
                        required
                        minLength={3}
                    />
                </div>
                <div>
                    <label style={styles.label}>Mật khẩu: </label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Nhập mật khẩu"
                        value={form.password}
                        onChange={handleChange}
                        style={styles.input}
                        required
                        minLength={6}
                    />
                </div>
                <div>
                    <label style={styles.label}>Xác nhận mật khẩu: </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>
                <button
                    type="submit"
                    style={{ ...styles.button, ...(isLoading ? styles.buttonDisabled : {}) }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
                </button>
                {error && <p style={styles.error}>{error}</p>}
                {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
            </form>
        </div>
    );
}

const styles = {
    container: { maxWidth: '400px', margin: 'auto', padding: '2rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    input: { padding: '0.5rem', fontSize: '1rem' },
    button: { padding: '0.5rem', fontSize: '1rem', cursor: 'pointer' },
    error: { color: 'red' },
    label: { marginBottom: '0.5rem', fontWeight: 'bold' },
    successMessage: { color: 'green' },
    buttonDisabled: { cursor: 'not-allowed', opacity: 0.6 }
};

