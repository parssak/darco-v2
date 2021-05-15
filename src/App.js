import React, { useRef, useState } from "react";
import styled from "styled-components";
import { Title } from "./styles";
import DarcoProvider, { ReducerTypes, useDarco } from './DarcoContext';
import useResizeObserver from "@react-hook/resize-observer";
import StatusPanel from './components/StatusPanel';
import SettingsPanel from './components/SettingsPanel';
import PreviewPanel from './components/PreviewPanel';


window.app = this;

const AppContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: 0.1fr 1.9fr;
  gap: 1rem;
  grid-template-areas:
    "title preview settings"
    "status preview settings";
  @media (max-width: 1000px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 0.1fr 1.6fr 1.1fr;
    grid-template-areas:
    "title title"
    "preview settings"
    "status status";
  }
  padding: 4vw;
  height: 100vh;
  width: 100vw;
  /* background-color: white; */
`;
const useSize = (target) => {
  const [size, setSize] = React.useState()

  React.useLayoutEffect(() => {
    setSize(target.current.getBoundingClientRect())
  }, [target])

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize(entry.contentRect))
  return size
}

let originalBlob = "";

/**
 *  Helper function that gets the dataURL from a File object
 * @param file
 */
function getDataUrlFromFile(file) {
  console.log(file)
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.addEventListener('load', function () {
      // @ts-ignore
      originalBlob = reader.result.slice(28);
      console.log("Finito.");
      resolve(reader.result);
    }, false);
    reader.readAsDataURL(file);
  });
}

function App() {
  const target = useRef(null)
  const size = useSize(target)
  const { state, dispatch } = useDarco()
  const [pdfName, setPdfName] = useState('');
  window.recieveDataFromSwift = async (baseData, fileName) => {
    alert(fileName);
    window.webkit.messageHandlers.jsError.postMessage("Entered function");
  }

  return (
      <AppContainer ref={target}>
        <svg width="100vw" height="100vh" viewBox="0 0 100vw 100vh" fill="none" xmlns="http://www.w3.org/2000/svg" className="bg">
          <rect width="100vw" height="100vh" fill="url(#paint0_radial)" />
          <rect width="100vw" height="100vh" fill="url(#paint1_radial)" />
          <defs>
            <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform={`translate(936.302 -59.7211) rotate(15.768) scale(798.116 506.722)`}>
              <stop stopColor="#5856D6" stopOpacity="0.72" />
              <stop offset="1" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="paint1_radial" cx="0" cy="0" r="0.5" gradientUnits="userSpaceOnUse" gradientTransform={`translate(1448.12 849.716) rotate(-159.161) scale(850.184 809.54)`}>
              <stop stopColor="#AF52DE" stopOpacity="0.41" />
              <stop offset="1" stopColor="#2A1A87" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      <Title>Darco {pdfName} {state.step}</Title>
        <StatusPanel />
        <PreviewPanel width={size?.width} height={size?.height} />
        <SettingsPanel />
      </AppContainer>
  );
}

export default App;


