import React from "react";
import "./MultistepProgressBar.css";
import { ProgressBar, Step } from "react-step-progress-bar";

interface Props{
  page:number,
  totalNumOfPages:number,
  onPageNumberClick:(page: number) => void,
}

const MultiStepProgressBar = (props: Props) => {

  const {page, totalNumOfPages, onPageNumberClick} = props;
  let stepPercentage = 0;
  if (page == 0) {
    stepPercentage = 16;
  } else if (page == 1) {
    stepPercentage = 49.5;
  } else if (page == 2) {
    stepPercentage = 82.5;
  } else if (page == 3) {
    stepPercentage = 100;
  } else {
    stepPercentage = 0;
  }

  return (
      <>
        <ProgressBar
          percent={stepPercentage}>
          <Step>
            {({ accomplished, index }) => (
              <div
                className={`indexedStep ${accomplished ? "accomplished" : null}`}
              >
                {index + 1}
              </div>
            )}
          </Step>
          <Step>
            {({ accomplished, index }) => (
              <div
                className={`indexedStep ${accomplished ? "accomplished" : null}`}
              >
                {index + 1}
              </div>
            )}
          </Step>
          <Step>
            {({ accomplished, index }) => (
              <div
                className={`indexedStep ${accomplished ? "accomplished" : null}`}
              >
                {index + 1}
              </div>
            )}
          </Step>
          <Step>
            {({ accomplished, index }) => (
              <div
                className={`indexedStep ${accomplished ? "accomplished" : null}`}
              >
                {index + 1}
              </div>
            )}
          </Step>
        </ProgressBar>
      </>

  );
};

export default MultiStepProgressBar;
