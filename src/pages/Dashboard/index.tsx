import React, { useState} from "react";

import {useModel} from "@@/exports";
import Dashboard from "@/pages/Dashboard/components/Dashboard";
import SelectStudent from "@/pages/Dashboard/components/SelectStudent";



const Forms: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<number>(0);
  const {initialState} = useModel('@@initialState');

  return (
    <>
      {
        initialState?.currentUser?.isAdmin && selectedStudent === 0 ?(
          <SelectStudent setSelectedStudent={setSelectedStudent}></SelectStudent>
        ):(
          initialState?.currentUser ?
            <Dashboard
              isAdmin={initialState?.currentUser?.isAdmin}
              id={selectedStudent}
              setSelectedStudent={setSelectedStudent}
            ></Dashboard>:''
        )
      }
    </>
  )

}
export default Forms;
