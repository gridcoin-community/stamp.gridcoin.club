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
import { Step, Typography } from '@mui/material';
import { Footer } from 'components/Footer/Footer';
import { StampIcon } from 'icons/StampIcon';
import { Upload } from './Upload/Upload';
import { InitialState, reducer } from './reducer';
import { FilesContext } from './context';
import { stepTitle, Steps } from './constants';
import { stateHasFile } from './actions';
import { Result } from './Result/Result';

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
          <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Box mr={4} sx={{ display: 'flex', alignItems: 'center' }}>
              <StampIcon />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="body1" gutterBottom>
                Timestamping of documents can allow a public verification of the issue history
                which is permanently recorded to the public blockchain.
                There is absolutely no method of potential malicious modification at a later stage.
              </Typography>
              <Typography variant="body1" gutterBottom>
                In order to notarize the document or check the proof of existence
                {' '}
                just drop the target file down below and follow the instructions.
              </Typography>
              <Typography variant="body1" gutterBottom>
                The service is provided free of charge.
              </Typography>
            </Box>
          </Box>
          <br />
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
