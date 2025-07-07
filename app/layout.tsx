import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext"; // Import the provider
import { Poppins } from 'next/font/google';

// Configure the font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '700', '800'], // Specify the weights you need
  variable: '--font-poppins', // Assign a CSS variable
});
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