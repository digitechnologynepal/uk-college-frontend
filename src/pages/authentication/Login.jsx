import { useAuth } from "../../context/AuthContext"
import { LoginForm } from "./login-components/LoginForm"

export const Login = () => {
    const { user } = useAuth();
    if (user) {
        window.location.replace('/admin/dashboard')
    }
    return (
        <>
            <section className="w-full bg-neutral-50 py-8 text-center flex flex-col gap-6">
                <strong className="text-2xl tracking-wide">Login Portal</strong>
            </section>
            <LoginForm />
        </>
    )
}