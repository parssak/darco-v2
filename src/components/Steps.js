import React, { useRef } from 'react';
import styled from 'styled-components';

import { Button } from '../styles';
import { ReactComponent as Download } from '../svgs/download.svg';
import { ReactComponent as DarkMode } from '../svgs/darkmode.svg';
import { ReactComponent as Share } from '../svgs/share.svg';
import { primary, success, loading } from '../styles/constants';
import { ReducerTypes, useDarco } from '../DarcoContext';
import PDFBuilder from './PDFBuilder';

const buttonTexts = ["Select PDF", "Convert", "Loading", "Download"]

const Steps = () => {
    const { state, dispatch } = useDarco()
    const inputFile = useRef(null)

    const onButtonClick = () => {
        switch (state.step) {
            case ReducerTypes.Idle:
                inputFile.current.click()
                break
            case ReducerTypes.Ready:
                dispatch({ type: ReducerTypes.Loading });
                break;
            case ReducerTypes.Download:
                PDFBuilder(state.images, state)
                break;
            default:
                break;
        }

    }
    
    const onFileChange = evt => {
        const files = evt.target.files;
        // if (files.length) {
        //     alert(files[0].name.substring(0, files[0].name.lastIndexOf('.')))
        // }
        console.log(files[0]);
        dispatch({ type: ReducerTypes.Idle, data: files[0] })
    }

    return (
        <div style={{marginTop: 'auto'}}>
            <Step finished={0 - state.step < 0}>
                <Download fill={0 - state.step < 0 ? success : primary} />
                <StepTextWrapper>
                    <StepTitle>Select</StepTitle>
                    <StepDescription>Choose from Files</StepDescription>
                </StepTextWrapper>
            </Step>
            <Step finished={2 - state.step < 0} isLoading={state.step === 2}>
                <DarkMode fill={2 - state.step < 0 ? success : state.step === 2 ? loading : primary}/>
                <StepTextWrapper>
                    <StepTitle>Convert</StepTitle>
                    <StepDescription>Convert PDF to dark mode</StepDescription>
                </StepTextWrapper>
            </Step>
            <Step  >
                <Share fill={primary}/>
                <StepTextWrapper>
                    <StepTitle>Download</StepTitle>
                    <StepDescription>Export PDF anywhere</StepDescription>
                </StepTextWrapper>
            </Step>
            <ButtonWrapper>
                <Button onClick={onButtonClick}>{buttonTexts[state.step]}</Button>
            </ButtonWrapper>
            <input type="file" accept="application/pdf" ref={inputFile} style={{ display: 'none' }} onChange={onFileChange} />
        </div>
    );
}

export default Steps;

// Styling
const Step = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 0;
    margin-bottom: 2rem;
    & > * {
        margin-right: 1rem;
    }
    ${props => props.isLoading && `color: ${loading};`}
    ${props => props.finished && `color: ${success};`}
`
const StepTextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`
const StepTitle = styled.p`
    font-weight: 600;
    font-size: 1.2rem;
    letter-spacing: -0.04rem;
`
const StepDescription = styled.p`
    font-weight: 400;
    font-size: 1.2rem;
    letter-spacing: -0.04rem;
`

const ButtonWrapper = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-start;
    @media (max-width: 1000px) {
        justify-content: center;
    }
`;