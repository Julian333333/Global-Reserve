import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: Arial, sans-serif;
    background-color: #0d1326;
    color: #ffffff;
  }

  element.style {
    margin: 0;
}
`;

export default GlobalStyles;
