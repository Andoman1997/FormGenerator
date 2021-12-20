import React, { useState, useEffect } from 'react';
import "./App.css";
import formConfig from "./formConfig.json";
import { v4 as uuid_v4 } from "uuid";
import 'antd/dist/antd.css'
import { Modal, Button } from 'antd';
import { Switch } from 'antd';



interface FormConfigItem {
  id: string;
  type: string;
  name: string;
  options?: [{
    key: string;
    value: number
  }];
  validation?: {
    required?: boolean;
    regexp?: string;
  };
}

// adding unique identifiers for each input to keep track in React
const _formConfig: FormConfigItem[] = formConfig.map((el:any) => ({
  ...el,
  id: uuid_v4(),
}));



function App() {
  const [values, setValues] = useState<any>({});
  const [selectValues, setSelectValues] = useState<number>(0);
  const [validation, setValidation] = useState<any>({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [switchPrice1, setSwitchPrice1] = useState<any>(false);
  const [switchPrice2, setSwitchPrice2] = useState<any>(false);

 

  function onChange100() {
    setSwitchPrice1(!switchPrice1)
  }

  function onChange200() {
    setSwitchPrice2(!switchPrice2)
  }


  const showModal = () => {
    setIsModalVisible(true);
  };

  

  const handleCancel = () => {
    setIsModalVisible(false);
  };

 
  const totalPrice = selectValues + (switchPrice1  ? 100 : 0) + (switchPrice2 ? 200 : 0)

   
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
    console.log(values, selectValues, switchPrice1, switchPrice2)
    if (hasErrors) return;
   };

   console.log(values, selectValues, switchPrice1, switchPrice2)


  const renderInput = (el: any) => {
    switch (el.type) {
      case "text":
        return (
          <input
            className={!validation[el.id] ? "invalid" : "" }
            key={el.id}
            type={el.type}
            placeholder={el.placeholder}
            value={values[el.name]}
            onChange={(e) => {
              setValues({ ...values, [el.name]: e.target.value })
            }}
          />
        );


      case "select":
        return (
          <label className='select-label'>Product type *: 
            <select
              key={el.id}
              className={!validation[el.id] ? "invalid" : "" }
              onChange={(e) => {
                setSelectValues(parseInt(e.target.value))
                
                
                console.log(selectValues)
              }}
            >
              {el.options.map((option: any, i: any) => (
                <option key={i} value={option[1]}>
                  {option[0]}
                </option>
              ))}
            </select>
          </label>
        );
            

        case "checkbox":
          return (
            <label className='checkbox-label'>
              {el.label}              
              <Switch
                key={el.id}
                checked={values[el.id]}
                onChange={(e) => {
                  el.name === 'switch1' ? onChange100() : onChange200()

                }}
              />
            </label>         
          );
    }
  }

  return (
    <div className="App">
      <Button type="primary" onClick={showModal}>
          Open Form
        </Button>
      <form>
        <Modal title="Title form" visible={isModalVisible}  onCancel={handleCancel} footer={null}>
         {_formConfig.map(renderInput)}
         

          <div className='total-price'>
            <span >Total price</span>
            <span>${totalPrice}</span>
          </div>

          <div className="submitBtn" onClick={() => formSubmit()}>Send form</div>
        </Modal>
      </form>
    </div>
  );
}

export default App;
