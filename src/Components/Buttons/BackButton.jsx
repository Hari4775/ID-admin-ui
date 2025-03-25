import React from "react";
import styled from "styled-components";

const BackButton = ({ onClick }) => {
  return (
    <StyledWrapper>
      <button className="button" onClick={onClick}>
        <div className="button-box">
          Click Me {/* Replace text if needed */}
          <span className="button-elem">
            <svg viewBox="0 0 46 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z" />
            </svg>
          </span>
          <span className="button-elem">
            <svg viewBox="0 0 46 40">
              <path d="M46 20.038c0-.7-.3-1.5-.8-2.1l-16-17c-1.1-1-3.2-1.4-4.4-.3-1.2 1.1-1.2 3.3 0 4.4l11.3 11.9H3c-1.7 0-3 1.3-3 3s1.3 3 3 3h33.1l-11.3 11.9c-1 1-1.2 3.3 0 4.4 1.2 1.1 3.3.8 4.4-.3l16-17c.5-.5.8-1.1.8-1.9z" />
            </svg>
          </span>
        </div>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    display: block;
    position: relative;
    width: 100px;
    height: 50px;
    margin: 0;
    background-color: #3498db;
    color: white;
    font-size: 16px;
    font-weight: bold;
    border: none;
    cursor: pointer;
    border-radius: 5px;
    transition: background 0.3s ease;
  }

  .button:hover {
    background-color: #2980b9;
  }

  .button-box {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  .button-elem {
    width: 20px;
    height: 20px;
    fill: white;
  }
`;

export default BackButton;
