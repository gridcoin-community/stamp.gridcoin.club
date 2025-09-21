import React, {
  useState,
  useReducer,
  useMemo,
  useCallback,
} from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Head from 'next/head';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { PageWrapper } from '@/components/PageWrapper';
import { RecentStamps } from '@/components/Stamps/Recent';
import { Upload } from './Upload/Upload';
import { InitialState, reducer } from './reducer';
import { FilesContext, ErrorContext } from './context';
import { Steps } from './constants';
import { stateHasFile } from './actions';
import { Result } from './Result/Result';
import { Instructions } from './Instructions/Instructions';
import { Errors } from './Errors/Errors';
import { ColorizedSteppers } from './Stepper/ColorizedSteppers';

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

  React.useEffect(() => {
    if (!stateHasFile(state) && activeStep !== Steps.Select) {
      setActiveStep(Steps.Select);
    }
  }, [state, activeStep]);

  return (
    <>
      <Head>
        <title>Gridcoin blockchain stamping</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <PageWrapper>
        <Header />
        <Container maxWidth="xl" sx={{ flexGrow: 1 }}>
          <ErrorContext.Provider value={errorContextValue}>
            <FilesContext.Provider value={fileContextValue}>
              <Instructions />
              <Box width="100%">
                <ColorizedSteppers activeStep={activeStep} />
                <Box>
                  {activeStep === Steps.Select && <Upload next={handleNext} />}
                  {(activeStep > Steps.Select && stateHasFile(state)) && (
                  <Result
                    next={handleNext}
                    back={handleBack}
                    activeStep={activeStep}
                  />
                  )}
                </Box>
              </Box>
              <Errors />
            </FilesContext.Provider>
          </ErrorContext.Provider>
          <RecentStamps />
        </Container>
        <Footer />
      </PageWrapper>
    </>
  );
}
