import React from 'react'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'

interface LayoutProps {
  children?: React.ReactNode
}
export default function RegisterLayout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
