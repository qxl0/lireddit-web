import React from 'react'
import { Wrapper, WarpperVariant } from "./Wrapper";
import { NavBar } from "./NavBar"

interface LayoutProps {
  variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
};
