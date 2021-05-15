import styled from 'styled-components'
import { accent, disabled } from './constants';

export const Title = styled.h1`
    font-size: 4.5rem;
    font-weight: 700;
    line-height: 80px;
    letter-spacing: -0.04em;
    text-align: left;
    margin-bottom: auto;
    grid-area: 'title';
    @media (max-width: 1000px) {
        font-size: 3.5rem;
    }
`
export const Button = styled.button`
    all: unset;
    background: ${accent};
    text-align: center;
    letter-spacing: -0.04rem;
    padding: 0.7rem 7rem;
    border-radius: 0.5rem;
    font-weight: 600;
    line-height: 1.5rem;
    ${props => props.secondary && `background: ${disabled};`}
    -webkit-tap-highlight-color: transparent;
    user-select: none;
`

export const SidePanel = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: space-between;
    & > * {
        transition: all 0.5s ease;
    }
`