import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // Import the provider

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "E-Bazar Securities",
  description: "Buy, sell, and rent properties in Nepal.",
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> 
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}