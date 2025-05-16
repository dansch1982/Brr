import React from 'react';
import styled from 'styled-components';

const EnemyContainer = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  transform: translate(-50%, -50%);
`;

const EnemyBody = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ff4444;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  animation: rotate 2s linear infinite;

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Enemy = ({ x, y }) => {
  return (
    <EnemyContainer style={{ left: x, top: y }}>
      <EnemyBody />
    </EnemyContainer>
  );
};

export default Enemy; 