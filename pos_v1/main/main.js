'use strict';

function printReceipt(collection) {
  const calculateItemCount = calculateItem(collection);
  const shoppingDetails = addShoppingDetails(calculateItemCount, loadAllItems());
  getItemDetailLittlePriceSum(shoppingDetails, loadPromotions());
  let str = print(shoppingDetails);
  console.log(str);
}

//统计商品数量
function calculateItem(tags){
  const itemCount={};//包含barcode和count的对象
  const calculateItemCount=[];
  for(let i=0;i<tags.length;i++){
	 //包含-的情况
    if(tags[i].indexOf("-")>0){
      let div=tags[i].split("-");//分割字符串为数组
      if(itemCount.hasOwnProperty(div[0])){
        itemCount[div[0]]=itemCount[div[0]]+parseFloat(div[1]);
      } 
	  else{
        itemCount[div[0]]=parseFloat(div[1]);
      }
    } 
	//不包含-的情况
	else{
      if(itemCount.hasOwnProperty(tags[i])){
        itemCount[tags[i]]=itemCount[tags[i]]+1;
      } 
	  else{
        itemCount[tags[i]]=1;
     }
    }
  }
  for(let n in itemCount) {
    calculateItemCount.push({"barcode": n, "count": itemCount[n]});
  }
  console.log(calculateItemCount);
  return calculateItemCount;
}

//购物详细信息包括小计
function addShoppingDetails(calculateItemCount, allItems) {
  const shoppingDetails=[];
  for(let item of calculateItemCount){
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

//促销活动
function getItemDetailLittlePriceSum(shoppingDetails, buyTweGetOneFree){
  const barcodes=buyTweGetOneFree[0].barcodes;
  for (let i=0;i<barcodes.length;i++){
    for (let j=0;j<shoppingDetails.length;j++){
      if (shoppingDetails[j].barcode === barcodes[i]){
        if (shoppingDetails[j].count>=2){
        	shoppingDetails[j].free=shoppingDetails[j].price;
          shoppingDetails[j].sum-=shoppingDetails[j].free;
        }
      }
	  else shoppingDetails[i].free=0;
    }
  }
  console.log(shoppingDetails);
  return shoppingDetails;
}

//结果
function print(shoppingDetails) {
  let str = "***<没钱赚商店>收据***\n";
  // "名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)\n名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)\n名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)\n----------------------\n总计：58.50(元)\n节省：7.50(元)\n**********************"
  let total=0;
  let save=0;
  for (let item of shoppingDetails) {
    let price = item.price.toFixed(2);
    let sum = item.sum.toFixed(2);
    total+=parseFloat(item.sum);
	save+=item.free;
    str += "名称：" + item.name + "，数量：" + item.count + item.unit + "，单价：" + price + "(元)，小计：" + sum + "(元)\n";
  }
  str += "----------------------\n总计：" + total.toFixed(2) + "(元)\n节省：" + save.toFixed(2) + "(元)\n**********************";
  return str;
  console.log(total);
}

