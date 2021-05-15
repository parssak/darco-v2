import React from 'react'
import styled from 'styled-components';
import { FadeLoader } from 'react-spinners'
const ModalContainer = styled.div`
    width: 13rem;
    height: 13rem;
    color: black;
    z-index: 99;
    position: absolute;
    top: 30%;  /* position the top  edge of the element at the middle of the parent */
    left: 50%; /* position the left edge of the element at the middle of the parent */
    border-radius: 1rem;
    transform: translate(-50%, -30%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;
export default function LoadingModal() {
    return (
        <ModalContainer>
            <FadeLoader/>
        </ModalContainer>
    )
}
