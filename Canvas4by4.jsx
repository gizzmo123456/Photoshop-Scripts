// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
$.level = 1;

//Set to true if you want data to be printed to a text layer
//If this is set to true make shore that a text layer named 'DEBUG'
var __DEBUG___ = true;
//if false the doc size will not be updated when debuging.
var updateWhenDebug = false;
var debugInPx = true;	//Altho it might display cm it is px

//The max size the X or Y axis can be
//Must be a muti of 4 (theres no checks)
var maxSizePixels = 2048;


//the doc size
var docSize = {
	
	width: activeDocument.width,
	height: activeDocument.height
	
}

//the new doc size
var newDocSize = {
	
	width: docSize.width,
	height: docSize.height
	
}

//the doc size in px
var docPixels = {
	
	width: Math.round(docSize.width * (activeDocument.resolution/2.54)),
	height: Math.round(docSize.height * (activeDocument.resolution/2.54))
	
}

// Rounds a number up to the nearest muti of 4
// Numb: Size in CM
// returns size in CM
var RoundUpTo4 = function(numb){
	
	numb = ToPixelsFromCm(numb);

	var dif = Math.round(4 - Math.abs(((numb/4) - Math.floor(numb / 4)) * 4));
	
	if(dif == 4) return ToCmFromPixels(numb);

	return ToCmFromPixels(numb + dif);
	
}

var tempR = 0;
var tempRRaw = 0;


// Makes the smallestSide a muti of 4 when the largest side has been srunk to maxSizePixels
// LargestSide: Size in Px;
// SmallestSide: size in Px;
// returns size in px
var ClampToMaxPixels = function(largestSide, smallestSide){
	
	var tar = maxSizePixels / largestSide;
	var nsize = Math.round(smallestSide * tar);
	var nBy4 = nsize / 4;
	
	var remains = (nBy4 - Math.floor(nBy4)) * 4;
	var remainsRaw = (((smallestSide * tar) / 4) - Math.floor((smallestSide * tar) / 4)) * 4;
	
	//While theres more than 1 px remaining add 1px to the smalles edge untill remaining is less than 1.
	//Note this might need to be done with a raw version of remains.
	while(remains > 1){
		
		smallestSide += 1;
		
		nsize = Math.round(smallestSide * tar);
		nBy4 = nsize / 4;
	
		remains = remains = (nBy4 - Math.floor(nBy4)) * 4;
		remainsRaw = (((smallestSide * tar) / 4) - Math.floor((smallestSide * tar) / 4)) * 4;
	}
	
			
	tempR = remains;
	tempRRaw = remainsRaw;
	
	return smallestSide;
	
}

//Converts px to cm
var ToPixelsFromCm = function(cmVal){
	
	return cmVal * (activeDocument.resolution/2.54);
	
}

//converts cm to px
var ToCmFromPixels = function(pxVal){
	
	return pxVal / (activeDocument.resolution/2.54);
}

//if both sides are not the same and Is there a side that is larger than maxSizePixels
if(docPixels.width != docPixels.height && (docPixels.width > maxSizePixels || docPixels.height > maxSizePixels)){
	
	//is width more than height
	if(docPixels.width > docPixels.height){

		newDocSize.height = ToCmFromPixels(ClampToMaxPixels(docPixels.width, docPixels.height));
	 
		if(__DEBUG___)
			if(debugInPx)
				activeDocument.artLayers.getByName("DEBUG").textItem.contents = "(New Height) Current Width: "+docPixels.width+" || Current Height: "+docPixels.height+" || New Width: "+docPixels.width+"|| new Height: "+ToPixelsFromCm(newDocSize.height)+" || Remains: "+tempR +" (Raw: "+tempRRaw+")";
			else
				activeDocument.artLayers.getByName("DEBUG").textItem.contents = "(New Height) Current Width: "+docSize.width+" || Current Height: "+docSize.height+" || New Width: "+docSize.width+"|| new Height: "+newDocSize.height+" || Remains: "+tempR +" (Raw: "+tempRRaw+")";
	
	//else height is more than width. 
	}else{
		
		newDocSize.width = ToCmFromPixels(ClampToMaxPixels(docPixels.height, docPixels.width));
		
		if(__DEBUG___)
			if(debugInPx)
				activeDocument.artLayers.getByName("DEBUG").textItem.contents = "(New Height) Current Width: "+docPixels.width+" || Current Height: "+docPixels.height+" || New Width: "+ToPixelsFromCm(newDocSize.width)+"|| new Height: "+docPixels.height+" || Remains: "+tempR +" (Raw: "+tempRRaw+")";
			else
				activeDocument.artLayers.getByName("DEBUG").textItem.contents = "(New Height) Current Width: "+docSize.width+" || Current Height: "+docSize.height+" || New Width: "+docSize.width+"|| new Height: "+newDocSize.height+" || Remains: "+tempR +" (Raw: "+tempRRaw+")";
		
	}

			
	
//else if there the same or below max round to the nears muti of 4.
}else{
	
	newDocSize.width = RoundUpTo4(docSize.width);
	newDocSize.height = RoundUpTo4(docSize.height);
	
	if(__DEBUG___)
		if(debugInPx)
			activeDocument.artLayers.getByName("DEBUG").textItem.contents = "(4by4) Current Width: "+docPixels.width+" || Current Height: "+docPixels.height+" || New Width: "+ToPixelsFromCm(newDocSize.width)+"|| new Height: "+ToPixelsFromCm(newDocSize.height);
		else
			activeDocument.artLayers.getByName("DEBUG").textItem.contents = "(4by4) Current Width: "+docSize.width+" || Current Height: "+docSize.height+" || New Width: "+newDocSize.width+"|| new Height: "+newDocSize.height;

}

//update the doc size
if(!__DEBUG___ || __DEBUG___ && updateWhenDebug)
	activeDocument.resizeCanvas(newDocSize.width, newDocSize.height);


