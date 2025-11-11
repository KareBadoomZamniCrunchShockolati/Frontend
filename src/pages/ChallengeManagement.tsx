import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";


const ChallengeManagementPage: React.FC = () => {



  useEffect(() => {}, []);



  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <h1 className="text-3xl font-semibold mb-4">Challenge Management</h1>

      <Formik
        initialValues={{ searchTerm: '' }}
        validationSchema={Yup.object({
          searchTerm: Yup.string(),
        })}
        onSubmit={() => {}}
      >
        
      </Formik>

     
        
    </div>
  );
};

export default ChallengeManagementPage;
