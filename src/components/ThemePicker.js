import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Theme } from '../DarcoContext';
import { ReactComponent as Page } from '../svgs/page.svg';

const PagePreview = styled.div`
    filter: ${props => props.convert};
    `
const ThemeOptionContainer = styled.div`
      ${props => props.selected && `background-color: rgba(255, 255, 255, 0.06);`};
      flex-grow: 0.5;
      border-radius: 8.91px;
      width: 50%;
      & > * {
          /* height: 100%; */
          padding: 1rem;
      };
      
    `;
const ThemeOption = ({ theme, selected, handleSelect }) => {
    return (
        <ThemeOptionContainer selected={selected} onClick={handleSelect}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <PagePreview convert={theme.convert}>
                    <Page />
                </PagePreview>
                <p style={{ marginTop: '0.4rem', textTransform: 'capitalize' }}>{theme.name}</p>
            </div>
        </ThemeOptionContainer>
    )
}
const ThemePickerContainer = styled.div`
    display: flex;
    justify-content: space-between;
    & > * {
        transition: all 0.3s ease;
    };
`;

const ThemePicker = ({onSelectionChange}) => {
    const [selected, setSelected] = useState(Object.keys(Theme)[0]);
    
    useEffect(() => {
        onSelectionChange(selected)
    }, [onSelectionChange, selected])
    return (
        <ThemePickerContainer>
            {
                Object.keys(Theme).map(e => <ThemeOption theme={Theme[e]} selected={e === selected} handleSelect={() => setSelected(e)} key={e}/>)
            }
        </ThemePickerContainer>
    );
}

export default ThemePicker;
