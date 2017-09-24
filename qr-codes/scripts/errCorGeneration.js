function generateErrCor(genPoly,data,length) {
	/*
		genPoly:  generator polynominal in binary string   (eg "1111100100101")
		   data:  data to be encoded in binary string      (eg "000111")
		 length:  total length of data + error correction  (eg 18)
	*/
	
	//console.log("Data: " + data);
	
	var errCorLength = length - data.length;
	
	// pad data with 0's on right side
	while (data.length < length) {
		data+="0";
	}
	//console.log("Data (padded): " + data);
	
	
	// remove 0's from data on the left side
	data = data.replace(/^0+/, '');
	//console.log("Data (0's removed): " + data);
	
	
	return errCorDivision(genPoly,data,length,errCorLength);
}

function errCorDivision(genPoly,data,length,errCorLength) { // recursive division function for every division
	//console.log("--------------------");
	
	//console.log("Gen Poly: " + genPoly);
	// pad generator polynominal with 0's on right side
	var genPolyPadded = genPoly;
	while (genPolyPadded.length < data.length) {
		genPolyPadded+="0";
	}
	//console.log("Gen Poly (padded): " + genPolyPadded);
	
	
	// XOR the padded data and the padded generator polynominal
	var output = "";
	for (var i=0; i<data.length; i++) {
		if (data[i]==genPolyPadded[i]) {
			output+="0";
		} else {
			output+="1";
		}
	}
	//console.log("Output: " + output);
	
	
	// remove 0's from output on the left side
	output = output.replace(/^0+/, '');
	//console.log("Output (0's removed): " + output);
	
	
	if (output.length > errCorLength) {
		return errCorDivision(genPoly,output,length,errCorLength);
	} else {
		// pad data with 0's on left side
		while (output.length < errCorLength) {
			output="0"+output;
		}
		//console.log("Output (0's added): " + output);
		
		
		return output;
	}
}