// src/components/Navigation.js
import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

const Nav = styled.nav`
  background-color: #1a237e;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  color: #ffd700;
  font-size: 1.5rem;
  font-weight: bold;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  color: #ffffff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

function Navigation() {
  return (
    <Nav>
      <Logo>TradePro</Logo>
      <NavLinks>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/wallet">Wallet</NavLink>
        <NavLink to="/portfolio">Portfolio</NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/faq">FAQ</NavLink>
      </NavLinks>
    </Nav>
  );
}

export default Navigation;