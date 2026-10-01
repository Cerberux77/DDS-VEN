import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="shell">
      <section className="hero">
        <div className="eyebrow">Restricted access</div>
        <h1>DDS Venezuela · Controlled Deal Room</h1>
        <p>El acceso es individual y queda registrado. Utilice su correo y contraseña vigente.</p>
      </section>
      <LoginForm />
    </main>
  );
}
