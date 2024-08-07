'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Dashboard from "@/components/Dashboard";
import ModalLoading from "@/components/ModalLoading";
import Alert from "@/components/Alert";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} >
        <Provider store={store} >
          <Dashboard>
            {children}
            <ModalLoading/>
            <Alert/>
          </Dashboard>
        </Provider>
      </body>
    </html>
  );
}
