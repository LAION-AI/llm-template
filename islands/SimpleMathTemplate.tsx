import { useEffect, useState } from "preact/hooks";

interface TemplateProps {
  config: any;
  configInput: any[][];
}

function transformArray(arr) {
  let currentStart = 0;

  return arr.map((subArr) => {
    if (subArr.length > 1) {
      const transformedSubArray = Array.from(
        { length: subArr.length },
        (_, index) => currentStart + index,
      );
      currentStart += subArr.length;
      return transformedSubArray;
    } else {
      const result = [currentStart];
      currentStart += 1;
      return result;
    }
  });
}

function findAllIndices(arr: any[], target: any): number[] {
  const indices: number[] = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      indices.push(i);
    }
  }
  return indices;
}

function zipArraysToDict(arr1, arr2) {
  return arr1.map((subArray, index) => {
    const result = {};
    subArray.forEach((key, subIndex) => {
      result[key] = arr2[index][subIndex];
    });
    return result;
  });
}

function returnZippedDict(configInput: any[][]) {
  const inputIndex = configInput.map((row) => findAllIndices(row, "INPUT"));
  const inputArray = transformArray(inputIndex);
  return zipArraysToDict(inputIndex, inputArray);
}

export default function SimpleMathTemplate(
  { config, configInput }: TemplateProps,
) {
  if (!config && !configInput) {
    return <div>Both textareas do not contain valid JSON!</div>;
  }
  if (!config) {
    return <div>Layout textarea does not contain valid JSON!</div>;
  }
  if (!configInput) {
    return (
      <div>Config example input textarea does not contain valid JSON!</div>
    );
  }

  const [userInputs, setUserInputs] = useState(
    // count number of Inputs in configInput in all rows and add them up
    new Array(configInput.reduce((acc, row) => {
      return acc + row.filter((item) => item === "INPUT").length;
    }, 0)).fill(""),
  );

  const [results, setResults] = useState(
    new Array(configInput.length).fill(null),
  );

  const zippedDict = returnZippedDict(configInput);

  // console.log(userInputs);
  // console.log(results);
  // console.log(zippedDict);

  useEffect(() => {
    setUserInputs(new Array(configInput.reduce((acc, row) => {
      return acc + row.filter((item) => item === "INPUT").length;
    }, 0)).fill(""));
    setResults(new Array(configInput.length).fill(null));
  }, [configInput]);

  // useEffect(() => {
  //   setUserInputs(new Array(configInput.reduce((acc, row) => {
  //     return acc + row.filter((item) => item === "INPUT").length;
  //     }
  //   ).fill(""));

  // const [zippedDict, setZippedDict] = useState(returnZippedDict(configInput));
  // useEffect(() => {
  //   setZippedDict(returnZippedDict(configInput));
  // }, [configInput]);

  // const [zippedDict, setZippedDict] = useState(returnZippedDict(configInput));
  // const inputIndex = configInput.map((row) => findAllIndices(row, "INPUT"));
  // const inputArray = transformArray(inputIndex);
  // const zippedDict = zipArraysToDict(inputIndex, inputArray);
  // console.log(zippedDict);

  const handleInputChange = (index: number, value: string) => {
    const updatedInputs = [...userInputs];
    updatedInputs[index] = value;
    setUserInputs(updatedInputs);
  };

  const handleSubmit = () => {
    const updatedResults = configInput.map((row, index) => {
      const updatedRow = row.map((
        item,
        itemIndex,
      ) => (item === "INPUT"
        ? parseFloat(userInputs[zippedDict[index][itemIndex]].replace(" ", ""))
        : item != "FEEDBACK"
        ? item == "=" ? "==" : item
        : "")
      );
      const isCorrect = eval(updatedRow.join(""));
      return isCorrect;
    });
    setResults(updatedResults);
  };

  return (
    <div style={config.wrapperClass}>
      {configInput.map((row, index) => (
        <div key={index} class={config.rowClass}>
          {row.map((item, itemIndex) => {
            switch (item) {
              case "INPUT": {
                return (
                  <input
                    key={itemIndex}
                    type="text"
                    value={userInputs[zippedDict[index][itemIndex]]}
                    onInput={(e) =>
                      handleInputChange(
                        zippedDict[index][itemIndex],
                        e.currentTarget.value,
                      )}
                    class={config.elements.find((el) => el.element === "input")
                      .cssClass + " " + config.itemClass}
                  />
                );
              }
              case "FEEDBACK": {
                if (results[index] !== null) {
                  return (
                    <div
                      key={itemIndex}
                      class={config.elements.find((el) => el.element === "div")
                        .cssClass + " " + config.itemClass}
                    >
                      {results[index] === null
                        ? ""
                        : config.feedback[results[index]]}
                    </div>
                  );
                } else {
                  return null;
                }
              }
              default: {
                return (
                  <div
                    key={itemIndex}
                    class={config.elements.find((el) => el.element === "div")
                      .cssClass + " " + config.itemClass}
                  >
                    {item}
                  </div>
                );
              }
            }
          })}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        class={config.elements.find((el) => el.element === "submit")
          .cssClass}
      >
        Submit
      </button>
    </div>
  );
}
