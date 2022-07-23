import { useParams } from "react-router-dom";
import { useHedera } from "../context/hedera";
import { useTron } from "../context/tron";
import EmptyPage from "../app/claimtmp/EmptyPage";
import ClaimPage from "../app/claimtmp/ClaimPage";


function ClaimOnHedera() {
	const { fn:{ makeValidate } } = useHedera();
	const { depositId } = useParams();

	return (
		<ClaimPage 
			depositId={depositId} 
			makeValidate={makeValidate}
		/>
	)
}

function ClaimOnTron() {
	const { fn:{ makeValidate } } = useTron();
	const { depositId } = useParams();

	return (
		<ClaimPage 
			depositId={depositId} 
			makeValidate={makeValidate}
		/>
	)
}

function Claim() {
	const isHederaNetwork = window.location.href.indexOf("/hedera/") !== -1;
	const { depositId } = useParams();

	return !depositId ?
		<EmptyPage /> : isHederaNetwork ?
		<ClaimOnHedera /> :
		<ClaimOnTron />
}

export default Claim;