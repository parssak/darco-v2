import React from 'react';
import { SidePanel} from '../styles';
import Steps from './Steps';

const StatusPanel = () => {
    return (
        <SidePanel style={{ gridArea: 'status'}}>
            <Steps/>
        </SidePanel>
    );
}

export default StatusPanel;
