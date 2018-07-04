'use strict';

function calculateByTags(goodtags, AllItems) {
	var countOfGood=[];
	var items=new Set(goodtags);
	for(let i=0;i<items.size;i++){
		countOfGood[i]=0;
		for(let j=0;j<goodtags.length;i++){
			if(goodtags[j]===items[i]){
				if(items[i].indexOf("-")<0){
					countOfGood[i]++;
				}
				else{
					let location=items[i].split("-");
					countOfGood[i]=items.slice(location+1);
				}
			}	
		}	
	}
	return countOfGood;
}

