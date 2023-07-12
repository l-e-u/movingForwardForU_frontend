import { useState } from "react";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
   const [username, setUsername] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const { signup, error, isLoading } = useSignup();

   if (error) {
      console.log(error);

      const { errors } = error;
      console.log('has username error:', errors.hasOwnProperty('username'));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      await signup(username, email, password);
   };

   return (
      <form className="signup" onSubmit={handleSubmit}>
         <h3>Sign up</h3>

         <label htmlFor="username">Username</label>
         <input
            type="text"
            name="username"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
         />

         <label htmlFor="email">Email</label>
         <input
            type="email"
            name="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
         />

         <label htmlFor="password">Password</label>
         <input
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
         />

         <button disabled={isLoading}>Sign in</button>
         {error && <div className="error">{error.message}</div>}
      </form>
   )
};

export default Signup;