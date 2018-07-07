'use strict';

function printReceipt(collection) {
  const splitBarcodeAndAmounts=bulidSplitBarcodeAndAmount(collection);
  const calculateItemCounts = bulidCalculateItemsCount(splitBarcodeAndAmounts);
  const shoppingDetails = addShoppingDetails(calculateItemCounts, loadAllItems());
  const aftershoppingDetails = alterShoppingDetails(shoppingDetails, loadPromotions());
  let str = generateReceipt(aftershoppingDetails);
  console.log(str);
}

function bulidSplitBarcodeAndAmount(tags){
	 const splitBarcodeAndAmounts=[];//[{barcode:xx,amount:xx},{}]
	 for(let i=0;i<tags.length;i++){
		 let tempObject ={};
		 if(tags[i].indexOf("-")>0){
			 let div=tags[i].split("-");
			 tempObject.barcode = div[0];
			 tempObject.count = parseFloat(div[1]);
		 }
		 else{
			 tempObject.barcode = tags[i];
			 tempObject.count = 1;
		 }
		 splitBarcodeAndAmounts.push(tempObject); 
	 }
	  //console.info(splitBarcodeAndAmounts);
	  return splitBarcodeAndAmounts;
}

function bulidCalculateItemsCount(splitBarcodeAndAmounts){
  let calculateItemsCounts = [];
  for(let splitBarcodeAndAmount of splitBarcodeAndAmounts) {
    let existBarcode = null;
    for(let calculateItemsCount of calculateItemsCounts) {
      if(calculateItemsCount.barcode === splitBarcodeAndAmount.barcode) {
        existBarcode = calculateItemsCount;
      }
    }
    if(existBarcode != null) {
      existBarcode.count += splitBarcodeAndAmount.count;
    }else {
      calculateItemsCounts.push({ ...splitBarcodeAndAmount });
    }
  }
  return calculateItemsCounts;
}

//购物详细信息包括小计
function addShoppingDetails(calculateItemCounts, allItems) {
  const shoppingDetails=[];
  for(let item of calculateItemCounts){
    for(let i=0;i<allItems.length;i++){
      if(item.barcode === allItems[i].barcode){
        shoppingDetails.push({
          "barcode":allItems[i].barcode,
          "name":allItems[i].name,
          "count":item.count,
          "price":allItems[i].price,
          "unit":allItems[i].unit,
          "sum":item.count*parseFloat(allItems[i].price)
       });
      }
    }
  }
  console.log(shoppingDetails);
  return shoppingDetails;
}

//进行促销活动
function alterShoppingDetails(shoppingDetails, buyTweGetOneFree){
  const aftershoppingDetails=shoppingDetails;
  const barcodes=buyTweGetOneFree[0].barcodes;
  for (let i=0;i<barcodes.length;i++){
    for (let j=0;j<shoppingDetails.length;j++){
      if (shoppingDetails[j].barcode === barcodes[i]){
        if (shoppingDetails[j].count>=2){
        	aftershoppingDetails[j].free=shoppingDetails[j].price;
          aftershoppingDetails[j].sum-=shoppingDetails[j].free;
        }
      }
	  else aftershoppingDetails[i].free=0;
    }
  }
  //console.log(aftershoppingDetails);
  return aftershoppingDetails;
}

//结果
function generateReceipt(shoppingDetails) {
	 /*`***<没钱赚商店>收据***
	名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
	名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
	名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
	----------------------
	总计：58.50(元)
	节省：7.50(元)
	**********************`*/
  let total=0;
  let save=0;
  let goods=[];
  
  for (let item of shoppingDetails) {
    total+=parseFloat(item.sum);
	save+=item.free;
	goods +=`\n名称：${item.name}，数量：${item.count}${item.unit}，单价：${item.price.toFixed(2)}(元)，小计：${item.sum.toFixed(2)}(元)`;
  }
	let str = `***<没钱赚商店>收据***${goods}
----------------------
总计：${total.toFixed(2)}(元)
节省：${save.toFixed(2)}(元)
**********************`;
  return str;
  //console.log(total);
}

