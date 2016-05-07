window.addEventListener('DOMContentLoaded', function(){
	var source = document.querySelector("#source"),
		destination = document.querySelector("#destination");
	
	source.addEventListener('change', function(){
		destination.innerHTML = "";
		var targets = routes[source.value];
				
		for(var finish_city in targets){
			var option = document.createElement("option");
					
			option.value = targets[finish_city];
			option.innerText = finish_city;
			destination.appendChild(option);
		}
	});
});