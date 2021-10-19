import React, {
  useState,
  useReducer,
  useMemo,
  useCallback,
} from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Header } from 'components/Header/Header';
import Stepper from '@mui/material/Stepper';
import StepLabel from '@mui/material/StepLabel';
import { Step } from '@mui/material';
import { Footer } from 'components/Footer/Footer';
import { Upload } from './Upload/Upload';
import { InitialState, reducer } from './reducer';
import { FilesContext } from './context';
import { stepTitle, Steps } from './constants';
import { stateHasFile } from './actions';
import { Result } from './Result/Result';
import { Instructions } from './Instructions';

export function Page() {
  const [activeStep, setActiveStep] = useState(0);
  // const [files, setFiles] = useState<File[]>();
  const [state, dispatch] = useReducer(reducer, InitialState);

  const contextValue = useMemo(
    () => ({ state, dispatch }),
    [state],
  );

  // useEffect(() => {
  //   console.log('component did mount');
  //   // setInterval(() => dispatch({ type: ActionType.test }), 2000);
  // }, []);

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  if (!stateHasFile(state) && activeStep !== 0) {
    setActiveStep(0);
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <FilesContext.Provider value={contextValue}>
        <Container maxWidth="xl" sx={{ flexGrow: 1 }}>
          <Instructions />
          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {stepTitle.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <div>
              {activeStep === Steps.Select && <Upload next={handleNext} />}
              {(activeStep > Steps.Select && stateHasFile(state)) && (
                <Result
                  next={handleNext}
                  back={handleBack}
                  activeStep={activeStep}
                />
              )}
            </div>
          </Box>
        </Container>
      </FilesContext.Provider>
      <Footer />
    </Box>
  );
}
