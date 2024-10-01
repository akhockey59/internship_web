// import React from 'react';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ backgroundImage: "linear-gradient(#00d5ff,#0095ff,rgba(93,0,255,.555))" }} className="d-flex flex-column justify-content-center align-items-center text-center vh-100">
      <h1>Welcome to Interns Scholar</h1>
      <p className="lead">
        Congratulations on successfully logging in! Interns Scholar offers you a unique opportunity to explore the professional world through hands-on experience and challenges.
      </p>
      <p>
        Our internships are designed to help you grow, learn, and prepare for a successful career. Don't miss out on the exciting missions that await you.
      </p>
      <p className="font-weight-bold">
        <strong>Reminder:</strong> Submit your challenge as soon as possible to proceed with your application process.
      </p>
      <Link to='/login' className="btn btn-light my-5">Logout</Link>
    </div>
  )
}

export default Home;
