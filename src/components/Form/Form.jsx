import React, {useState} from "react";
import styles from './Form.module.scss';
import { Formik } from 'formik';
import { Send } from '@material-ui/icons';


export default ({onMessage}) => {

    const [status, setState] = useState({type: 0, message:"Waiting"});


    const handleFormMessage = (errors) => {
        let message = "";
        if(errors.email && errors.name && errors.message) {
            message = "Fill your name, email and message, then submit a form."
        } else if(errors.email) {
            message = "Submit a form but don't forget to fill your correct email."
        } else if(errors.name) {
            message = "... Don't forget to tell us who you are."
        } else if(errors.message){
            message = "Say something then submit the form."
        } else {
            message = "...Good. Finish your speech then submit the form."
        }
        onMessage(message);
    }

    const submitForm = (values, actions) => {

        var data = new FormData();
        for ( var key in values ) {
            data.append(key, values[key]);
        }

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://formspree.io/mogodadm");
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) return;
            if (xhr.status === 200) {
                // form.reset();
                actions.resetForm();
                setState({type: 1, messag:"Message has been sent to Zhaoping's email."});
            } else {
                setState({type: -1, message:"Error, should be network issue."});
            }
            actions.setSubmitting(false);
        };
        xhr.send(data);
    }

    return <Formik
        initialValues={{ email: '', name: '', message: '' }}
        validate={values => {
            let errors = {};
            if (!values.email) {
                errors.email = '[Required]';
            } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
                errors.email = '[Invalid email address]';
            }

            if (!values.name) {
                errors.name = '[Required]';
            }

            if (!values.message) {
                errors.message = '[Required]';
            }

            handleFormMessage(errors)
            return errors;
        }}
        onSubmit={submitForm}
    >
        {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
        }) => (
                <form 
                onSubmit={handleSubmit} 
                className={styles.form}
                >
                    <div className={styles.formTitle}>
                        <label>* My Email</label><span>{errors.email && touched.email && errors.email}</span>
                    </div>
                    <div className={styles.formInput}>
                        <input
                            type="email"
                            name="email"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email}
                        />
                    </div>

                    <div className={styles.formTitle}>
                        <label>* My Name</label><span>{errors.name && touched.name && errors.name}</span>
                    </div>
                    <div className={styles.formInput}>
                        <input
                            type="text"
                            name="name"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formTitle}>
                        <label>* Message to Zhaoping </label><span>{errors.message && touched.message && errors.message}</span>
                    </div>
                    <div className={styles.formInput}>
                        <textarea
                            name="message"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.message}
                            className={styles.textarea}
                            rows="6"
                            >

                        </textarea>
                    </div>
                    <div className={styles.formInput}>
                        <button type="submit" disabled={isSubmitting} className={styles.button}>
                            Submit
                            <Send/>
                        </button>

                        <span className={status.type === 1 ? styles.success : styles.fail}>
                            {status.type !== 0? status.message : null}</span>
                    </div>
                </form>
            )}
    </Formik>
}



// export default 
class MyForm extends React.Component {
    constructor(props) {
        super(props);
        this.submitForm = this.submitForm.bind(this);
        this.state = {
            status: ""
        };
    }

    render() {
        const { status } = this.state;
        return (
            <form
                onSubmit={this.submitForm}
                action="https://formspree.io/mogodadm"
                method="POST"
            >
                <label>Email:</label>
                <input type="email" name="email" />
                <label>Message:</label>
                <input type="text" name="message" />
                {status === "SUCCESS" ? <p>Thanks!</p> : <button>Submit</button>}
                {status === "ERROR" && <p>Ooops! There was an error.</p>}
            </form>
        );
    }

    submitForm(ev) {
        ev.preventDefault();
        const form = ev.target;
        const data = new FormData(form);

        console.log(form);
        const xhr = new XMLHttpRequest();
        xhr.open(form.method, form.action);
        xhr.setRequestHeader("Accept", "application/json");
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) return;
            if (xhr.status === 200) {
                form.reset();
                this.setState({ status: "SUCCESS" });
            } else {
                this.setState({ status: "ERROR" });
            }
        };
        xhr.send(data);
    }
}