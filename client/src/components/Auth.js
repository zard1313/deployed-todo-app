import { useState } from "react";
import { useCookies } from "react-cookie";

const Auth = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [error, setError] = useState(null);

    console.log(email, password, confirmPassword);
    console.log("Cookies: " + cookies);

    const viewLogin = (status) => {
        setError(null);
        setIsLogin(status);
    }
    
    const handleSubmit = async (e, endpoint) => {
        e.preventDefault();
        console.log("endpoint : " + endpoint);
        console.log("password : " + password);
        
        if(!isLogin && password !== confirmPassword){
            setError("Make sure passwords match!");
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/${endpoint}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        console.log("Data: " + data);

        if(data.detail){
            setError(data.detail);
        }else{
            setCookie("Email", data.email);
            setCookie("AuthToken", data.token);

            window.location.reload();
        }
    } 
    
    return (
        <div className="auth-container">
            <div className="auth-container-box">
                <form>
                    <h2>{isLogin ? "Please log in" : "Please sign up!"}</h2>
                    <input type="email" placeholder="email" onChange={(e) => (setEmail(e.target.value))}/>
                    <input type="password" placeholder="password" onChange={(e) => (setPassword(e.target.value))}/>
                    {!isLogin && <input type="password" placeholder="confirm password" onChange={(e) => (setConfirmPassword(e.target.value))}/>}
                    <input type="submit" className="create" value="submit" onClick={(e) => handleSubmit(e, isLogin ? 'login' : 'signup')}/>
                    {error && <p>{ error }</p>}
                </form>
                <div className="auth-options">
                    <button style={{backgroundColor: !isLogin ? "rgb(255, 255, 255)" : "rgb(188, 188, 188)"}} onClick={() => viewLogin(false)}>Sign Up</button>
                    <button style={{backgroundColor: isLogin ? "rgb(255, 255, 255)" : "rgb(188, 188, 188)"}} onClick={() => viewLogin(true)}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default Auth;
