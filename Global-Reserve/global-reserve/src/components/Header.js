import React from 'react';
import styled from 'styled-components';

const Header = () => (
  <Container>
    <SearchBar placeholder="Search..." />
  </Container>
);

export default Header;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchBar = styled.input`
  width: 50%;
  padding: 5px;
  background-color: #1c2c4c;
  border: none;
  color: #ffffff;
  border-radius: 5px;
  outline: none;
`;

const UserProfile = styled.div`
  padding: 8px 15px;
  background-color: #1c2c4c;
  border-radius: 5px;
`;
