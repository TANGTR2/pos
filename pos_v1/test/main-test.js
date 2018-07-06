'use strict';

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
	it('Unit test of calculateItem()', () => {
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
		const calculateItemCount = calculateItem(tags);
		//then
		let result=JSON.stringify([{"barcode":"ITEM000001","count":5},
			{"barcode":"ITEM000003","count":2.5},
			{"barcode":"ITEM000005","count":3}]);
		expect(JSON.stringify(calculateItemCount)).toBe(result);   
	});
});

describe('Unit Test',()=> {
	it('Unit test of addShoppingDetails()', () => {
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
		const calculateItemCount = calculateItem(tags);
		//when
		const shoppingDetails = addShoppingDetails(calculateItemCount, loadAllItems());;
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
		const calculateItemCount = calculateItem(tags);
		const shoppingDetails = addShoppingDetails(calculateItemCount, loadAllItems());
		//when
		const alterShoppingDetail = alterShoppingDetails(shoppingDetails, loadPromotions());
		//then
		let result=JSON.stringify([
			{"barcode":"ITEM000001","name":"雪碧","count":5,"price":3,"unit":"瓶","sum":12,"free":3},
			{"barcode":"ITEM000003","name":"荔枝","count":2.5,"price":15,"unit":"斤","sum":37.5,"free":0},
			{"barcode":"ITEM000005","name":"方便面","count":3,"price":4.5,"unit":"袋","sum":9,"free":4.5}]);
		expect(JSON.stringify(alterShoppingDetail)).toBe(result);   
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
		const calculateItemCount = calculateItem(tags);
		let shoppingDetails = addShoppingDetails(calculateItemCount, loadAllItems());
		shoppingDetails = alterShoppingDetails(shoppingDetails, loadPromotions());
		//when
		let str1 = generateReceipt(shoppingDetails);
		console.log(str1);
		//then
		const result =`***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2.5斤，单价：15.00(元)，小计：37.50(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：58.50(元)
节省：7.50(元)
**********************`;
		expect(str1).toBe(result);  
	});
});