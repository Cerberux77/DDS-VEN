import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="shell">
      <section className="hero">
        <div className="eyebrow">Registro controlado</div>
        <h1>Crear o renovar acceso</h1>
        <p>
          Registre su correo, teléfono y contraseña. El acceso queda auditado y la contraseña permanece vigente durante 72 horas.
        </p>
      </section>
      <RegisterForm />
    </main>
  );
}
