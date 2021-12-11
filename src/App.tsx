import React, { useState, useEffect } from 'react';
import "./App.css";
import formConfig from "./formConfig.json";
import { v4 as uuid_v4 } from "uuid";

interface FormConfigItem {
  id: string;
  type: string;
  name: string;
  options?: string[];
  validation?: {
    required?: boolean;
    regexp?: string;
  };
}

// adding unique identifiers for each input to keep track in React
const _formConfig: FormConfigItem[] = formConfig.map((el) => ({
  ...el,
  id: uuid_v4(),
}));

function App() {

  const [values, setValues] = useState<any>({});
  const [validation, setValidation] = useState<any>({});
  const [step, setStep] = useState<any>(1);
  const [dataToShow, setDataToShow] = useState<any>({});

  useEffect(() => {
    let initialValidation: any = {}
    _formConfig.forEach(el => initialValidation[el.id] = true)
    setValidation(initialValidation)
  }, []);

  const validate = () => {
    let validation: any = {};
    _formConfig.forEach((el) => {
      const value: any = values[el.id];
      if (el.validation && el.validation.required && !value)
        validation[el.id] = false;
      else if (el.validation && el.validation.regexp) {
        const regexp = new RegExp(el.validation.regexp);
        const isValid = regexp.test(value);
        validation[el.id] = isValid;
      } else validation[el.id] = true;
    });
    return validation;
  };

  const formSubmit = () => {
    const validation = validate();
    setValidation(validation);
    const hasErrors = Object.values(validation).includes(false);
    if (hasErrors) return;
    console.log(dataToShow)
  };
 
  const renderInput = (el: any) => {
    switch (el.type) {
      case "text":
        return (
          <input
            className={!validation[el.id] ? "invalid" : "" }
            id={el.id}
            type={el.type}
            placeholder={el.placeholder}
            value={values[el.name]}
            onChange={(e) => {
              setValues({ ...values, [el.id]: e.target.value })
              setDataToShow({ ...dataToShow, [el.name]: e.target.value })    
            }}
          />
        );
      case "number":
        return (
          <input
            className={!validation[el.id] ? "invalid" : "" }
            id={el.id}
            type={el.type}
            placeholder={el.placeholder}
            value={values[el.age]}
            onChange = {(e) => {
               setValues({ ...values, [el.id]: e.target.value })
               setDataToShow({ ...dataToShow, [el.name]: e.target.value })
            }}
          />
        );
    }
  };

  const currentStepField = _formConfig.map(renderInput)
 
  return (
    <div className="App">
      <div className = 'wrapper'>
        <div className="form-wrapper">
          <h1>Заполните форму</h1>
          <form> 
            { step === 1 && ( 
              currentStepField[0] 
            )}
            { step === 2 && (
              currentStepField[1]
            )}
            { step === 3 && (
              currentStepField[2]
            )}
            { step === 4 && (
              currentStepField[3]
            )}
            <div className = { step === 1 ? 'oneBtn' : 'navBtn' }>
              { step !== 1 && (  
                <button 
                  onClick = {
                    (e) => { 
                      setStep(step - 1)
                      e.preventDefault()
                    }
                  }
                >
                    Назад
                </button>
              )}
              { step !== 4 ? (
                <button
                  onClick = {
                    (e) => {
                      setStep(step + 1)
                      e.preventDefault()
                    }
                  }
                >
                  Продолжить
                </button>
              ) : ( 
                <button
                  onClick = {
                    (e) => { 
                      formSubmit()
                    e.preventDefault()
                    }
                  }
                >
                  Отправить
                </button>
              )}   
            </div>       
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
