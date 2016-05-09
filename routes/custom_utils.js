//FORM POST Input validation
function validation(body, required){
	var errors = [];
	
	for(var k in required){
		var v = body[k];
		
		if(v === null || (typeof v === "string" && (v = v.trim()).length === 0)){
			errors.push(k);
			continue;
		}
		
		if(required[k] !== null && (v = required[k](v)) === null){
			errors.push(k);
			continue;
		}
		
		body[k] = v;
	}
	
	return errors;
}

module.exports = { validation: validation };