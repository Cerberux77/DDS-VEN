import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "SMSMantis · DDS Controlled Deal Room", robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body><header><div><div className="brand">SMSMANTIS</div><div>Strategic Consulting · DDS Venezuela</div></div><div>Controlled Deal Room</div></header>{children}</body></html>;
}
