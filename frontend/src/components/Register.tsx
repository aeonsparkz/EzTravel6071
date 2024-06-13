import "./Register.css";
import Validation from "./registerValidation";
import React from 'react';
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Register() {
    interface FormValues {
        email: string;
        password: string;
        cfmpassword: string;
    }
    interface FormErrors {
        email?: string;
        password?: string;
        cfmpassword?: string;
    }
    const [values, setValues] = useState<FormValues>({
        email: '',
        password: '',
        cfmpassword:''
    });

    const [errors, setErrors] = useState<FormErrors>({});

    const navigate = useNavigate();

    const handleSubmit=(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors(Validation(values));
        if(errors.email ==="" && errors.password==="" && errors.cfmpassword==="") {
            axios.post('http://localhost:3000/Register', values)
            .then(res => {
                navigate('/');
            })
            .catch(err => console.log(err));
        }
    }

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setValues(prev => ({
            ...prev,
            [name]: value
        }));
    }
    return (
        <div className="register">
            <div className="header">
                <h1>EzTravel</h1>
            </div>
            <div className="container">
                <form action="" onSubmit={handleSubmit}> {/*form is used to collect user response*/}
                    <h1>Travel With Us!</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Email" name='email' value={values.email} required onChange={handleInput}/>
                        {errors.email && <span className='text-danger'> {errors.email}</span>}
                    </div>
                    <div className="input-box">
                        <input type="text" placeholder="Password" name='password' value={values.password} required onChange={handleInput}/>
                        {errors.password && <span className='text-danger'> {errors.password}</span>}
                    </div>
                    <div className="input-box">
                        <input type="text" placeholder="Password" name='cfmpassword' value={values.cfmpassword} required onChange={handleInput}/>
                        {errors.cfmpassword && <span className='text-danger'> {errors.cfmpassword}</span>}
                    </div>
                    <div className="loginbutton">
                        <button type="submit">Register</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;