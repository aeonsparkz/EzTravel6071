import { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom"
import Validation from './LogInValidation';
import { StringLiteral, isStringLiteral } from "typescript";
import axios from "axios";

function Login() {
    interface FormValues {
        email: string;
        password: string;
    }
    interface FormErrors {
        email?: string;
        password?: string;
    }
    const [values, setValues] = useState<FormValues>({
        email: '',
        password: ''
    })

    const [errors, setErrors] = useState<FormErrors>({});

    const navigate = useNavigate();

    const handleSubmit=(event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors(Validation(values));
        if(errors.email ==="" && errors.password==="") {
            axios.post('http://localhost:3000/Login', values)
            .then(res => {
                if(res.data === "Success") {
                    navigate('/Home');
                } else {
                    alert("No record existed");
                }
            })
            .catch(err => console.log(err));
        }
    }

    const handleInput=(event: { target: { name: any; value: any; }; })=> {
        setValues(prev => ({...prev, [event.target.name]:[event.target.value]}))
    }
    return (
        
        <div className="login">
            <div className="header">
                <h1>EzTravel</h1>
            </div>
            <div className="subheader">
                <h2>Travel Simply</h2>
            </div>
            <div className="container">
                <form action="" onSubmit={handleSubmit}> {/*form is used to collect user response*/}
                    <h1>Welcome Back!</h1>
                    <div className="input-box">
                        <input type="text" placeholder="Email" name='email' value={values.email} required onChange={handleInput}/>
                        {errors.email && <span className='text-danger'> {errors.email}</span>}
                    </div>
                    <div className="input-box">
                        <input type="password" placeholder="Password" name='password' value={values.password} required onChange={handleInput}/>
                        {errors.password && <span className='text-danger'> {errors.password}</span>}
                    </div>
                    <div className="loginbutton">
                        <button type="submit">Login</button>
                    </div>
                    <div className="register">
                        <p>No Account? Register <Link to="./Register">Now!</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;