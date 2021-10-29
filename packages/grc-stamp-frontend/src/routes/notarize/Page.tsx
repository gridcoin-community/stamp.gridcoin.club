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
import Head from 'next/head';
import { Upload } from './Upload/Upload';
import { InitialState, reducer } from './reducer';
import { FilesContext, ErrorContext } from './context';
import { stepTitle, Steps } from './constants';
import { stateHasFile } from './actions';
import { Result } from './Result/Result';
import { Instructions } from './Instructions';
import { Errors } from './Errors';

export function Page() {
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string>();
  const [state, dispatch] = useReducer(reducer, InitialState);

  const fileContextValue = useMemo(
    () => ({ state, dispatch }),
    [state],
  );
  const errorContextValue = useMemo(
    () => ({ error, setError }),
    [error],
  );

  const handleBack = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }, []);

  if (!stateHasFile(state) && activeStep !== Steps.Select) {
    setActiveStep(Steps.Select);
  }

  return (
    <>
      <Head>
        <title>Gridcoin blockchain stamping</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <ErrorContext.Provider value={errorContextValue}>
          <FilesContext.Provider value={fileContextValue}>
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
            <Errors />
          </FilesContext.Provider>
        </ErrorContext.Provider>
        <Footer />
      </Box>
    </>
  );
}
