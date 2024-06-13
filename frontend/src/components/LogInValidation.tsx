function Validation(values: { email: string; password: string }) {
    interface FormErrors {
        email?: string;
        password?: string;
    }
    const validationErrors: FormErrors = {};
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
    
    if (!email_pattern.test(values.email)) {
        validationErrors.email= "Invalid Email";
    } else {
        validationErrors.email="";
    }

    if(!password_pattern.test(values.password)) {
        validationErrors.password = "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, and one digit";
    } else {
        validationErrors.password = "";
    }
    return validationErrors;
}

export default Validation;