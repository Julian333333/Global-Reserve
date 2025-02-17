import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const handleProfileRedirect = () => {
    navigate('/profile');
  };

  const handleDashboardRedirect = () => {
    navigate('/');
  };

  const handleWalletRedirect = () => {
    navigate('/wallet');
  };

  const handleTransactionsRedirect = () => {
    navigate('/transactions');
  };

  return (
    <Container>
      <Title>Global Reserve</Title>
      <Menu>
        <MenuItem onClick={handleDashboardRedirect}>🏠 Dashboard</MenuItem> {/* Verknüpfe den Button mit der Startseite */}
        <MenuItem onClick={handleTransactionsRedirect}>⏱️ Transactions</MenuItem>
        <MenuItem onClick={handleWalletRedirect}>💳 Wallet</MenuItem> {/* Add Wallet menu item */}
        <MenuItem onClick={handleProfileRedirect}>👤 Profile</MenuItem> {/* Verknüpfe den Button mit der Profilseite */}
        <Divider />
        <MenuItem>⚙️ Settings</MenuItem>
        <MenuItem onClick={handleLoginRedirect}>🔐 Log In</MenuItem>
      </Menu>
    </Container>
  );
};

export default Sidebar;

const Container = styled.div`
  width: 250px;
  background-color: #0b0f22;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  color: #f1c40f;
  font-size: 24px;
`;

const Menu = styled.div`
  margin-top: 20px;
`;

const MenuItem = styled.div`
  padding: 12px;
  font-size: 16px;
  color: #ffffff;
  cursor: pointer;
  &:hover {
    background-color: #1c2c4c;
    border-radius: 5px;
  }
`;

const Divider = styled.hr`
  border: 0.5px solid #ffffff;
  margin: 20px 0;
`;