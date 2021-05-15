import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

import {tertiary} from '../styles/constants'

const PickerContainer = styled.div`
    display: flex;
    background: grey;
    justify-content: space-between;
    background: ${tertiary};
    border-radius: 8.91px;
    position: relative;
`;
const OptionContainer = styled.div`
    display: grid;
    place-items: center;
    flex-grow: 1;
    padding: 0.7rem;
    & > * {
        z-index: 99;
    }
`;
const Option = ({ name, handleSelect }) => {
    return (
        <OptionContainer onClick={() => handleSelect()}>
            <p>{name}</p>
        </OptionContainer>
    )
}
const SelectedOption = styled.div`
    background: #636366;
    border: 0.5px solid rgba(0, 0, 0, 0.04);
    border-radius: 6.93px;
    position: absolute;
    height: 100%;
    width: 50%;
    left: ${props => `${props.offset}%` };
    transition: all 0.5s ease;
`
const SegmentedPicker = ({ options, defaultSelected = 0, onSelectionChange = e => {}}) => {
    const [selected, setSelected] = useState(defaultSelected);
    useEffect(() => {
        onSelectionChange(selected)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selected])
    return (
        <PickerContainer>
            {
                options.map((e, i) => <Option name={e} key={uuidv4()} handleSelect={() => setSelected(i)} />)
            }
            <SelectedOption offset={selected === 0 ? 0 : selected * 100 / options.length}/>
        </PickerContainer>
    );
}

export default SegmentedPicker;
