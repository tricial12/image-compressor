import React from 'react';
import styled from '@emotion/styled';
import ImageCompressor from './components/ImageCompressor';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f7;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`;

const Header = styled.h1`
  text-align: center;
  color: #1d1d1f;
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

function App() {
  return (
    <AppContainer>
      <Header>图片压缩工具</Header>
      <ImageCompressor />
    </AppContainer>
  );
}

export default App;