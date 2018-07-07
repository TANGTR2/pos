'use strict';

const {loadAllItems,loadPromotions} = require('../main/fixtures')
const {
	bulidSplitBarcodeAndAmount,
	bulidCalculateItemsCount,
	addShoppingDetailsWithSubsum,
	alterShoppingDetails,
	calculatePrice,
	generateReceipt,
	printReceipt} = require('../main/main')

describe('pos', () => {

  it('should print text result test', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2.5',
      'ITEM000005',
      'ITEM000005-2',
    ];

    spyOn(console, 'log');

    printReceipt(tags);

    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });
});

describe('Unit Test',()=> {
	it('Unit test of bulidSplitBarcodeAndAmount()', () => {
		//given
		const tags = [
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000003-2.5',
		      'ITEM000005',
		      'ITEM000005-2',
		    ];
		//when
		const splitBarcodeAndAmounts = bulidSplitBarcodeAndAmount(tags);
		//then
		let result=JSON.stringify([
			{"barcode":"ITEM000001","count":1},
			{"barcode":"ITEM000001","count":1},
			{"barcode":"ITEM000001","count":1},
			{"barcode":"ITEM000001","count":1},
			{"barcode":"ITEM000001","count":1},
			{"barcode":"ITEM000003","count":2.5},
			{"barcode":"ITEM000005","count":1},
			{"barcode":"ITEM000005","count":2}]);
		expect(JSON.stringify(splitBarcodeAndAmounts)).toBe(result);   
	});
});

describe('Unit Test',()=> {
	it('Unit test of bulidCalculateItemsCount()', () => {
		//given
		const tags = [
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000003-2.5',
		      'ITEM000005',
		      'ITEM000005-2',
			];
		const splitBarcodeAndAmounts = bulidSplitBarcodeAndAmount(tags);
		//when
		const calculateItemCounts = bulidCalculateItemsCount(splitBarcodeAndAmounts);
		//then
		let result=JSON.stringify([
			{"barcode":"ITEM000001","count":5},
			{"barcode":"ITEM000003","count":2.5},
			{"barcode":"ITEM000005","count":3}]);
		expect(JSON.stringify(calculateItemCounts)).toBe(result);   
	});
});

describe('Unit Test',()=> {
	it('Unit test of addShoppingDetailsWithSubsum()', () => {
		//given
		const tags = [
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000003-2.5',
		      'ITEM000005',
		      'ITEM000005-2',
			];
		const splitBarcodeAndAmounts = bulidSplitBarcodeAndAmount(tags);
		const calculateItemCounts = bulidCalculateItemsCount(splitBarcodeAndAmounts);
		//when
		const shoppingDetails = addShoppingDetailsWithSubsum(calculateItemCounts, loadAllItems());
		//then
		let result=JSON.stringify([{"barcode":"ITEM000001","name":"雪碧","count":5,"price":3,"unit":"瓶","sum":15},
			{"barcode":"ITEM000003","name":"荔枝","count":2.5,"price":15,"unit":"斤","sum":37.5},
			{"barcode":"ITEM000005","name":"方便面","count":3,"price":4.5,"unit":"袋","sum":13.5}]);
		expect(JSON.stringify(shoppingDetails)).toBe(result);   
	});
});

describe('Unit Test',()=> {
	it('Unit test of alterShoppingDetails()', () => {
		//given
		const tags = [
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000003-2.5',
		      'ITEM000005',
		      'ITEM000005-2',
		    ];
		const splitBarcodeAndAmounts = bulidSplitBarcodeAndAmount(tags);
		const calculateItemCounts = bulidCalculateItemsCount(splitBarcodeAndAmounts);
		const shoppingDetails = addShoppingDetailsWithSubsum(calculateItemCounts, loadAllItems());
		//when
		const aftershoppingDetails = alterShoppingDetails(shoppingDetails, loadPromotions());
		//then
		let result=JSON.stringify([
			{"barcode":"ITEM000001","name":"雪碧","count":5,"price":3,"unit":"瓶","sum":12,"free":3},
			{"barcode":"ITEM000003","name":"荔枝","count":2.5,"price":15,"unit":"斤","sum":37.5,"free":0},
			{"barcode":"ITEM000005","name":"方便面","count":3,"price":4.5,"unit":"袋","sum":9,"free":4.5}]);
		expect(JSON.stringify(aftershoppingDetails)).toBe(result);   
	});
});

describe('Unit Test',()=> {
	it('Unit test of calculatePrice()', () => {
		//given
		const tags = [
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000003-2.5',
		      'ITEM000005',
		      'ITEM000005-2',
		    ];
		const splitBarcodeAndAmounts = bulidSplitBarcodeAndAmount(tags);
		const calculateItemCounts = bulidCalculateItemsCount(splitBarcodeAndAmounts);
		const shoppingDetails = addShoppingDetailsWithSubsum(calculateItemCounts, loadAllItems());
		const aftershoppingDetails = alterShoppingDetails(shoppingDetails, loadPromotions());
		//when
		const prices = calculatePrice(aftershoppingDetails);
		//then
		let result=JSON.stringify({"total":58.5,"save":7.5});
		expect(JSON.stringify(prices)).toBe(result);   
	});
});

describe('Unit Test',()=> {
	it('Unit test of generateReceipt()', () => {
		//given
		const tags = [
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000001',
		      'ITEM000003-2.5',
		      'ITEM000005',
		      'ITEM000005-2',
		    ];
		const splitBarcodeAndAmounts = bulidSplitBarcodeAndAmount(tags);
		const calculateItemCounts = bulidCalculateItemsCount(splitBarcodeAndAmounts);
		const shoppingDetails = addShoppingDetailsWithSubsum(calculateItemCounts, loadAllItems());
		const aftershoppingDetails = alterShoppingDetails(shoppingDetails, loadPromotions());
		const prices=calculatePrice(aftershoppingDetails);
		//when
		let str = generateReceipt(aftershoppingDetails,prices);
		//then
		const result =`***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;
		expect(str).toBe(result);  
	});
});
// const main = require('../main/main');

// describe('main()', () => {

//     it('should calculate the remaindar', () => {
//         expect(main.caclRemaindar(9, 3)).toBe(0);
//         expect(main.caclRemaindar(11, 4)).toBe(3);
//     });

//     it('should calculate the sum of numbers which are in array', () => {
//         let numArray1 = [3, 6, 1, 8, 6, 4, 2];
//         let numArray2 = [1, 2, 6, 2, 9, 0, 4];
        
//         expect(main.caclSum(numArray1)).toBe(30);
//         expect(main.caclSum(numArray2)).toBe(24);
//     });

//     it('should calculate the sum of numbers which are in array and less than indicated num ', () => {
//         let numArray1 = [3, 6, 1, 8, 6, 4, 2];
//         let numArray2 = [1, 2, 6, 2, 9, 0, 4];
        
//         expect(main.caclSumInConditon(numArray1 , 5)).toBe(10);
//         expect(main.caclSumInConditon(numArray2 , 6)).toBe(9);
//     });

// });