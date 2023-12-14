import React from 'react'
import Footer from 'src/components/Footer'
import NavbarHeader from 'src/components/NavbarHeader'

interface LayoutProps {
  children?: React.ReactNode
}
export default function RegisterLayout({ children }: LayoutProps) {
  return (
    <>
      <NavbarHeader />
      {children}
      <Footer />
    </>
  )
}
