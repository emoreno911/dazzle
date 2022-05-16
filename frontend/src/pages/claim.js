import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import EmptyPage from "../app/claim/EmptyPage";
import ClaimPage from "../app/claim/ClaimPage";


function Claim() {
  const { depositId } = useParams();
    return depositId ? 
      <ClaimPage depositId={depositId} /> : 
      <EmptyPage />
}

export default Claim;