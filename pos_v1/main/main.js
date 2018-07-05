'use strict';

function printReceipt(collection) {
  const calculateItemCount = calculateItem(collection);
  const itemDetails = findItemDetail(calculateItemCount, loadAllItems());
  getItemDetailLittlePriceSum(itemDetails, loadPromotions());
  let str = print(itemDetails);
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
  return calculateItemCount;
}

//商品详细信息包括小计
function findItemDetail(calculateItemCount, allItems) {
  const itemDetails=[];
  for(let item of calculateItemCount){
    for(let i=0;i<allItems.length;i++){
      if(item.barcode === allItems[i].barcode){
        itemDetails.push({
          "barcode":allItems[i].barcode,
		  "name":allItems[i].name,
          "count":item.count,
          "price":allItems[i].price,
          "unit":allItems[i].unit,
          "sum":item.count*parseFloat(allItems[i].price)
       });
       //break;
      }
    }
  }
  return itemDetails;
}

//促销活动
function getItemDetailLittlePriceSum(itemDetails, buyTweGetOneFree){
  const barcodes=buyTweGetOneFree[0].barcodes;
  let free=[];
  for (let i=0;i<itemDetails.length;i++){
    for (let j=0;j<barcodes.length;j++){
      if (itemDetails[i].barcode === barcodes[j]){
        if (itemDetails[i].count/2>0){
          free[i]=itemDetails[i].price;
          itemDetails[i].sum-=free[i];
        }
        else free[i]=0;
      }
	  else free[i]=0;
    }
	itemDetails.push({"free":free[i]});
  }
  return itemDetails;
}

//结果
function print(itemDetails) {
  let str = "***<没钱赚商店>收据***\n";
  // "名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)\n名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)\n名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)\n----------------------\n总计：58.50(元)\n节省：7.50(元)\n**********************"
  for (let item of itemDetails) {
    let price = item.price.toFixed(2);
    let sum = item.sum.toFixed(2);
    str += "名称：" + item.name + "，数量：" + item.count + item.unit + "，单价：" + price + "(元)，小计：" + sum + "(元)\n";
	let total+=sum;
	let save+=item.free.toFixed(2);
  }
  str += "----------------------\n总计：" + total.toFixed(2) + "(元)\n节省：" + save.toFixed(2) + "(元)\n**********************";
  return str;
}

